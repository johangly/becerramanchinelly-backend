import express from "express";
import db from "../database/index.js";
import { uploadArray } from "../utils/manageFiles.js";
import { createNotification } from "../utils/notificationHelper.js";
import { da } from "zod/locales";
const router = express.Router();

router.use(express.json());
// Create a new payment appointment
router.post("/", uploadArray("paymentImage", 1), async (req, res) => {
	const transaction = await db.sequelize.transaction();
	try {
		const formData = req.body;
		const files = req.files;
		console.log(files);
		console.log(formData);
		const {
			amount,
			reference,
			client_name,
			client_email,
			client_phone,
			notes,
			user_id,
			appointment_id,
			transactionDate,
		} = formData;
		const user = await db.User.findAll({
			where: { cleark_id: user_id },
		});
		if (user.length === 0) {
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}
		const paymentAppointment =
			await db.PaymentsAppointments.create(
				{
					paymentMethodId: 3,
					status: "pendiente",
					amount,
					reference,
					client_name,
					client_email,
					client_phone,
					notes,
					user_id: user[0].id,
					is_approved: null,
					currency: "USD",
					appointment_id: appointment_id
						? parseInt(appointment_id)
						: null,
					is_approved: null,
					transactionDate: transactionDate
						? new Date(transactionDate)
						: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{ transaction }
			);
		const createImagePayment = await db.PaymentImages.create(
			{
				payment_id: paymentAppointment.id,
				file_path:
					files && files.length > 0
						? `uploads/${files[0].filename}`
						: null,
				file_name:
					files && files.length > 0
						? files[0].originalname
						: null,
				uploaded_by: 1,
				is_active: true,
				created_at: new Date(),
				uploaded_at: new Date(),
			},
			{ transaction }
		);
		await transaction.commit();
		const changeStatusOfAppointment = await db.Appointment.update(

			{ status: "reservado" },
			{ where: { id: paymentAppointment.appointment_id } }
		);
		res.status(201).json({
			status: "success",
			data: paymentAppointment,
		});
	} catch (error) {
		await transaction.rollback();
		console.error("Error creating payment appointment:", error);
		res.status(500).json({
			status: "error",
			message: "Error creating payment appointment",
			error: error.message,
		});
	}
});

// Read payment appointment by ID
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const paymentAppointment =
			await db.PaymentsAppointments.findByPk(id);
		const imageOfPayment = await db.PaymentImages.findAll({
			where: { payment_id: paymentAppointment.id },
		});
		if (!paymentAppointment) {
			return res.status(404).json({
				status: "error",
				message: "Payment appointment not found",
			});
		}

		res.status(200).json({
			status: "success",
			data: {
				paymentAppointment,
				imageOfPayment,
			},
		});
	} catch (error) {
		console.error("Error fetching payment appointment:", error);
		res.status(500).json({
			status: "error",
			message: "Error fetching payment appointment",
			error: error.message,
		});
	}
});
router.get("/", async (req, res) => {
	try {
		const response = await db.PaymentsAppointments.findAll();
		res.status(200).json({
			status: "success",
			data: response,
		});
	} catch (error) {
		console.error("Error fetching payment appointments:", error);
		res.status(500).json({
			status: "error",
			message: "Error fetching payment appointments",
			error: error.message,
		});
	}
});

// Update payment appointment
router.put("/:id", async (req, res) => {
	const transaction = await db.sequelize.transaction();
	try {
		const { id } = req.params;
		const status = req.body.status;
		const isActive =
			status === "completado"
				? true
				: status === "fallido"
				? false
				: null;
		const paymentAppointment =
			await db.PaymentsAppointments.findByPk(id);
		if (!paymentAppointment) {
			return res.status(404).json({
				status: "error",
				message: "Payment appointment not found",
			});
		}
		const updatedPaymentAppointment =
			await paymentAppointment.update({
				status,
				is_approved: true,
				isActive,
			});
		if (
			status &&
			updatedPaymentAppointment.appointment_id
		) {
			const notification = await createNotification({
				userId: updatedPaymentAppointment.user_id,
				title: `Your payment is ${status}.`,
				message: `Your payment has been updated to ${status}.`,
				type:
					status === "completado"
						? "success"
						: status === "fallido"
						? "error"
						: "other",
				payment_id: updatedPaymentAppointment.id,
			});
			console.log("Notification created:", notification);
		}
		return res.status(200).json({
			data: updatedPaymentAppointment,
			status: "success",
			message:
				"Notification created for payment status update.",
		});
	} catch (error) {
		await transaction.rollback();
		console.error("Error updating payment appointment:", error);
		res.status(500).json({
			status: "error",
			message: "Error updating payment appointment",
			error: error.message,
		});
	}
});

// Delete payment appointment
router.delete("/:id", async (req, res) => {
	const transaction = await db.sequelize.transaction();
	try {
		const { id } = req.params;

		const paymentAppointment =
			await db.PaymentsAppointments.findByPk(id);

		if (!paymentAppointment) {
			return res.status(404).json({
				status: "error",
				message: "Payment appointment not found",
			});
		}

		await paymentAppointment.destroy({ transaction });
		await transaction.commit();

		res.status(200).json({
			status: "success",
			message: "Payment appointment deleted successfully",
		});
	} catch (error) {
		await transaction.rollback();
		console.error("Error deleting payment appointment:", error);
		res.status(500).json({
			status: "error",
			message: "Error deleting payment appointment",
			error: error.message,
		});
	}
});

export default router;

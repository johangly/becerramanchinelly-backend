import express from "express";
import db from "../database/index.js";
import { uploadArray } from "../utils/manageFiles.js";
import { tr } from "zod/locales";
import { create } from "domain";

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
		console.log();
		const paymentAppointment =
			await db.PaymentsAppointments.create(
				{
					payment_method_id: 1,
					status: "pendiente",
					amount,
					reference,
					client_name,
					client_email,
					client_phone,
					notes,
					user_id: 1,
					is_approved: null,
					currency: "USD",
					appointment_id: appointment_id
						? parseInt(appointment_id)
						: null,
					is_approved: null,
					transaction_date: transactionDate
						? new Date(transactionDate)
						: new Date(),
				},
				{ transaction }
			);
		console.log(paymentAppointment);
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
			await db.PaymentsAppointments.findByPk(id,
				{
					include: {model: db.PaymentImages, as: 'payment_images'}
				}
			);

		if (!paymentAppointment) {
			return res.status(404).json({
				status: "error",
				message: "Payment appointment not found",
			});
		}

		res.status(200).json({
			status: "success",
			data: paymentAppointment,
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
		const response = await db.PaymentsAppointments.findAll	();
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
		const updates = req.body;

		const paymentAppointment =
			await db.PaymentsAppointments.findByPk(id);

		if (!paymentAppointment) {
			return res.status(404).json({
				status: "error",
				message: "Payment appointment not found",
			});
		}

		await paymentAppointment.update(updates, { transaction });
		await transaction.commit();

		res.status(200).json({
			status: "success",
			data: paymentAppointment,
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

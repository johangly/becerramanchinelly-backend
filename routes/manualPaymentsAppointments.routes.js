import express from "express";
import db from "../database/index.js";
import { uploadArray } from "../utils/manageFiles.js";
import { createNotification } from "../utils/notificationHelper.js";
import { TZDate } from "@date-fns/tz";
import { logger } from "../utils/logger.js";

const router = express.Router();

router.use(express.json());

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ZONE = process.env.ZONE_TIME;
// Create a new payment appointment
router.post("/", uploadArray("paymentImage", 1), async (req, res) => {
	logger.info("|||||||||||||||||||||||||||||||||||||||||||||||");
	logger.info("New manual payment appointment");
	const transaction = await db.sequelize.transaction();
	try {
		const formData = req.body;
		const files = req.files;

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
		logger.info(`formData ${JOSIN.stringify(formData, null, 2)}`);
		const user = await db.User.findAll({
			where: { cleark_id: user_id },
		});
		const appointment = await db.Appointment.findAll({
			where: { id: appointment_id },
		});
		const PaymentsMethods = await db.PaymentsMethods.findAll({
						where: { name: "Pago Externo" },
					});
		if (appointment[0].status === 'reservado') {
			logger.info("Appointment is already booked");
			return res.status(400).json({
				status: "error",
				message: "Appointment is already booked",
			});
		}
		if (user.length === 0) {
			logger.info("User not found");
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}

		const paymentAppointment =
			await db.PaymentsAppointments.create(
				{
					paymentMethodId: PaymentsMethods[0].id,
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
						? new TZDate(transactionDate, ZONE).internal
						: new TZDate(new Date(), ZONE).internal,
					createdAt: new TZDate(new Date(), ZONE).internal,
					updatedAt: new TZDate(new Date(), ZONE).internal,
				},
				{ transaction }
			);
		logger.info(`paymentAppointment ${JSON.stringify(paymentAppointment, null, 2)}`);
		// guarda la informacion de la imagen y su ruta
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
				created_at: new TZDate(new Date(), ZONE).internal,
				uploaded_at: new TZDate(new Date(), ZONE).internal,
			},
			{ transaction }
		);

		logger.info(`createImagePayment ${JSON.stringify(createImagePayment, null, 2)}`);

		const appointmentToUpdate = await db.Appointment.update(
			{ status: "reservado" },
			{
				where: { id: paymentAppointment.appointment_id },
				transaction
			}
		);
		// Buscar al administrador
		const adminUser = await db.User.findOne({
			where: { email: ADMIN_EMAIL },
			transaction
		});

		if (!adminUser) {
			logger.info("Admin user not found");
			return res.status(404).json({
				status: "error",
				message: "Admin user not found",
			});
		}

		logger.info(`appointmentToUpdate ${JSON.stringify(appointmentToUpdate, null, 2)}`);

		// Crear notificación para el administrador
		const creatingNotification = await db.Notification.create({
			title: 'Nuevo pago pendiente por aprobar',
			body: `Se ha recibido un pago por el monto de ${paymentAppointment.amount}$${user.name ? ` por el usuario ${user.name}` : ''}`,
			type: 'success',
			modalBody: `Se ha recibido un pago por el monto de ${paymentAppointment.amount}$${user.name ? ` por el usuario ${user.name}` : ''} para la fecha ${new TZDate(appointmentToUpdate.day, ZONE).internal} que inicia a las ${new TZDate(appointmentToUpdate.start_time, ZONE).internal} y termina a las ${new TZDate(appointmentToUpdate.end_time, ZONE).internal}
			| Nombre del cliente: ${client_name}
			| Telefono del cliente: ${client_phone}
			| Correo electrónico: ${client_email}
			| Fecha de transacción: ${new TZDate(transactionDate, ZONE).internal}
			| Referencia: ${paymentAppointment.reference}
			| Monto del pago: ${paymentAppointment.amount}
			| Notas: ${notes}
			| Metodo de pago: Pago Externo
			`,
			user_id: adminUser.id,
			payment_id: paymentAppointment.id,
			created_at: new TZDate(new Date(), ZONE).internal,
			updated_at: new TZDate(new Date(), ZONE).internal
		});
		logger.info(`creatingNotification ${JSON.stringify(creatingNotification, null, 2)}`);

		if (creatingNotification) {
			logger.info("Notification created successfully");

			await transaction.commit();

			logger.info("Proceso completado!");
			logger.info("|||||||||||||||||||||||||||||||||||||||||||||||");

			res.status(201).json({
				status: "success",
				data: paymentAppointment,
			});

		} else {
			logger.error("Error creating notification");

			return res.status(500).json({
				status: "error",
				message: "Error creating notification",
			});

		}
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
		const paymentMethod = await db.PaymentsMethods.findAll({
			where: { name: "Pago Externo" },
		});
		const response = await db.PaymentsAppointments.findAll({
			where: { paymentMethodId: paymentMethod[0].id },
		});
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

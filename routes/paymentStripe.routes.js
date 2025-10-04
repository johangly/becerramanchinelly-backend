import db from "../database/index.js";
import express from "express";
import Stripe from "stripe"; // Cambiado el nombre del import
import { createNotification } from "../utils/notificationHelper.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Instancia de Stripe

router.post("/create-checkout-session", async (req, res) => {
	try {
		const url = 'http://localhost:5173/'
		const { amount, success_url, cancel_url, appointmentId } =
			req.body;
		const appointmentInfo = await db.Appointment.findByPk(appointmentId);
		const currencyInfo = await db.Currency.findByPk(appointmentInfo?.currency_id);
		if(!amount || !appointmentId){
			return res.status(400).json({
				status: "error",
				message: "Missing required fields: amount, appointmentId"
			});
		}
		 const amountInCents = Math.round(amount * 100);

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: currencyInfo?.code,
						product_data: {
							name: "Asesoría Becerramanchinelly",
						},
						unit_amount: amountInCents,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${url}success?appointmentId=${appointmentId}&session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${url}canceled`,
		});
		res.status(200).json({
			status: "success",
			sessionId: session.id,
			url: session.url,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Error creating checkout session",
			error: error.message,
		});
	}
});
router.get("/verify-session", async (req, res) => {
	const { session_id } = req.query; // Obtener el parámetro de consulta session_id

	try {
		if (!session_id) {
			return res.status(400).json({
				status: "error",
				message: "Missing required query parameter: session_id",
			});
		}

		const session = await stripe.checkout.sessions.retrieve(session_id); // Recuperar la sesión de Stripe
		console.log('session:', session);
		res.status(200).json({
			status: "success",
			session,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Error verifying checkout session",
			error: error.message,
		});
	}
});
router.put('/updateStatus',async(req,res)=>{
		const transaction = await db.sequelize.transaction();

	const {appointmentId,user_id,amount,client_name,paymentId} = req.body;
		const user = await db.User.findAll({
				where: { cleark_id: user_id },
			});
			if (user.length === 0) {
				return res.status(404).json({
					status: "error",
					message: "User not found",
				});
			}
			const transactionDate = new Date();
			const PaymentsMethods = await db.PaymentsMethods.findAll({
				where: { name: "Stripe" },
			});
		const verifyIfPaymentExists = await db.PaymentsAppointments.findOne({
			where: { reference: paymentId },
		});
		if (verifyIfPaymentExists) {
			return res.status(400).json({
				status: "error",
				message: "Payment already has registered",
			});
		}
	try {
		if(!appointmentId){
			return res.status(400).json({
				status: "error",
				message: "Missing required fields: appointmentId"
			});
		}
		const paymentAppointment =
				await db.PaymentsAppointments.create(
					{
						paymentMethodId: PaymentsMethods[0].id,
						status: "completado",
						amount,
						reference: paymentId,
						client_name,
						client_email: user[0].email,
						user_id: user[0].id,
						is_approved: null,
						currency: "USD",
						appointment_id: appointmentId
							? parseInt(appointmentId)
							: null,
						is_approved: true,
						transactionDate: transactionDate
							? new Date(transactionDate)
							: new Date(),
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					{ transaction }
				);

		const appointment = await db.Appointment.findByPk(appointmentId);
		if(!paymentAppointment){
			return res.status(404).json({
				status: "error",
				message: "payment not found"
			});
		}
		if (!appointment) {
			return res.status(404).json({
				status: "error",
				message: "Appointment not found",
			});
		}
		const updateAppointment=await appointment.update(
			{
				status: "reservado",
			},
			{
				where: { id: appointmentId },
				transaction,
			});
			await transaction.commit();
		const notification = await createNotification({
						userId: user[0].id,
						title: `Your payment is ${paymentAppointment.status}.`,
						message: `Your payment has been updated to ${paymentAppointment.status}.`,
						type:
							paymentAppointment === "completado"
								? "success"
								: paymentAppointment.status === "fallido"
								? "error"
								: "other",
						payment_id: paymentAppointment.id,
					}	);
		res.status(200).json({
			status: "success",
			paymentAppointment,
			updateAppointment
		});

	} catch (error) {
		console.error("Error updating appointment status:", error);
		res.status(500).json({
			status: "error",
			message: "Error updating appointment status",
			error: error.message,
		});
	}
});
router.get("/", async (req, res) => {;
	try {
		const paymentMehtods = await db.PaymentsMethods.findAll({
			where: { name: "Stripe" },
		});
		if (paymentMehtods.length === 0) {
			return res.status(404).json({
				status: "error",
				message: "Payment methods not found",
			});
		}
		const paymentsAppointments = await db.PaymentsAppointments.findAll({
			where: { paymentMethodId: paymentMehtods[0].id },

			order: [["createdAt", "DESC"]],
		});
		res.status(200).json({
			paymentsAppointments,
			status: "success",
		});
	} catch (error) {
		console.error("Error retrieving payments appointments:", error);
		res.status(500).json({
			status: "error",
			message: "Error retrieving payments appointments",
			error: error.message,
		});
	}
})

router.get("/:id", async (req, res) => {
	const { id } = req.params;
	console.log(id)
	try {
		const paymentAppointment = await db.PaymentsAppointments.findByPk(id);
		if (!paymentAppointment) {
			return res.status(404).json({
				status: "error",
				message: "Payment appointment not found",
			});
		}
		res.status(200).json({
			paymentAppointment,
			status: "success",
		});
	} catch (error) {
		console.error("Error retrieving payment appointment:", error);
		res.status(500).json({
			status: "error",
			message: "Error retrieving payment appointment",
			error: error.message,
		});
	}
});
export default router;
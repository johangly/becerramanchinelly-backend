import db from "../database/index.js";
import express from "express";
import Stripe from "stripe"; // Cambiado el nombre del import

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Instancia de Stripe

router.post("/create-checkout-session", async (req, res) => {
	try {
		const url = 'http://localhost:5173/'
		const { amount, success_url, cancel_url, appointmentId } =
			req.body;

		console.log(amount, success_url, cancel_url, appointmentId);
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
						currency: "usd",
						product_data: {
							name: "Asesoría Becerramanchinelly",
						},
						unit_amount: amountInCents,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${url}?success=true?appointmentId=${appointmentId}`,
			cancel_url: `${url}?canceled=true`,
		});
		console.log(session);
		res.status(200).json({
			status: "success",
			sessionId: session.id,
			url: session.url,
		});
	} catch (error) {
		console.error("Error creating checkout session:", error);
		res.status(500).json({
			status: "error",
			message: "Error creating checkout session",
			error: error.message,
		});
	}
});
export default router;
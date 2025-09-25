import { where } from 'sequelize';
import db from '../database/index.js';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const paymentMethods = await db.PaymentsMethods.findAll({
			where:{is_active:true}
		});
		res.status(200).json({
			status: 'success',
			data: paymentMethods,
		});
	} catch (error) {
		console.error('Error fetching payment methods:', error);
		res.status(500).json({
			status: 'error',
			message: 'Error fetching payment methods',
			error: error.message,
		});
	}
});
export default router;
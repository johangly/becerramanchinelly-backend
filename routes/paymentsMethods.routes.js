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
router.get('/admin', async (req, res) => {
	try {
		const paymentMethods = await db.PaymentsMethods.findAll();
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


router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { is_active } = req.body;
	try {
		const paymentMethod = await db.PaymentsMethods.findByPk(id);
		if (!paymentMethod) {
			return res.status(404).json({
				status: 'error',
				message: 'Payment method not found',
			});
		}
		paymentMethod.is_active = is_active;
		await paymentMethod.save();
		res.status(200).json({
			status: 'success',
			message: 'Payment method updated successfully',
			paymentMethod,
		});
	} catch (error) {

		console.error('Error updating payment method:', error);
		res.status(500).json({
			status: 'error',
			message: 'Error updating payment method',
			error: error.message,
		});
	}
});

export default router;
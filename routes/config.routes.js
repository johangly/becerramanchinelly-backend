import db from "../database/index.js";
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const configs = await db.Configuration.findAll();
		res.status(200).json({
			status: "success",
			configs,
		});
	} catch (error) {
		console.error("Error fetching configs:", error);
		res.status(500).json({
			status: "error",
			message: "Error fetching configs",
			error: error.message,
		});
	}
});
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const config = await db.Configuration.findByPk(id);
		if (!config) {
			return res.status(404).json({
				status: "error",
				message: "Config not found",
			});
		}
		res.status(200).json({
			status: "success",
			data: config,
		});
	}	 catch (error) {
		console.error("Error fetching config:", error);
		res.status(500).json({
			status: "error",
			message: "Error fetching config",
			error: error.message,
		});
	}
});

router.put('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { newValues } = req.body;
		const config = await db.Configuration.findByPk(id);
		if (!config) {
			return res.status(404).json({
				status: "error",
				message: "Config not found",
			});
		}
		const updatedConfig = await config.update(newValues);
		res.status(200).json({
			status: "success",
			data: updatedConfig,
		});
	} catch (error) {
		console.error("Error updating config:", error);
		res.status(500).json({
			status: "error",
			message: "Error updating config",
			error: error.message,
		});
	}
})

export default router;
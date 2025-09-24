import express from "express";
import db from "../database/index.js";

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
	try {
		const notifications = await db.Notifications.findAll({
			order: [["createdAt", "DESC"]],
		});
		res.json({ notifications });
	} catch (error) {
		console.error("Error fetching notifications:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});
router.get("/:userId", async (req, res) => {
	const { userId } = req.params;
	try {
		const notifications = await db.Notifications.findAll({
			where: { user_id: userId },
			order: [["createdAt", "DESC"]],
		});
		res.json({ notifications });
	} catch (error) {
		console.error("Error fetching notifications:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});
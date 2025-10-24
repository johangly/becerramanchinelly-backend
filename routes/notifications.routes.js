import express from "express";
import db from "../database/index.js";

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
	try {
		const notifications = await db.Notification.findAll({
			order: [["createdAt", "DESC"]],
		});
		res.json({ notifications });
	} catch (error) {
		console.error("Error fetching notifications:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});
router.put("/mark-notifications-read", async (req, res) => {
	const { idsNotifications } = req.body;
	try {
		const result = await db.Notification.update(
			{ seen: true },
			{ where: { id: idsNotifications } }
		);
		res.status(200).json({
			status: "success",
			message: "Notifications marked as read",
		});
	} catch (error) {
		console.error("Error marking notifications as read:", error);
		res.status(500).json({
			error: "Error marking notifications as read",
			message: error.message,
		});
	}
});
router.get("/:userId", async (req, res) => {
	const { userId } = req.params;
	try {
		const user = await db.User.findOne({
			where: { cleark_id: userId },
		});
		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}
		const notifications = await db.Notification.findAll({
			where: { user_id: user.id },
			order: [["createdAt", "DESC"]],
		});
		res.json({ notifications });
	} catch (error) {
		console.error("Error fetching notifications:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

export default router;
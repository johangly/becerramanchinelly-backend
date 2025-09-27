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
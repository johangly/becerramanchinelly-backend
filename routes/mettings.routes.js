import db from "../database/index.js";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { name, description } = req.body;
		const newMeetingPlatform = await db.MeetingPlatforms.create({
			name,
			description,
			is_active: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		res.status(201).json({
			status: "success",
			message: "Meeting platform created successfully",
			newMeetingPlatform,
		});
	} catch (error) {
		console.error("Error creating meeting platform:", error);
		res.status(500).json({
			status: "error",
			message: "Error creating meeting platform",
			error: error.message,
		});
	}
});
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { name, description, is_active } = req.body;
	try {
		const meetingPlatform = await db.MeetingPlatforms.findByPk(
			id
		);
		if (!meetingPlatform) {
			return res.status(404).json({
				status: "error",
				message: "Meeting platform not found",
			});
		}
		const updatedMeetingPlatform = await meetingPlatform.update(
			{
				name,
				description,
				is_active,
				updatedAt: new Date(),
			},
			{
				where: { id },
			}
		);
		res.status(200).json({
			status: "success",
			message: "Meeting platform updated successfully",
			updatedMeetingPlatform,
		});
	} catch (error) {
		console.error("Error updating meeting platform:", error);
		res.status(500).json({
			status: "error",
			message: "Error updating meeting platform",
			error: error.message,
		});
	}
});
router.get("/", async (req, res) => {
	try {
		const MeetingPlatforms = await db.MeetingPlatforms.findAll();
		res.status(200).json({
			status: "success",
			MeetingPlatforms,
		});
	} catch (error) {
		console.error("Error fetching meeting platforms:", error);
		res.status(500).json({
			status: "error",
			message: "Error fetching meeting platforms",
			error: error.message,
		});
	}
});
router.get("/active", async (req, res) => {
	try {
		const MeetingPlatforms = await db.MeetingPlatforms.findAll({
			where: { is_active: true },
		});
		res.status(200).json({
			status: "success",
			data: MeetingPlatforms,
		});
	} catch (error) {

		console.error("Error fetching active meeting platforms:", error);
		res.status(500).json({
			status: "error",
			message: "Error fetching active meeting platforms",
			error: error.message,
		});
	}
});
export default router;
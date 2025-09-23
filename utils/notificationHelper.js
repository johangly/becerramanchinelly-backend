import db from "../database/index.js";

export const createNotification = async ({
	userId,
	title,
	message,
	type,
	payment_id

}) => {
	console.log("userId, title, message, type, payment_id", userId, title, message, type, payment_id);
	try {
		const notification = await db.Notification.create({
			user_id: userId,
			payment_id,
			title,
			body:message,
			type,
			seen: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		return notification;
	} catch (error) {
		console.error("Error creating notification:", error);
		throw new Error("Failed to create notification");
	}
};

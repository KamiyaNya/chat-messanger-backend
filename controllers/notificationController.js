const prisma = require('../prisma/prismaInstance');

class Notifications {
	async getNotifications(req, res) {
		try {
			const reqUserId = req.userId;
			const HOST = process.env.HOST;
			const notifications = await prisma.notifications.findMany({
				where: {
					userId: reqUserId,
				},
			});
			const notificationsData = await Promise.all(
				notifications.map(async (notification) => {
					const notificationResult = await prisma.inviteToRoom.findFirst({
						where: {
							id: notification.notificationId,
						},
					});

					const userFrom = await prisma.user.findFirst({
						where: {
							id: notificationResult.fromUserId,
						},
						select: {
							id: true,
							userName: true,
							userImage: true,
						},
					});
					if (userFrom.userImage) {
						userFrom.userImage = HOST + userFrom.userImage;
					}

					return {
						id: notification.id,
						type: notification.type,
						notification: notificationResult,
						user: userFrom,
					};
				})
			);

			res.status(200).json({ success: true, data: { notifications: notificationsData } });
		} catch (error) {
			res.status(400).json({ success: false });
		}
	}

	async confirmInviteToRoom(req, res) {
		try {
			const reqUserId = req.userId;
			const { notificationInviteRoomId } = req.body;

			await prisma.notifications.updateMany({
				where: {
					userId: reqUserId,
				},
				data: {
					viewed: true,
				},
			});

			await prisma.inviteToRoom.update({
				where: {
					id: notificationInviteRoomId,
				},
				data: {
					accept: 1,
				},
			});
			const inviteToRoomNotification = await prisma.inviteToRoom.findFirst({
				where: {
					id: notificationInviteRoomId,
				},
			});
			await prisma.rooms.createMany({
				data: [
					{ roomUUID: inviteToRoomNotification.roomId, userId: inviteToRoomNotification.fromUserId },
					{ roomUUID: inviteToRoomNotification.roomId, userId: inviteToRoomNotification.toUserId },
				],
			});

			res.status(200).json({ success: true });
		} catch (error) {
			console.log(error);
			res.status(400).json({ success: false });
		}
	}

	async rejectInviteToRoom(req, res) {
		try {
			const reqUserId = req.userId;
			const { notificationInviteRoomId } = req.body;

			await prisma.notifications.updateMany({
				where: {
					userId: reqUserId,
				},
				data: {
					viewed: true,
				},
			});

			await prisma.inviteToRoom.update({
				where: {
					id: notificationInviteRoomId,
				},
				data: {
					accept: 2,
				},
			});
			res.status(200).json({ success: true });
		} catch (error) {
			console.log(error);
			res.status(400).json({ success: false });
		}
	}
}

module.exports = new Notifications();

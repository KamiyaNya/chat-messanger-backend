const prisma = require('../prisma/prismaInstance');
const decodeToken = require('../utils/decodeToken');

class Chat {
	async createRoom(req, res) {
		try {
			const reqUserId = req.userId;
			const { userId, roomId } = req.body;

			await prisma.rooms.create({
				data: {
					roomUUID: roomId,
					userId: reqUserId,
					friendId: userId,
				},
			});

			res.status(200).json({
				success: true,
				data: {
					roomId: roomId,
				},
			});
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async getRoomMessages(req, res) {
		try {
			const { roomId, skip } = req.query;

			const totalMessages = await prisma.personalMessages.count({
				where: {
					roomUUID: roomId,
				},
			});
			const skipRange = skip ? skip : totalMessages > 10 ? totalMessages - 10 : 0;

			const messages = await prisma.personalMessages.findMany({
				where: {
					roomUUID: roomId,
				},
				skip: skipRange,
				take: 10,
			});

			res.status(200).json({
				success: true,
				data: {
					messages: messages,
					totalMessages: totalMessages,
					restMessages: skipRange,
				},
			});
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	}
}

module.exports = new Chat();

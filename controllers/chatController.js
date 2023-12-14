const prismaInstance = require('../prisma/prismaInstance');
const decodeToken = require('../utils/decodeToken');

class Chat {
	async createRoom(req, res) {
		try {
			const reqUserId = req.userId;
			const { userId, roomId } = req.body;

			await prismaInstance.rooms.create({
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
			const { roomId } = req.query;

			const messages = await prismaInstance.personalMessages.findMany({
				where: {
					roomUUID: roomId,
				},
			});

			res.status(200).json({
				success: true,
				data: {
					messages: messages,
				},
			});
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	}
}

module.exports = new Chat();

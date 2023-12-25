const { v4: uuidv4 } = require('uuid');
const prisma = require('../prisma/prismaInstance');

const notificationTypes = {
	inviteToRoom: 'inviteToRoom',
};

class Users {
	async getUsers(req, res) {
		try {
			const reqUserId = req.userId;
			const { name } = req.query;

			let rooms = await prisma.rooms.findMany({
				where: {
					userId: reqUserId,
				},
				select: {
					roomUUID: true,
				},
			});

			rooms = rooms.map((room) => {
				return room.roomUUID;
			});

			let uniqueUsers = [];
			const HOST = process.env.HOST;

			if (rooms.length) {
				const userIds = await Promise.all(
					rooms.map(async (room) => {
						const { userId } = await prisma.rooms.findFirst({
							where: {
								roomUUID: room,
								userId: {
									not: reqUserId,
								},
							},
							select: {
								userId: true,
							},
						});

						return userId;
					})
				);

				const users = await Promise.all(
					userIds.map(async (userId) => {
						const result = await prisma.user.findFirst({
							select: {
								id: true,
								userName: true,
								userImage: true,
							},
							where: {
								userName: { contains: name.trim() },
								id: {
									not: userId,
								},
							},
							orderBy: {
								userCreatedAt: 'desc',
							},
							take: 10,
						});

						if (!uniqueUsers.some((user) => user.id === result.id)) {
							if (result.userImage) {
								result.userImage = HOST + result.userImage;
							}
							uniqueUsers.push(result);
						}
					})
				);
			} else {
				uniqueUsers = await prisma.user.findMany({
					select: {
						id: true,
						userName: true,
						userImage: true,
					},
					where: {
						userName: { contains: name.trim() },
						id: {
							not: reqUserId,
						},
					},
					orderBy: {
						userCreatedAt: 'desc',
					},
					take: 10,
				});

				uniqueUsers = uniqueUsers.map((user) => {
					return { ...user, userImage: user.userImage ? HOST + user.userImage : null };
				});
			}

			res.status(200).json({
				success: true,
				data: {
					users: uniqueUsers,
				},
			});
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async getFriends(req, res) {
		try {
			const reqUserId = req.userId;

			let currentUserRooms = await prisma.rooms.findMany({
				where: {
					userId: reqUserId,
				},
				select: {
					roomUUID: true,
				},
			});
			currentUserRooms = currentUserRooms.map((room) => {
				return room.roomUUID;
			});

			const roomUsers = await Promise.all(
				currentUserRooms.map(async (room) => {
					return await prisma.rooms.findFirst({
						where: {
							roomUUID: room,
							NOT: {
								userId: reqUserId,
							},
						},
						include: {
							user: true,
						},
					});
				})
			);
			const HOST = process.env.HOST;
			const users = roomUsers.map((room) => {
				return {
					id: room.user.id,
					userName: room.user.userName,
					userOnline: room.user.userOnline,
					userLastOnline: room.user.userLastOnline,
					userImage: room.user.userImage ? HOST + room.user.userImage : null,
					roomUUID: room.roomUUID,
				};
			});

			res.status(200).json({
				success: true,
				data: {
					friends: users,
				},
			});
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async sendInviteToPersonalRoom(req, res) {
		try {
			const reqUserId = req.userId;
			const { userId } = req.body;

			const roomId = uuidv4();

			const createInvite = await prisma.inviteToRoom.create({
				data: {
					fromUserId: reqUserId,
					toUserId: userId,
					roomId: roomId,
				},
			});

			const createNotification = await prisma.notifications.create({
				data: {
					notificationId: createInvite.id,
					type: notificationTypes.inviteToRoom,
					userId: userId,
				},
			});

			res.status(200).json({
				success: true,
			});
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });

			console.log();
		}
	}
}

module.exports = new Users();

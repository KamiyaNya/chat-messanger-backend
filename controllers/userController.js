const decodeToken = require('../utils/decodeToken');
const prisma = require('../prisma/prismaInstance');

class Users {
	async getUsers(req, res) {
		try {
			const reqUserId = req.userId;
			const { name } = req.query;

			let friends = await prisma.friends.findMany({
				where: {
					userId: reqUserId,
				},
				include: {
					user: true,
				},
			});

			friends = friends.map((friend) => {
				return { id: friend.user.id, userName: friend.user.userName, userImage: friend.user.userImage };
			});

			const users = await prisma.user.findMany({
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
					AND: [
						{
							Friends: {
								every: {
									userId: { not: reqUserId },
								},
							},
						},
					],
				},
				orderBy: {
					userCreatedAt: 'desc',
				},
				take: 10,
			});

			res.status(200).json({
				success: true,
				data: {
					friends: friends,
					users: users,
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

			const users = roomUsers.map((room) => {
				return {
					id: room.user.id,
					userName: room.user.userName,
					userOnline: room.user.userOnline,
					userLastOnline: room.user.userLastOnline,
					userImage: room.user.userImage,
				};
			});

			console.log(users);

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

	async addFriend(req, res) {
		try {
			const reqUserId = req.userId;
			const { friendId } = req.body;

			const addToFriend = await prismaInstance.friends.create({
				data: {
					userId: reqUserId,
					friendId: friendId,
				},
			});

			res.status(200).json({
				success: true,
				data: {
					addedFriend: addToFriend,
				},
			});
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	}
}

module.exports = new Users();

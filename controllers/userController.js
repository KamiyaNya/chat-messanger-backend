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
			res.status(500).json({ success: false, error: error.message });
		}
	}

	async getFriends(req, res) {
		try {
			const reqUserId = req.userId;

			let friendsIds = await prisma.friends.findMany({
				where: {
					userId: reqUserId,
				},
				select: {
					friendId: true,
				},
			});

			let friendInfo = await Promise.all(
				friendsIds.map(async (friendId) => {
					const friend = await prisma.user.findUnique({
						where: { id: friendId.friendId },
						select: { id: true, userName: true, userOnline: true, userLastOnline: true, userImage: true },
					});
					const room = await prisma.rooms.findFirst({
						where: {
							userId: id,
							friendId: friendId.friendId,
						},
					});

					return { ...friend, roomUUId: room?.roomUUID };
				})
			);

			res.status(200).json({
				success: true,
				data: {
					friends: friendInfo,
				},
			});
		} catch (error) {
			res.status(500).json({ success: false, error: error.message });
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

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwtVerify = require('../middleware/jwtVerify');
const chalk = require('chalk');
const decodeToken = require('../utils/decodeToken');
const userRouter = express.Router();
const prisma = new PrismaClient();

userRouter.get('/api/find_user_and_groups', jwtVerify, async (req, res) => {
	try {
		const { name } = req.query;

		const currentUser = decodeToken(req);
		let friends = await prisma.friends.findMany({
			where: {
				userId: currentUser.id,
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
					not: currentUser.id,
				},
				AND: [
					{
						Friends: {
							every: {
								userId: { not: currentUser.id },
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

		const groups = await prisma.group.findMany({
			where: {
				groupName: name,
			},
			take: 10,
		});

		res.status(200).json({
			success: true,
			data: {
				friends: friends,
				users: users,
				groups: groups,
			},
		});
	} catch (error) {
		console.log(chalk.red(error.message));
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = userRouter;

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypts = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();
const tokenService = require('../service/token.service.js');
const router = express.Router();

router.post('/api/login', async (req, res) => {
	try {
		const { userEmail, userPassword } = req.body;
		await prisma.$connect();

		const isUserExist = await prisma.user.findFirst({
			where: {
				userEmail: userEmail.trim(),
			},
		});

		if (!isUserExist) {
			return res.status(400).json({
				success: false,
				field: 'email',
				message: 'Пользователь с такой почтой не найден',
			});
		}

		const isPasswordValid = bcrypts.compareSync(userPassword, isUserExist.userPassword);

		if (!isPasswordValid) {
			return res.status(400).json({
				success: false,
				field: 'password',
				message: 'Неверный пароль',
			});
		}

		const user = { userEmail: isUserExist.userEmail, userId: isUserExist.id, userEmail: isUserExist.userName };

		const tokens = await tokenService.generateToken(user);

		res.cookie('accessToken', tokens.accessToken);
		res.cookie('refreshToken', tokens.refreshToken);
		res.json({
			success: true,
			payload: {
				accessToken: tokens.accessToken,
				refreshToken: tokens.refreshToken,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

router.post('/api/register', async (req, res) => {
	try {
		const { userEmail, userName, userPassword } = req.body;

		await prisma.$connect();

		const isUserByEmailExist = await prisma.user.findUnique({
			where: {
				userEmail: userEmail,
			},
		});

		if (isUserByEmailExist) {
			return res.status(400).json({
				success: false,
				field: 'email',
				message: 'Пользователь с такой почтой уже существует',
			});
		}

		const isUserByUsernameExist = await prisma.user.findUnique({
			where: {
				userEmail: userEmail,
			},
		});

		if (isUserByUsernameExist) {
			return res.status(400).json({
				success: false,
				field: 'username',
				message: 'Такой пользователь уже существует',
			});
		}

		const user = await prisma.user.create({
			data: {
				userEmail: userEmail,
				userName: userName,
				userPassword: bcrypts.hashSync(userPassword, 6),
				userUUID: uuidv4(),
				userLastOnline: new Date(),
				userOnline: false,
			},
		});

		res.json({ success: true, user: user });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

router.get('/', (req, res) => {
	res.send('Hello');
});

module.exports = router;

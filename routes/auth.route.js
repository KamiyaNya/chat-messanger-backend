const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypts = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();
const tokenService = require('../service/token.service.js');
const jwtVerify = require('../middleware/jwtVerify.js');
const authRouter = express.Router();

authRouter.get('/api/refresh', async (req, res) => {
	try {
		const token = req.cookies.refreshToken;
		if (!token) {
			res.clearCookie('accessToken');
			res.clearCookie('refreshToken');
			return res.status(403).json({ success: false, error: 'Вы не авторизованы' });
		}

		const tokens = await tokenService.refreshToken(token);

		res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 1000 * 30, sameSite: 'none' });
		res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 60 * 30, sameSite: 'none' });

		res.status(200).json({
			success: true,
			payload: {
				accessToken: tokens.accessToken,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

authRouter.post('/api/login', async (req, res) => {
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
		// console.log(req.cookies);
		const user = { userEmail: isUserExist.userEmail, userId: isUserExist.id, userName: isUserExist.userName };

		const tokens = await tokenService.generateToken(user, req.cookies.refreshToken);

		res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 1000 * 30, sameSite: 'none' });
		res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 60 * 30, sameSite: 'none' });
		res.status(200).json({
			success: true,
			payload: {
				accessToken: tokens.accessToken,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

authRouter.post('/api/register', async (req, res) => {
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

		res.status(200).json({ success: true, user: user });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

authRouter.get('/api/logout', (req, res) => {
	try {
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
	}
});
authRouter.get('/api/is_auth', jwtVerify, async (req, res) => {
	try {
		const token = req.cookies.refreshToken;
		const tokens = await tokenService.refreshToken(token);
		res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 1000 * 30, sameSite: 'none' });
		res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 60 * 30, sameSite: 'none' });

		res.status(200).json({
			success: true,
			payload: {
				accessToken: tokens.accessToken,
			},
			message: 'user is auth',
		});
	} catch (error) {
		console.log(error);
	}
});

module.exports = authRouter;

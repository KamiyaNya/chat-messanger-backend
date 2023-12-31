const dayjs = require('dayjs');
const bcrypts = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../prisma/prismaInstance');
const tokenService = require('../service/token.service.js');

class Auth {
	async login(req, res) {
		try {
			const { userEmail, userPassword } = req.body;

			const isUserExist = await prisma.user.findFirst({
				where: {
					userEmail: userEmail.trim(),
				},
			});

			if (!isUserExist) {
				return res.status(400).json({
					success: false,
					field: 'email',
					message: 'Неверная почта или пароль',
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
			const user = { id: isUserExist.id, userName: isUserExist.userName };

			const tokens = await tokenService.generateToken(user);
			const HOST = process.env.HOST;

			if (user.userImage) {
				user.userImage = HOST + isUserExist.userImage;
			}

			await prisma.user.update({
				where: {
					id: isUserExist.id,
				},
				data: {
					userOnline: true,
					userLastOnline: dayjs().format(),
				},
			});

			res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 60 * 30, sameSite: 'none', secure: true });

			res.status(200).json({
				success: true,
				data: { user: user, accessToken: tokens.accessToken },
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				message: error.message,
			});

			console.log(error);
		}
	}

	async register(req, res) {
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
				},
			});

			res.status(200).json({ success: true, user: user });
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	}

	async refresh(req, res) {
		try {
			const token = req.cookies.refreshToken;
			if (!token) {
				res.clearCookie('refreshToken');
				return res.status(403).json({ success: false, error: 'Вы не авторизованы' });
			}

			const tokens = await tokenService.refreshToken(token);

			res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 60 * 30, sameSite: 'none', secure: true });

			res.status(200).json({
				success: true,
				payload: {
					accessToken: tokens.accessToken,
				},
			});
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
			console.log(error);
		}
	}

	async logout(req, res) {
		try {
			await prisma.user.update({
				where: {
					id: req.userId,
				},
				data: {
					userOnline: false,
					userLastOnline: dayjs().format(),
				},
			});
			res.clearCookie('accessToken');
			res.clearCookie('refreshToken');
			res.status(200).json({ success: true });
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	}
	async isAuth(req, res) {
		try {
			res.status(200).json({
				success: true,
			});
		} catch (error) {
			res.status(401).json({
				success: false,
				message: error.message,
			});
		}
	}
}

module.exports = new Auth();

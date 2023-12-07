const { PrismaClient } = require('@prisma/client');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

class Token {
	async generateToken(user) {
		await prisma.$connect();

		const privateKey = process.env.JWT_PRIVATE;
		const accessToken = jwt.sign(user, privateKey, {
			expiresIn: '5m',
		});
		const refreshToken = jwt.sign({ token: accessToken }, privateKey, {
			expiresIn: '30d',
		});

		const refreshExpired = dayjs().add(30, 'day').format();
		await prisma.tokens.create({
			data: {
				token: refreshToken,
				expireIn: refreshExpired,
				userId: user.userId,
			},
		});

		return {
			accessToken,
			refreshToken,
		};
	}

	async refreshToken(user, token) {
		await prisma.$connect();
		const privateKey = process.env.JWT_PRIVATE;

		const tokenFromDatabase = await prisma.tokens.findFirst({
			where: {
				token: token,
			},
		});

		if (!tokenFromDatabase) {
			return {
				error: 'Токен удален или истек',
			};
		}

		const accessToken = jwt.sign(user, privateKey, {
			expiresIn: '5m',
		});

		const refreshToken = jwt.sign({ token: accessToken }, privateKey, {
			expiresIn: '30d',
		});
		const refreshExpired = dayjs().add(30, 'day').format();
		await prisma.tokens.create({
			data: {
				token: refreshToken,
				expireIn: refreshExpired,
				userId: user.userId,
			},
		});

		return {
			accessToken,
			refreshToken,
		};
	}
}

module.exports = new Token();

const { PrismaClient } = require('@prisma/client');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

class Token {
	async generateToken(user, token) {
		await prisma.$connect();

		const privateKey = process.env.JWT_PRIVATE;
		const accessToken = jwt.sign(user, privateKey, {
			expiresIn: '30s',
		});

		const refreshToken = jwt.sign({ token: accessToken }, privateKey, {
			expiresIn: '30d',
		});

		const isTokenExist = await prisma.tokens.findFirst({
			where: {
				userId: user.userId,
			},
		});
		const refreshExpired = dayjs().add(30, 'day').format();

		if (isTokenExist) {
			await prisma.tokens.update({
				where: {
					id: isTokenExist.id,
				},
				data: {
					token: refreshToken,
					expireIn: refreshExpired,
					userId: user.userId,
				},
			});
		} else {
			await prisma.tokens.create({
				data: {
					token: refreshToken,
					expireIn: refreshExpired,
					userId: user.userId,
				},
			});
		}

		return {
			accessToken,
			refreshToken,
		};
	}

	async refreshToken(token) {
		await prisma.$connect();
		const privateKey = process.env.JWT_PRIVATE;

		const isTokenExist = await prisma.tokens.findFirst({
			where: {
				token: token,
			},
		});

		if (!isTokenExist) {
			return {
				error: 'Токен удален или истек',
			};
		}

		const user = await prisma.user.findFirst({
			where: {
				id: isTokenExist.userId,
			},
			select: {
				userEmail: true,
				id: true,
				userName: true,
			},
		});

		const accessToken = jwt.sign(user, privateKey, {
			expiresIn: '30s',
		});

		const refreshToken = jwt.sign({ token: accessToken }, privateKey, {
			expiresIn: '30d',
		});

		const refreshExpired = dayjs().add(30, 'day').format();

		if (isTokenExist) {
			await prisma.tokens.update({
				where: {
					id: isTokenExist.id,
				},
				data: {
					token: refreshToken,
					expireIn: refreshExpired,
					userId: user.id,
				},
			});
		} else {
			await prisma.tokens.create({
				data: {
					token: refreshToken,
					expireIn: refreshExpired,
					userId: user.id,
				},
			});
		}

		return {
			accessToken,
			refreshToken,
		};
	}
}

module.exports = new Token();

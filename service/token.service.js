const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/prismaInstance');

class Token {
	constructor() {
		this.privateKey = process.env.JWT_PRIVATE;
	}

	async generateToken(user, token) {
		const accessToken = jwt.sign(user, this.privateKey, {
			expiresIn: '30s',
		});

		const refreshToken = jwt.sign({ token: accessToken }, this.privateKey, {
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

		const accessToken = jwt.sign(user, this.privateKey, {
			expiresIn: '30s',
		});

		const refreshToken = jwt.sign({ token: accessToken }, this.privateKey, {
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

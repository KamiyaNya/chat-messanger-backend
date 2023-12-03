const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypts = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const prisma = new PrismaClient();

router.post('/api/login', (req, res) => {
	res.json({ success: true });
});

router.post('/api/register', async (req, res) => {
	const { userEmail, userName, userPassword } = req.body;

	await prisma.$connect();

	const isUserByEmailExist = await prisma.user.findUnique({
		where: {
			userEmail: userEmail,
		},
	});

	if (isUserByEmailExist) {
		return res.json({
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
		return res.json({
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
});

router.get('/', (req, res) => {
	res.send('Hello');
});

module.exports = router;

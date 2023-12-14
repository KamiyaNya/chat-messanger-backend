const express = require('express');
const checkAuth = require('../middleware/checkAuth.js');
const authController = require('../controllers/authController.js');

const authRouter = express.Router();

authRouter.post('/api/auth/login', authController.login);

authRouter.post('/api/auth/register', authController.register);

authRouter.get('/api/auth/refresh', authController.refresh);

authRouter.get('/api/auth/logout', checkAuth, authController.logout);

authRouter.get('/api/auth/is_auth', checkAuth, authController.isAuth);

module.exports = authRouter;

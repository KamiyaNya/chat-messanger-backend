const express = require('express');
const jwtVerify = require('../middleware/jwtVerify');
const chatRouter = express.Router();

chatRouter.get('/api/chat', jwtVerify, (req, res) => {
	res.send('ok');
});

module.exports = chatRouter;

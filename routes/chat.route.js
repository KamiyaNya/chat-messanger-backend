const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const chatController = require('../controllers/chatController');

const chatRouter = express.Router();

chatRouter.post('/api/chat/create_room', checkAuth, chatController.createRoom);

chatRouter.get('/api/chat/room_messages', checkAuth, chatController.getRoomMessages);

module.exports = chatRouter;

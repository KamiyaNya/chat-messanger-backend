const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const notificationController = require('../controllers/notificationController');

const notificationRouter = express.Router();

notificationRouter.get('/api/notifications/get_notifications', checkAuth, notificationController.getNotifications);
notificationRouter.post('/api/notifications/confirm_invite', checkAuth, notificationController.confirmInviteToRoom);
notificationRouter.post('/api/notifications/reject_invite', checkAuth, notificationController.rejectInviteToRoom);

module.exports = notificationRouter;

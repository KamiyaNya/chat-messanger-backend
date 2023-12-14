const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/api/users/find_user_and_groups', checkAuth, userController.getUsers);

userRouter.get('/api/users/friends', checkAuth, userController.getFriends);

userRouter.post('/api/users/add_friend', checkAuth, userController.addFriend);

module.exports = userRouter;

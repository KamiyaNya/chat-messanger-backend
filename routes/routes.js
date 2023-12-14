const express = require('express');
const router = express.Router();
const auth = require('./auth.route.js');
const chat = require('./chat.route.js');
const users = require('./users.route.js');

router.use(auth);
router.use(chat);
router.use(users);

module.exports = router;

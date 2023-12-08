const express = require('express');
const router = express.Router();
const auth = require('./auth.route.js');
const chat = require('./chat.route.js');
router.use(auth);
router.use(chat);

module.exports = router;

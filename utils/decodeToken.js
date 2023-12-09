const jwt = require('jsonwebtoken');

module.exports = function (req) {
	const secret = process.env.JWT_PRIVATE;
	const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
	const decoded = jwt.verify(accessToken, secret);
	return decoded;
};

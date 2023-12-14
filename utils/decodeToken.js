const jwt = require('jsonwebtoken');

module.exports = function (token) {
	const secret = process.env.JWT_PRIVATE;
	const decoded = jwt.decode(token, secret);
	return decoded;
};

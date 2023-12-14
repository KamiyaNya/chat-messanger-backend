const jwt = require('jsonwebtoken');

module.exports = function checkAuth(req, res, next) {
	try {
		let accessToken = req.headers.authorization.split(' ')[1];
		const secret = process.env.JWT_PRIVATE;
		const { id } = jwt.verify(accessToken, secret);
		req.userId = id;
		next();
	} catch (error) {
		if (error.message === 'jwt expired') {
			return res.status(401).json({ success: false, error: error.message });
		} else {
			return res.status(403).json({ success: false, error: error.message });
		}
	}
};

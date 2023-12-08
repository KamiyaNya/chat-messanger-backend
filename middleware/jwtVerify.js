const jwt = require('jsonwebtoken');

module.exports = function jwtVerify(req, res, next) {
	try {
		const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
		const refreshToken = req.cookies.refreshToken;
		const secret = process.env.JWT_PRIVATE;
		if (!refreshToken) {
			res.clearCookie('accessToken');
			res.clearCookie('refreshToken');
			return res.status(403).json({ success: false, error: 'Вы не авторизованы' });
		}
		jwt.verify(accessToken, secret);
		next();
	} catch (error) {
		if (error.message === 'jwt expired') {
			return res.status(401).json({ success: false, error: error.message });
		} else {
			return res.status(403).json({ success: false, error: error.message });
		}
	}
};

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const issueJwt = (userData) => {
	return jwt.sign(userData, process.env.JWT_SECRET, {
		subject: "access-token",
		audience: ["facebook.com", "google.com", "your-bank-password.com"],
		expiresIn: "1h",
	});
};

const decodeJwt = (token) => {
	try {
		const userData = jwt.verify(token, process.env.JWT_SECRET);
		return {
			ban: false,
			expired: false,
			user: userData,
		};
	} catch (err) {
		console.error(err);
		if (err instanceof jwt.TokenExpiredError) {
			return { ban: false, expired: true };
		}
		if (err instanceof jwt.JsonWebTokenError) {
			return { ban: true, expired: false };
		}
	}
};

const hashPassword = async (plainPassword) => {
	return await bcrypt.hash(plainPassword, 12);
};

const comparePassword = async (plainPassword, hashedPassword) => {
	return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { issueJwt, decodeJwt, hashPassword, comparePassword };

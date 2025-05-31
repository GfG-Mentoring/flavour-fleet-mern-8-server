const { header, validationResult, matchedData } = require("express-validator");
const { decodeJwt } = require("../auth");
const { User } = require("../../db/models/user");

const validateUser = () =>
	header("Authorization")
		.custom(async (value) => {
			if (!value) {
				throw Error("Missing access token");
			}
			const token = value.replace("Bearer", "").trim();
			const { expired, user } = decodeJwt(token);
			if (expired) {
				throw new Error("Credentials expired. Login to continue");
			}
			return user;
		})
		.customSanitizer((value) => {
			const token = value.replace("Bearer", "").trim();
			const { expired, user } = decodeJwt(token);
			console.log(user, expired);
			return user;
		});

const verifyUser = async (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		res.status(401).send({
			message: "Please login again to continue.",
		});
		return;
	}
	const token = authorization.replace("Bearer", "").trim();
	console.log(token);
	const { expired, user } = decodeJwt(token);

	if (expired) {
		res.status(401).send({
			message: "Please login again to continue.",
		});
		return;
	}

	const userData = await User.findById(user.id);

	req.user = {
		email: userData.email,
		fullName: userData.fullName,
		id: userData.id,
	};
	next();
};

module.exports = { verifyUser, validateUser };

const { body } = require("express-validator");
const { User } = require("../../db/models/user");

const validateEmail = () =>
	body("email").isEmail().withMessage("Email is invalid");

const validateDuplicateEmail = () =>
	body("email").custom(async (value) => {
		const user = await User.findOne({ email: value });
		if (user) {
			throw new Error("E-mail already in use");
		}
	});

const validateUserExists = () =>
	body("email").custom(async (value) => {
		const user = await User.find({ email: value });
		if (!user) {
			throw new Error("User is not registered");
		}
	});

const validatePassword = () =>
	body("password")
		.isAlphanumeric()
		.withMessage("Password must contain atleast one letter and one number")
		.isLength({ max: 256, min: 8 })
		.withMessage("Password should have between 8 to 256 characters");

const validateFullName = () => body("fullName").isLength({ min: "3" });

module.exports = {
	validateEmail,
	validateDuplicateEmail,
	validateUserExists,
	validatePassword,
	validateFullName,
};

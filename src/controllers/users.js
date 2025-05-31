const { Router } = require("express");
const {
	validateEmail,
	validatePassword,
	validateFullName,
	validateDuplicateEmail,
	validateUserExists,
} = require("../utils/validators/user");

const { validationResult, matchedData, body } = require("express-validator");
const { User } = require("../db/models/user");
const { issueJwt, hashPassword, comparePassword } = require("../utils/auth");
const { verifyUser } = require("../utils/validators/auth");

const userRouter = Router();

userRouter.post(
	"/signup",
	[
		validateEmail(),
		validateDuplicateEmail(),
		validatePassword(),
		validateFullName(),
	],
	async (req, res) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			res.status(400).send(result.array());
			return;
		}

		const request = matchedData(req);

		// TODO: encrypt the password
		// TODO: delete the password from response

		const user = new User({
			...request,
			password: await hashPassword(request.password),
		});

		const savedUser = await user.save();
		// biome-ignore lint/performance/noDelete: <explanation>
		delete savedUser.password;
		console.log(savedUser);
		res.send({
			msg: "User created.",
			data: {
				email: savedUser.email,
				fullName: savedUser.fullName,
				id: savedUser.id,
			},
		});
	},
);

userRouter.post(
	"/login",
	[
		validateEmail(),
		validateUserExists(),
		body("password").isLength({ min: 6 }),
	],
	async (req, res) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			res.status(400).send(result.array());
			return;
		}

		const request = matchedData(req);

		const user = await User.findOne({ email: request.email });

		if (!user) {
			res.status(404).send({ msg: "User not found." });
		}

		if (await comparePassword(request.password, user.password)) {
			const token = issueJwt({ id: user.id });
			res.send({ msg: "Login successful", token });
			return;
		}

		res.status(400).send({ msg: "Invalid password" });
	},
);

userRouter.get("/me", verifyUser, (req, res) => {
	if (req.user) {
		res.status(200).send({ user: req.user });
		return;
	}
	res.status(400).send({ msg: "User not found." });
});

module.exports = { userRouter };

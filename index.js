require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { catsRouter } = require("./src/controllers/cats");
const { todoRouter } = require("./src/controllers/todo");
const { connectDb } = require("./src/db");
const { userRouter } = require("./src/controllers/users");
const { verifyUser, validateUser } = require("./src/utils/validators/auth");

const { restaurantRouter } = require("./src/controllers/restaurant");
const { seedRestaurants } = require("./src/db/models/seed");

const app = express();

app.use(
	cors({
		origin: process.env.WEBAPP_URL,
	}),
);
// necessary to parse body to get the data from client;
app.use(express.json());

app.use("/todos", verifyUser, todoRouter);
// app.use("/billing",verifyUser,  )

app.use("/user", userRouter);

app.use("/restaurants", restaurantRouter);

app.listen(8001, async (err) => {
	if (err) {
		throw err;
	}
	const { JWT_SECRET, MONGODB_PASSWORD, MONGODB_USER, WEBAPP_URL } =
		process.env;

	if (!JWT_SECRET || !MONGODB_PASSWORD || !MONGODB_USER || !WEBAPP_URL) {
		throw new Error("env variables are missing");
	}

	console.log("Server running on port: 8001");

	await connectDb(process.env.MONGODB_USER, process.env.MONGODB_PASSWORD);
	console.log("Database connected");

	await seedRestaurants();
});

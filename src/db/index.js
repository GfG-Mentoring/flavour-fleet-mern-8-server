const mongoose = require("mongoose");

async function connectDb(username, password) {
	return mongoose.connect(
		`mongodb+srv://${username}:${password}@gfg-mern6.giwmv.mongodb.net/`,
	);
}

module.exports = { connectDb };

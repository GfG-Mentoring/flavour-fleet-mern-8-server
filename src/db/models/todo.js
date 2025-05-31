const { Schema, default: mongoose } = require("mongoose");

const TodoSchema = new Schema({
	todo: {
		type: String,
		required: true,
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},
});

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = { Todo };

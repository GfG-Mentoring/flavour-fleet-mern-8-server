const { Router } = require("express");
const { Todo } = require("../db/models/todo");

const { Types } = require("mongoose");

const todoRouter = Router();

// get list of todos
todoRouter.get("/", async (req, res) => {
	const todos = await Todo.find({
		createdBy: req.user.id,
	});
	res.status(200).send({
		message: "Todos fetched",
		data: todos,
	});
});

// get todo by ID
todoRouter.get("/:id", async (req, res) => {
	const { id: todoId } = req.params;
	const todo = await Todo.findOne({
		createdBy: req.user.id,
		_id: new Types.ObjectId(todoId),
	});
	res.status(200).send({
		message: "Todos fetched",
		data: todo,
	});
});

// create todo
todoRouter.post("/", async (req, res) => {
	const { todo } = req.body;
	const { user } = req;
	if (!todo) {
		res.status(400).send("Todo is missing");
		return;
	}
	// save todo to database;
	const todoData = new Todo({ todo, createdBy: user.id });
	const savedTodo = await todoData.save();

	res.status(200).send({
		message: "Todo saved successfully",
		data: {
			...savedTodo.toJSON(),
		},
	});
});

// delete todo by ID
todoRouter.delete("/:id", (req, res) => {});

// update todo by ID
todoRouter.put("/:id", (req, res) => {});

module.exports = { todoRouter };

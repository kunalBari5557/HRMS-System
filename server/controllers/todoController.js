const Todo = require("../models/Todo");

exports.createTodo = async (req, res) => {
  const { title } = req.body;
  const todo = new Todo({ userId: req.user.id, title });
  await todo.save();
  res.status(201).json(todo);
};

exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id });
  res.json(todos);
};

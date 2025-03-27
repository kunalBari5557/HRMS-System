const express = require("express");
const { createTodo, getTodos } = require("../controllers/todoController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth, createTodo);
router.get("/", auth, getTodos);

module.exports = router;

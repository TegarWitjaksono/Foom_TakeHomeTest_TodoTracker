const express = require("express");
const { Todo } = require("./models");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/todos", async (req, res) => {
  const todos = await Todo.findAll({ order: [["createdAt", "DESC"]] });
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const todo = await Todo.create({ title, description, completed: false });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) return res.status(404).json({ error: "Not found" });

    await todo.update(req.body);
    res.json(todo);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) return res.status(404).json({ error: "Not found" });

    await todo.destroy();
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

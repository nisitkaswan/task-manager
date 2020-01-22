const express = require("express");
const Task = require("../db/models/task");
const router = new express.Router();
const auth = require("../middleware/auth");

router.get("/tasks", auth, async (req, res) => {

  const match = {}

  if (req.query.completed)
  {
    match.completed = req.query.completed === 'true';
   }

  try {
    await req.user.populate({
      path: 'tasks',
      match
    }).execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/tasks", auth, (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });

  task
    .save()
    .then(() => {
      return res.status(201).send(task);
    })
    .catch(error => {
      res.status(400);
      return res.send(error);
    });
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    req.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update!" });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send("Task Not Found");
    }

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id",auth, async (req, res) => {
  try {
    const task = await  Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

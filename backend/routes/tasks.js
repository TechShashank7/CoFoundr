const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Startup = require('../models/Startup');

// GET /api/tasks?startupId=xxx
router.get('/', async (req, res) => {
  try {
    const { startupId } = req.query;
    if (!startupId) return res.status(400).json({ message: 'startupId is required' });
    
    const tasks = await Task.find({ startupId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { startupId, title, description, status, priority, dueDate } = req.body;
    const task = new Task({ startupId, title, description, status, priority, dueDate });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

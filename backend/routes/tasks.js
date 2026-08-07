const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Startup = require('../models/Startup');
const Report = require('../models/Report');
const { generateResponse } = require('../services/geminiClient');

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

// POST /api/tasks/:id/notify
router.post('/:id/notify', async (req, res) => {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return res.status(400).json({ message: 'N8N_WEBHOOK_URL not configured' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const payload = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      startupId: task.startupId
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ message: `Webhook failed with status ${response.status}`, details: errText });
    }

    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Webhook notification error:', error);
    res.status(502).json({ message: 'Network error calling webhook', error: error.message });
  }
});

// POST /api/tasks/suggest
router.post('/suggest', async (req, res) => {
  try {
    const { startupId } = req.body;
    if (!startupId) return res.status(400).json({ message: 'startupId is required' });

    // 1. Fetch latest business plan
    const latestPlan = await Report.findOne({ startupId, type: 'business_plan' }).sort({ createdAt: -1 });
    
    // 2. Fetch current tasks
    const currentTasks = await Task.find({ startupId });
    const currentTaskTitles = currentTasks.map(t => `${t.title} (${t.status})`).join(', ');

    // 3. Build prompt
    const systemInstruction = `You are a strategic AI co-founder. Your job is to suggest the next high-leverage tasks for a startup.
You MUST respond with a strict JSON array of objects, with NO markdown formatting, NO prose, and NO backticks.
Each object must have exactly two keys: "title" (string) and "priority" (string: "low", "medium", or "high").`;

    let prompt = `Here are the current tasks:\n${currentTaskTitles || 'None yet.'}\n\n`;
    
    if (latestPlan) {
      prompt += `Here is the startup's current business plan:\n${latestPlan.content}\n\n`;
      prompt += `Based on this business plan and the current tasks, suggest 3 to 5 specific, concrete, actionable next steps. Do not repeat existing tasks.`;
    } else {
      prompt += `No business plan has been generated yet for this startup. Suggest 3 to 5 foundational early-stage tasks (e.g. market research, writing a business plan, defining the target audience) to get them started.`;
    }

    const fetchSuggestions = async (isRetry = false) => {
      let finalPrompt = prompt;
      if (isRetry) {
        finalPrompt = `You MUST reply in ONLY valid JSON. No other text. No backticks. \n\n` + prompt;
      }
      
      const aiReplyText = await generateResponse(systemInstruction, finalPrompt);
      
      try {
        // Strip markdown backticks if Gemini ignores the instruction
        const cleanJsonStr = aiReplyText.replace(/```json/g, '').replace(/```/g, '').trim();
        const suggestions = JSON.parse(cleanJsonStr);
        if (!Array.isArray(suggestions)) throw new Error('Response is not an array');
        return suggestions;
      } catch (err) {
        if (!isRetry) {
          console.warn('Failed to parse Gemini JSON, retrying...', err);
          return await fetchSuggestions(true);
        }
        throw new Error('Failed to parse Gemini response as JSON after retry.');
      }
    };

    const suggestions = await fetchSuggestions();
    res.json(suggestions);

  } catch (error) {
    console.error('Task Suggestion Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

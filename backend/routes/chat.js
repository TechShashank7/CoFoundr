const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const Startup = require('../models/Startup');
const { generateResponse } = require('../services/geminiClient');
const auth = require('../middleware/auth');
const verifyStartupOwnership = require('../middleware/verifyStartupOwnership');

// POST /api/chat
router.post('/', auth, async (req, res) => {
  try {
    const { startupId, message } = req.body;

    await verifyStartupOwnership(startupId, req.uid);

    // Verify startup exists
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    // Save user message
    const userMessage = new ChatMessage({
      startupId,
      role: 'user',
      content: message
    });
    await userMessage.save();

    // Fetch recent chat history
    const history = await ChatMessage.find({ startupId })
      .sort({ createdAt: -1 })
      .limit(10);
    history.reverse(); // Chronological order

    // Construct prompt
    const systemInstruction = `You are a sharp, pragmatic startup co-founder for a startup named "${startup.name}".
Industry: ${startup.industry}
Target Market: ${startup.targetMarket}
Stage: ${startup.stage}
One-liner: ${startup.oneLiner}

Act as an experienced entrepreneur. Be direct, actionable, and insightful. Avoid generic assistant platitudes. Give strategic advice based on your knowledge of the startup.`;

    let prompt = 'Here is the recent conversation history:\n';
    history.forEach(msg => {
      prompt += `${msg.role === 'user' ? 'User' : 'Co-founder'}: ${msg.content}\n`;
    });
    prompt += `\nProvide the next response as the Co-founder.`;

    // Call Gemini
    const aiReplyText = await generateResponse(systemInstruction, prompt);

    // Save AI reply
    const assistantMessage = new ChatMessage({
      startupId,
      role: 'assistant',
      content: aiReplyText
    });
    await assistantMessage.save();

    res.status(200).json(assistantMessage);
  } catch (error) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Startup not found' });
    if (error.message === 'FORBIDDEN') return res.status(403).json({ message: 'Forbidden' });
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chat/:startupId
router.get('/:startupId', auth, async (req, res) => {
  try {
    await verifyStartupOwnership(req.params.startupId, req.uid);

    const history = await ChatMessage.find({ startupId: req.params.startupId })
      .sort({ createdAt: 1 });
    res.json(history);
  } catch (error) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Startup not found' });
    if (error.message === 'FORBIDDEN') return res.status(403).json({ message: 'Forbidden' });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

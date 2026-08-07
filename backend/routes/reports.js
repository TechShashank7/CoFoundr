const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Startup = require('../models/Startup');
const { generateResponse } = require('../services/geminiClient');

// POST /api/reports/business-plan
router.post('/business-plan', async (req, res) => {
  try {
    const { startupId, problem, solution, businessModel } = req.body;
    
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });

    const systemInstruction = `You are an expert startup strategist and co-founder.`;
    const prompt = `Generate a structured business plan for the startup "${startup.name}".
Industry: ${startup.industry}
Target Market: ${startup.targetMarket}
Stage: ${startup.stage}

User inputs:
Problem: ${problem}
Solution: ${solution}
Business Model: ${businessModel}

Format the response in Markdown with these sections:
# Executive Summary
# Problem
# Solution
# Value Proposition
# Revenue Model
# Go-to-Market Strategy
# Key Milestones (Next 90 Days)`;

    const aiReplyText = await generateResponse(systemInstruction, prompt);

    const report = new Report({
      startupId,
      type: 'business_plan',
      input: { problem, solution, businessModel },
      content: aiReplyText
    });
    
    await report.save();
    res.status(201).json(report);

  } catch (error) {
    console.error('Report Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports?startupId=xxx&type=xxx
router.get('/', async (req, res) => {
  try {
    const { startupId, type } = req.query;
    let query = { startupId };
    if (type) query.type = type;
    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

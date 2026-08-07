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

// POST /api/reports/market-research
router.post('/market-research', async (req, res) => {
  try {
    const { startupId, industry, targetMarket, region } = req.body;
    
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });

    const systemInstruction = `You are an expert market research analyst for startups.`;
    const prompt = `Generate a market research report for "${startup.name}".
Startup Industry: ${startup.industry}
Startup Target Market: ${startup.targetMarket}
Startup Stage: ${startup.stage}

Specific parameters for this report:
Target Industry Segment: ${industry}
Specific Target Market: ${targetMarket}
Region: ${region}

Format the response in Markdown with these EXACT sections:
# Market Size Estimate (TAM/SAM/SOM)
*State assumptions clearly for the estimates.*
# Key Market Trends (3-5 trends)
# Target Customer Profile
# Top 3 Market Risks`;

    const aiReplyText = await generateResponse(systemInstruction, prompt);

    const report = new Report({
      startupId,
      type: 'market_research',
      input: { industry, targetMarket, region },
      content: aiReplyText
    });
    
    await report.save();
    res.status(201).json(report);

  } catch (error) {
    console.error('Report Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reports/fundraising-prep
router.post('/fundraising-prep', async (req, res) => {
  try {
    const { startupId, stage, amountSeeking, useOfFunds } = req.body;
    
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });

    const systemInstruction = `You are a veteran venture capitalist and fundraising coach.`;
    const prompt = `Generate fundraising preparation materials for "${startup.name}".
Industry: ${startup.industry}
Target Market: ${startup.targetMarket}
One-Liner: ${startup.oneLiner}

Fundraising details:
Stage: ${stage}
Amount Seeking: ${amountSeeking}
Use of Funds: ${useOfFunds}

Format the response in Markdown with these EXACT sections:
# Pitch Deck Outline (Slide-by-Slide)
# Top Investor Questions (8-10 likely questions)
*Include suggested talking points/answers for each question.*`;

    const aiReplyText = await generateResponse(systemInstruction, prompt);

    const report = new Report({
      startupId,
      type: 'fundraising_prep',
      input: { stage, amountSeeking, useOfFunds },
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

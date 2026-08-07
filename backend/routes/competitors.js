const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Startup = require('../models/Startup');
const { generateResponse } = require('../services/geminiClient');

// POST /api/competitors/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { startupId, productDescription, knownCompetitors } = req.body;
    
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });

    const systemInstruction = `You are a strategic competitive intelligence analyst.`;
    const prompt = `Generate a structured competitor analysis for "${startup.name}".
Industry: ${startup.industry}
Target Market: ${startup.targetMarket}
Product Description: ${productDescription}
Known Competitors (if any provided): ${knownCompetitors || 'None provided'}

Format the response in Markdown as a detailed table comparing 3 to 5 key competitors against our startup.
The table MUST include these exact columns:
| Competitor Name | Core Positioning | Key Strengths | Key Weaknesses | Our Differentiation Opportunity |

Provide a brief paragraph analyzing the overall competitive landscape before the table, and a concluding summary after the table.`;

    const aiReplyText = await generateResponse(systemInstruction, prompt);

    const report = new Report({
      startupId,
      type: 'competitor_analysis',
      input: { productDescription, knownCompetitors },
      content: aiReplyText
    });
    
    await report.save();
    res.status(201).json(report);

  } catch (error) {
    console.error('Competitor Analysis Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Placeholder for future P2 endpoints
router.get('/', (req, res) => {
    res.json([]);
});

module.exports = router;

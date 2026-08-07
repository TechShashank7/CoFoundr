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

const Competitor = require('../models/Competitor');

// GET /api/competitors/:startupId
router.get('/:startupId', async (req, res) => {
  try {
    const competitors = await Competitor.find({ startupId: req.params.startupId }).sort({ createdAt: -1 });
    res.json(competitors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/competitors/nearby
router.post('/nearby', async (req, res) => {
  try {
    const { startupId, businessType, address } = req.body;
    
    if (!startupId || !businessType || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GOOGLE_MAPS_API_KEY not configured' });
    }

    // 1. Geocode the address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const geocodeRes = await fetch(geocodeUrl);
    const geocodeData = await geocodeRes.json();

    if (geocodeData.status !== 'OK' || !geocodeData.results.length) {
      return res.status(400).json({ message: 'Could not geocode address', details: geocodeData.status });
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;

    // 2. Nearby Search for competitors
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=${encodeURIComponent(businessType)}&key=${apiKey}`;
    const placesRes = await fetch(placesUrl);
    const placesData = await placesRes.json();

    if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
      return res.status(400).json({ message: 'Places API error', details: placesData.status });
    }

    const competitorsList = [];

    // 3. Save results to database
    if (placesData.results && placesData.results.length > 0) {
      // Clear previous map competitors for this search to avoid duplicates if they search again?
      // User didn't request clearing, so we'll just append. But to avoid massive spam, maybe we just return them. 
      // Actually, user said: "Save each result as a Competitor document with source: 'maps'"
      
      const docsToInsert = placesData.results.slice(0, 10).map(place => ({
        startupId,
        name: place.name,
        address: place.vicinity || place.formatted_address || 'Unknown address',
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        notes: `Rating: ${place.rating || 'N/A'}`,
        source: 'maps'
      }));

      const inserted = await Competitor.insertMany(docsToInsert);
      competitorsList.push(...inserted);
    }

    res.json({
      center: { lat, lng },
      competitors: competitorsList
    });

  } catch (error) {
    console.error('Nearby Competitors Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

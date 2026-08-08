const express = require('express');
const router = express.Router();
const Startup = require('../models/Startup');
const auth = require('../middleware/auth');

// GET /api/startups - List all startups for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const startups = await Startup.find({ ownerUid: req.uid }).sort({ createdAt: -1 });
    res.json(startups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/startups - Create a new startup profile
router.post('/', auth, async (req, res) => {
  try {
    const { name, oneLiner, industry, targetMarket, stage } = req.body;
    const startup = new Startup({
      ownerUid: req.uid,
      name,
      oneLiner,
      industry,
      targetMarket,
      stage
    });
    const savedStartup = await startup.save();
    res.status(201).json(savedStartup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/startups/:id - Fetch a startup profile
router.get('/:id', auth, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }
    if (startup.ownerUid !== req.uid) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(startup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

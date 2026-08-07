const express = require('express');
const router = express.Router();
const Startup = require('../models/Startup');

// POST /api/startups - Create a new startup profile
router.post('/', async (req, res) => {
  try {
    const { name, oneLiner, industry, targetMarket, stage } = req.body;
    const startup = new Startup({
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
router.get('/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }
    res.json(startup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const CompetitorSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  name: { type: String, required: true },
  address: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  notes: { type: String },
  source: { type: String, enum: ['ai', 'maps'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Competitor', CompetitorSchema);

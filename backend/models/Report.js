const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  type: { 
    type: String, 
    enum: ['market_research', 'competitor_analysis', 'business_plan', 'fundraising_prep'], 
    required: true 
  },
  input: { type: mongoose.Schema.Types.Mixed }, // flexible JSON object
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);

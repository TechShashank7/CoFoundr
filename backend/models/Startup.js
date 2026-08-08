const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
  ownerUid: { type: String, required: true, index: true },
  name: { type: String, required: true },
  oneLiner: { type: String, required: true },
  industry: { type: String, required: true },
  targetMarket: { type: String, required: true },
  stage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Startup', StartupSchema);

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['backlog', 'in_progress', 'done'], default: 'backlog' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);

const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
});

const RoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true, trim: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  steps: { type: [StepSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', RoadmapSchema);

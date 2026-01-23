const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true, trim: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  learningGoals: { type: [String], default: [] },
  customGoals: { type: [String], default: [] },
  currentLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  onboardingCompleted: { type: Boolean, default: false },
  // Personalized Learning Fields
  mastery: {
    type: Map,
    of: Number,
    default: {}
  }, // Map of topic -> proficiency score (0-100)
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

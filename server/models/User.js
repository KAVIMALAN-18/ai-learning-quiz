const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ['user', 'instructor', 'admin', 'super_admin'],
    default: 'user'
  },
  isVerified: { type: Boolean, default: false },

  // Security
  twoFactorSecret: { type: String }, // For TOTP
  twoFactorEnabled: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
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
  bio: { type: String, default: '', maxlength: 500 },
  learningPreferences: {
    dailyGoal: { type: Number, default: 30 },
    preferredTopics: { type: [String], default: [] },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    emailNotifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

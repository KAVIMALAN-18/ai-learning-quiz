const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: String, required: true }, // Using string for flexibility, or could be ref to 'Course'
    completionPercentage: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index to ensure one progress record per course per user
ProgressSchema.index({ userId: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);

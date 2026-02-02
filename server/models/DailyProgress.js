const mongoose = require('mongoose');

const DailyProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true }, // Normalized to midnight
    lessonsCompleted: { type: Number, default: 0 },
    quizzesTaken: { type: Number, default: 0 },
    minutesSpent: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    completionPercentage: { type: Number, default: 0 } // Snapshot of overall completion
}, { timestamps: true });

// Compound index for fast lookup by user + date
DailyProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyProgress', DailyProgressSchema);

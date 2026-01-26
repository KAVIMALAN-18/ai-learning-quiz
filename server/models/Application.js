const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String }, // Link to stored resume
    coverLetter: { type: String },
    status: {
        type: String,
        enum: ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'HIRED'],
        default: 'APPLIED'
    },
    matchScore: { type: Number, default: 0 }, // AI-calculated fit (0-100)
    aiAnalysis: {
        strengths: [String],
        weaknesses: [String],
        reasoning: String
    },
    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// compound index to prevent double application
ApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);

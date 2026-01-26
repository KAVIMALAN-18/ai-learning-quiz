const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Technical', 'HR', 'Mixed'], default: 'Technical' },
    topic: { type: String }, // e.g., 'React', 'Java'
    status: { type: String, enum: ['Pending', 'Completed', 'Abandoned'], default: 'Pending' },
    questions: [{
        question: String,
        userAnswer: String,
        aiFeedback: String,
        score: Number // 1-10
    }],
    overallScore: { type: Number },
    overallFeedback: { type: String },
    durationSeconds: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);

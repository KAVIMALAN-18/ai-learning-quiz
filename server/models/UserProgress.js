const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    topicStatuses: [{
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
        status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
        lastAccessedAt: { type: Date, default: Date.now }
    }],
    completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }], // Redundant but good for quick aggregation
    lastTopicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }, // For "Resume" feature
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

// Ensure unique progress per user per course
UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);

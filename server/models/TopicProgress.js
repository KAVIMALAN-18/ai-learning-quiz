const mongoose = require('mongoose');

const TopicProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true }, // Using Lesson as Topic
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['locked', 'available', 'completed'], default: 'locked' },
    score: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    lastAttempted: { type: Date }
}, { timestamps: true });

// Ensure unique progress for each user per topic
TopicProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

module.exports = mongoose.model('TopicProgress', TopicProgressSchema);

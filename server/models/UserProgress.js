const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    lastLessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }, // For "Resume" feature
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

// Ensure unique progress per user per course
UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);

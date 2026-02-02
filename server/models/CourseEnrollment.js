const mongoose = require('mongoose');

const CourseEnrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    // Enrollment Status
    status: {
        type: String,
        enum: ['enrolled', 'in-progress', 'completed', 'dropped'],
        default: 'enrolled'
    },

    // Dates
    enrolledAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
    completedAt: { type: Date },
    lastAccessedAt: { type: Date, default: Date.now },

    // Progress Tracking
    currentModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    currentTopicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],

    // Test Scores (Map of topicId/examId -> score)
    topicTestScores: { type: Map, of: Number, default: {} },

    // Final Exam
    finalExamAttempts: { type: Number, default: 0 },
    finalExamScore: { type: Number },
    finalExamPassed: { type: Boolean, default: false },
    finalExamCompletedAt: { type: Date },

    // Certificate
    certificateIssued: { type: Boolean, default: false },
    certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },

    // Analytics
    totalTimeSpent: { type: Number, default: 0 }, // in minutes
    progressPercentage: { type: Number, default: 0 }
}, { timestamps: true });

// Compound index for fast lookup
CourseEnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Calculate progress percentage
CourseEnrollmentSchema.methods.calculateProgress = function () {
    if (!this.populated('courseId')) return 0;
    const totalTopics = this.courseId.totalTopics || 0;
    const completedCount = this.completedTopics.length;
    return totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
};

module.exports = mongoose.model('CourseEnrollment', CourseEnrollmentSchema);

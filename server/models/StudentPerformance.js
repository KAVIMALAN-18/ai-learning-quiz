const mongoose = require('mongoose');

const StudentPerformanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    overallStats: {
        totalQuizzesTaken: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        overallAccuracy: { type: Number, default: 0 },
        totalTimeSpent: { type: Number, default: 0 }, // in seconds
        completionPercentage: { type: Number, default: 0 }
    },
    coursePerformance: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        courseTitle: String,
        completionPercentage: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        quizzesTaken: { type: Number, default: 0 }
    }],
    topicMastery: [{
        topicName: String,
        accuracy: { type: Number, default: 0 },
        attempts: { type: Number, default: 0 },
        status: { type: String, enum: ['Strong', 'Improving', 'Weak'], default: 'Improving' }
    }],
    performanceHistory: [{
        date: { type: Date, default: Date.now },
        score: Number,
        accuracy: Number
    }],
    suggestions: [String]
}, { timestamps: true });

module.exports = mongoose.model('StudentPerformance', StudentPerformanceSchema);

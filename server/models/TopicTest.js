const mongoose = require('mongoose');

const TopicTestSchema = new mongoose.Schema({
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    isOptional: { type: Boolean, default: true },
    questions: [{
        type: {
            type: String,
            enum: ['mcq', 'multi-select', 'true-false', 'coding'],
            default: 'mcq'
        },
        question: { type: String, required: true },
        options: [{ type: String }], // For MCQ/multi-select
        correctAnswer: { type: mongoose.Schema.Types.Mixed }, // Number for MCQ, Array for multi-select, Boolean for true-false
        explanation: { type: String },
        marks: { type: Number, default: 1 }
    }],
    passingScore: { type: Number, default: 70 }, // Percentage
    timeLimit: { type: Number, default: 10 } // Minutes
}, { timestamps: true });

module.exports = mongoose.model('TopicTest', TopicTestSchema);

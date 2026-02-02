const mongoose = require('mongoose');

const CourseExamSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    title: { type: String, required: true },
    description: { type: String },

    // Exam Configuration
    isOptional: { type: Boolean, default: false }, // Final exams are mandatory
    timeLimit: { type: Number, default: 90 }, // in minutes
    passingScore: { type: Number, default: 70 }, // percentage
    maxAttempts: { type: Number, default: 3 },

    // Questions
    questions: [{
        type: {
            type: String,
            enum: ['mcq', 'multi-select', 'true-false', 'coding'],
            required: true
        },
        question: { type: String, required: true },
        options: [{ type: String }], // For MCQ/multi-select
        correctAnswer: { type: mongoose.Schema.Types.Mixed }, // Number for MCQ, Array for multi-select, Boolean for true-false, String for coding
        explanation: { type: String },
        marks: { type: Number, default: 2 },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },

        // For coding questions
        codeTemplate: { type: String },
        language: { type: String }, // e.g., 'python', 'javascript'
        testCases: [{
            input: String,
            expectedOutput: String,
            isHidden: { type: Boolean, default: false }
        }]
    }],

    totalMarks: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 }
}, { timestamps: true });

// Calculate totals before saving
CourseExamSchema.pre('save', function (next) {
    this.totalQuestions = this.questions.length;
    this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 2), 0);
    next();
});

module.exports = mongoose.model('CourseExam', CourseExamSchema);

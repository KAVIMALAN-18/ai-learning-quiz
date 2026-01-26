const mongoose = require('mongoose');

const TopicTestSchema = new mongoose.Schema({
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true }, // Index of correct option
        explanation: { type: String }
    }],
    passingScore: { type: Number, default: 70 }, // Percentage
    timeLimit: { type: Number, default: 10 } // Minutes
}, { timestamps: true });

module.exports = mongoose.model('TopicTest', TopicTestSchema);

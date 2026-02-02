const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },

    // Rich Content
    explanation: { type: String, required: true }, // Detailed theoretical content

    // Examples
    examples: [{
        language: String,
        code: String,
        description: String
    }],

    // Resources
    resources: [{
        title: String,
        url: String,
        type: { type: String, enum: ['PDF', 'Link', 'YouTube', 'Doc'], default: 'Link' }
    }],

    // Mini Practice Questions (MCQ for immediate feedback)
    practiceQuestions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String
    }],

    // Optional Programming Task
    codingTask: {
        problemStatement: String,
        starterCode: String,
        hint: String
    },

    // References
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    order: { type: Number, default: 0 },
    estimatedTime: { type: String, default: '15 mins' },
}, { timestamps: true });

module.exports = mongoose.model('Topic', TopicSchema);

const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true }, // Markdown/HTML content
    codeSnippets: [{
        language: String,
        code: String,
        label: String
    }],
    resources: [{
        title: String,
        url: String,
        type: { type: String, enum: ['PDF', 'Link', 'YouTube', 'Doc'], default: 'Link' }
    }],
    quiz: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String
    }],
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', LessonSchema);

const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  type: {
    type: String,
    enum: ['mcq', 'multi-select', 'true-false', 'coding', 'fill-in-the-blanks'],
    required: true
  },
  question: { type: String, required: true },
  options: { type: [String], default: [] },
  correctAnswer: { type: mongoose.Schema.Types.Mixed },
  explanation: { type: String }, // AI-generated or admin-provided explanation
  timeLimit: { type: Number, default: 60 }, // seconds
  marks: { type: Number, default: 1 },
  difficulty: { type: Number, default: 1 }, // 1 to 5, for adaptive testing
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);

const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  type: { type: String, enum: ['mcq', 'multi-select', 'true-false', 'coding'], required: true },
  question: { type: String, required: true },
  options: { type: [String], default: [] },
  correctAnswer: { type: mongoose.Schema.Types.Mixed },
  timeLimit: { type: Number, default: 60 }, // seconds
  marks: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);

const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  // optional title for the quiz
  title: { type: String, trim: true },
  // topic and difficulty
  topic: { type: String, required: true, trim: true },
  difficulty: { type: String, trim: true, required: true },
  // total time limit for the quiz in seconds (0 = auto)
  timeLimit: { type: Number, default: 0 },
  // questions referenced (separate collection)
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  // user who requested/created this quiz (optional)
  createdByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // source of creation
  createdBy: { type: String, enum: ['admin', 'ai', 'user'], default: 'ai' },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);

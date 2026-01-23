const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: { type: mongoose.Schema.Types.Mixed },
  correct: { type: Boolean },
  marksObtained: { type: Number, default: 0 },
});

const QuizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  // answers stored for the attempt
  answers: { type: [AnswerSchema], default: [] },
  // legacy / alias
  answersGiven: { type: [AnswerSchema], default: [] },
  score: { type: Number, default: 0 },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  timeTaken: { type: Number },
  // AI Insights
  aiAnalysis: {
    feedback: { type: String },
    strengthsIdentified: { type: [String] },
    weaknessesIdentified: { type: [String] },
    suggestedTopics: { type: [String] },
    skillImpact: { type: Map, of: Number }, // How this quiz changed mastery scores
  },
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);

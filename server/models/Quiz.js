const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  // optional title for the quiz
  title: { type: String, trim: true },
  // Assessment Hierarchy
  type: {
    type: String,
    enum: ['topic_quiz', 'module_test', 'final_exam', 'practice'],
    default: 'practice'
  },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },

  // Metadata
  topic: { type: String, required: true, trim: true },
  difficulty: { type: String, trim: true, required: true },
  timeLimit: { type: Number, default: 0 },
  passingScore: { type: Number, default: 70 }, // Percentage
  isAdaptive: { type: Boolean, default: false },

  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  createdByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: String, enum: ['admin', 'ai', 'user'], default: 'ai' },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);

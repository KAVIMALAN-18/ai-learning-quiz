const express = require('express');
const router = express.Router();
const axios = require('axios');

const authMiddleware = require('../middleware/authMiddleware');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');

// Helper: generate questions using Gemini (expects GEMINI_API_URL and GEMINI_API_KEY)
async function generateQuestionsWithGemini({ topic, difficulty, count = 10, timeLimitPerQ }) {
  const GEMINI_URL = process.env.GEMINI_API_URL;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_URL || !GEMINI_KEY) {
    throw new Error('Gemini API not configured');
  }

  const prompt = `You are an expert question generator for technical quizzes.
Generate ${count} multiple-choice questions for the topic "${topic}" at ${difficulty} difficulty.
For each question return a JSON object with fields: question (string), options (array of strings), correctAnswer (index or array for multi-select), timeLimit (seconds, optional), marks (number).
Return ONLY a JSON array of question objects.`;

  const resp = await axios.post(
    GEMINI_URL,
    { prompt },
    { headers: { Authorization: `Bearer ${GEMINI_KEY}`, 'Content-Type': 'application/json' } }
  );

  const text = resp.data?.text || JSON.stringify(resp.data || {});
  const idx = text.indexOf('[');
  if (idx === -1) throw new Error('Invalid response from Gemini');

  const json = JSON.parse(text.slice(idx));
  if (!Array.isArray(json)) throw new Error('Gemini did not return an array');

  return json.slice(0, count).map((q) => ({
    question: q.question || q.prompt || '',
    options: Array.isArray(q.options) ? q.options : [],
    correctAnswer: q.correctAnswer,
    timeLimit: typeof q.timeLimit === 'number' ? q.timeLimit : (timeLimitPerQ || 60),
    marks: typeof q.marks === 'number' ? q.marks : 1,
    type: q.type || 'mcq',
  }));
}

// POST /api/quiz/generate
// Create an AI-generated quiz using Gemini. Accessible to authenticated users.
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { topic, difficulty = 'Intermediate', count = 10, timeLimit } = req.body || {};
    if (!topic || !count) return res.status(400).json({ message: 'topic and count are required' });

    // generate via Gemini
    const questionsData = await generateQuestionsWithGemini({ topic, difficulty, count, timeLimitPerQ: timeLimit });

    // create Question docs
    const created = await Promise.all(
      questionsData.map((q) => Question.create({
        quizId: null, // will set after quiz created
        type: q.type || 'mcq',
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        timeLimit: q.timeLimit || 60,
        marks: q.marks || 1,
      }))
    );

    const questionIds = created.map((d) => d._id);

    // create Quiz document
    const quiz = await Quiz.create({
      topic,
      difficulty,
      questions: questionIds,
      createdByUser: req.user.id,
      timeLimit: timeLimit || 0,
    });

    // attach quizId to questions
    await Question.updateMany({ _id: { $in: questionIds } }, { $set: { quizId: quiz._id } });

    return res.status(201).json({ quizId: quiz._id });
  } catch (err) {
    console.error('Quiz generate error:', err?.message || err);
    return res.status(500).json({ message: 'Failed to generate quiz' });
  }
});

// helper to grade and save
async function gradeAndSaveAttempt({ userId, quizId, answers = [], timeTaken = 0 }) {
  const quiz = await Quiz.findById(quizId).populate('questions');
  if (!quiz) throw new Error('Quiz not found');

  const qDocs = quiz.questions || [];
  let score = 0;
  const answersGiven = [];

  for (const q of qDocs) {
    const a = answers.find((it) => String(it.questionId) === String(q._id));
    if (!a) {
      answersGiven.push({ questionId: q._id, answer: null, correct: false, marksObtained: 0 });
      continue;
    }

    let correct = false;
    if (q.type === 'mcq' || q.type === 'true-false') {
      correct = String(a.answer) === String(q.correctAnswer);
    } else if (q.type === 'multi-select') {
      const ans = Array.isArray(a.answer) ? a.answer.map(String).sort() : [];
      const corr = Array.isArray(q.correctAnswer) ? q.correctAnswer.map(String).sort() : [];
      correct = JSON.stringify(ans) === JSON.stringify(corr);
    }

    const marksObtained = correct ? (q.marks || 1) : 0;
    if (correct) score += marksObtained;

    answersGiven.push({ questionId: q._id, answer: a.answer, correct, marksObtained });
  }

  // upsert attempt
  const attempt = await QuizAttempt.findOneAndUpdate(
    { userId, quizId, status: 'ongoing' },
    {
      $set: {
        answers: answersGiven,
        answersGiven,
        score,
        status: 'completed',
        submittedAt: new Date(),
        timeTaken,
      },
    },
    { upsert: true, new: true }
  );

  return { attempt, score, answers: answersGiven };
}

// POST /api/quiz/submit/:quizId
router.post('/submit/:quizId', authMiddleware, async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const { answers = [], timeTaken = 0 } = req.body || {};
    if (!quizId) return res.status(400).json({ message: 'quizId required' });

    const result = await gradeAndSaveAttempt({ userId: req.user.id, quizId, answers, timeTaken });
    return res.json({ result: { score: result.score, answers: result.answers, attemptId: result.attempt._id } });
  } catch (err) {
    console.error('Quiz submit error:', err?.message || err);
    return res.status(500).json({ message: 'Failed to submit quiz' });
  }
});

// POST /api/quiz/submit (body contains quizId)
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { quizId, answers = [], timeTaken = 0 } = req.body || {};
    if (!quizId) return res.status(400).json({ message: 'quizId required' });

    const result = await gradeAndSaveAttempt({ userId: req.user.id, quizId, answers, timeTaken });
    return res.json({ result: { score: result.score, answers: result.answers, attemptId: result.attempt._id } });
  } catch (err) {
    console.error('Quiz submit error:', err?.message || err);
    return res.status(500).json({ message: 'Failed to submit quiz' });
  }
});

// GET ONGOING quiz for the user (dashboard continue)
router.get('/ongoing', authMiddleware, async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({ userId: req.user.id, status: 'ongoing' }).sort({ startedAt: -1 }).populate('quizId');
    return res.json({ quiz: attempt || null });
  } catch (err) {
    console.error('Ongoing quiz error:', err?.message || err);
    return res.status(500).json({ message: 'Failed to fetch ongoing quiz' });
  }
});

// GET recent attempts for dashboard
router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const limit = Number(req.query.limit || 5);
    const attempts = await QuizAttempt.find({ userId: req.user.id, status: 'completed' }).sort({ submittedAt: -1 }).limit(limit).populate('quizId');
    return res.json({ quizzes: attempts });
  } catch (err) {
    console.error('Recent quiz error:', err?.message || err);
    return res.status(500).json({ message: 'Failed to fetch recent quizzes' });
  }
});

// GET /api/quiz/history — list past attempts for the authenticated user
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const limit = Math.min(50, Number(req.query.limit || 20));
    const attempts = await QuizAttempt.find({ userId: req.user.id, status: 'completed' }).sort({ submittedAt: -1 }).limit(limit).populate('quizId');

    const result = attempts.map((a) => ({
      attemptId: a._id,
      quizId: a.quizId?._id,
      title: a.quizId?.title || a.quizId?.topic,
      score: a.score,
      submittedAt: a.submittedAt,
    }));

    return res.json({ attempts: result });
  } catch (err) {
    console.error('History error:', err?.message || err);
    return res.status(500).json({ message: 'Failed to load history' });
  }
});

// GET /api/quiz/:id — return quiz with questions (no correct answers)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const questions = (quiz.questions || []).map((q) => ({
      _id: q._id,
      type: q.type,
      question: q.question,
      options: q.options,
      timeLimit: q.timeLimit,
      marks: q.marks,
    }));

    return res.json({ quiz: { _id: quiz._id, topic: quiz.topic, difficulty: quiz.difficulty, title: quiz.title, timeLimit: quiz.timeLimit, questions } });
  } catch (err) {
    console.error('Get quiz error:', err?.message || err);
    return res.status(500).json({ message: 'Failed to load quiz' });
  }
});

module.exports = router;

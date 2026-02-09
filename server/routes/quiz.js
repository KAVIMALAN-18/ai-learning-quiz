const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const quizController = require('../controllers/quizController');

router.post('/generate', protect, quizController.generateQuiz);
router.post('/submit', protect, quizController.submitQuiz);
router.get('/history', protect, async (req, res) => {
  // Keep history as is for now or move to controller if needed
  const QuizAttempt = require('../models/QuizAttempt');
  try {
    const attempts = await QuizAttempt.find({ userId: req.user.id, status: 'completed' })
      .sort({ submittedAt: -1 })
      .populate('quizId');
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/recent', protect, quizController.getRecentAttempts);
router.get('/:id', protect, quizController.getQuiz);
router.get('/result/:id', protect, quizController.getQuizResult);

module.exports = router;

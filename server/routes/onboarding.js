const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/onboarding - Save onboarding data
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { goals, customGoals, level } = req.body;

    // Validation
    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ message: 'Goals must be a non-empty array' });
    }

    if (customGoals && !Array.isArray(customGoals)) {
      return res.status(400).json({ message: 'Custom goals must be an array' });
    }

    if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ message: 'Invalid level. Must be beginner, intermediate, or advanced' });
    }

    // Update user with onboarding data
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        learningGoals: goals,
        customGoals: customGoals || [],
        currentLevel: level,
        onboardingCompleted: true,
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Onboarding completed successfully',
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/onboarding - Get user onboarding data
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      learningGoals: user.learningGoals,
      customGoals: user.customGoals,
      currentLevel: user.currentLevel,
      onboardingCompleted: user.onboardingCompleted
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
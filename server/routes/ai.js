const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const aiTutorService = require('../services/aiTutor.service');

/**
 * POST /api/ai/analyze
 * Analyze user performance and get insights
 */
router.post('/analyze', protect, async (req, res) => {
    try {
        const { quizScores, completedTopics, timeSpent, accuracyHistory } = req.body;

        const analysis = await aiTutorService.analyzeUserPerformance({
            quizScores: quizScores || [],
            completedTopics: completedTopics || [],
            timeSpent: timeSpent || 0,
            accuracyHistory: accuracyHistory || []
        });

        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing performance:', error);
        res.status(500).json({ message: 'Failed to analyze performance' });
    }
});

/**
 * POST /api/ai/recommendations
 * Get personalized course recommendations
 */
router.post('/recommendations', protect, async (req, res) => {
    try {
        const { completedCourses, quizScores, overallLevel, availableCourses } = req.body;

        const recommendations = await aiTutorService.suggestCourses(
            {
                completedCourses: completedCourses || [],
                quizScores: quizScores || [],
                overallLevel: overallLevel || 'Beginner'
            },
            availableCourses || []
        );

        res.json(recommendations);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ message: 'Failed to get recommendations' });
    }
});

/**
 * POST /api/ai/study-plan
 * Generate personalized study plan
 */
router.post('/study-plan', protect, async (req, res) => {
    try {
        const { strengths, weaknesses, overallLevel, timeAvailable } = req.body;

        const studyPlan = await aiTutorService.createStudyPlan(
            {
                strengths: strengths || [],
                weaknesses: weaknesses || [],
                overallLevel: overallLevel || 'Beginner'
            },
            timeAvailable || '1 hour/day'
        );

        res.json(studyPlan);
    } catch (error) {
        console.error('Error creating study plan:', error);
        res.status(500).json({ message: 'Failed to create study plan' });
    }
});

/**
 * POST /api/ai/practice-test
 * Generate practice test questions
 */
router.post('/practice-test', protect, async (req, res) => {
    try {
        const { topic, difficulty, questionCount } = req.body;

        if (!topic) {
            return res.status(400).json({ message: 'Topic is required' });
        }

        const practiceTest = await aiTutorService.generatePracticeTest(
            topic,
            difficulty || 'Intermediate',
            questionCount || 5
        );

        res.json(practiceTest);
    } catch (error) {
        console.error('Error generating practice test:', error);
        res.status(500).json({ message: 'Failed to generate practice test' });
    }
});

/**
 * POST /api/ai/chat
 * Chat with AI tutor
 */
router.post('/chat', protect, async (req, res) => {
    try {
        const { question, context } = req.body;

        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }

        const response = await aiTutorService.chatWithTutor(
            question,
            context || {}
        );

        res.json({ response });
    } catch (error) {
        console.error('Error in AI chat:', error);
        res.status(500).json({ message: 'Failed to get AI response' });
    }
});

/**
 * POST /api/ai/topics
 * Get suggested topics to focus on
 */
router.post('/topics', protect, async (req, res) => {
    try {
        const { weaknesses, quizScores } = req.body;

        const topics = await aiTutorService.suggestTopics({
            weaknesses: weaknesses || [],
            quizScores: quizScores || []
        });

        res.json(topics);
    } catch (error) {
        console.error('Error suggesting topics:', error);
        res.status(500).json({ message: 'Failed to suggest topics' });
    }
});

module.exports = router;

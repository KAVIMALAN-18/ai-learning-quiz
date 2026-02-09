const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const { callGemini } = require('../utils/ai');
const { updateDailyProgress, updateStudentPerformance } = require('../utils/analyticsHelper');
const mongoose = require('mongoose');

/**
 * Generate Quiz questions using AI
 */
exports.generateQuiz = async (req, res) => {
    try {
        const { topic, difficulty = 'Intermediate', count = 10, timeLimit } = req.body;
        if (!topic) return res.status(400).json({ message: 'Topic is required' });

        const prompt = `You are an expert question generator. Generate ${count} ${difficulty} level questions for "${topic}".
        Include a mix of MCQ, Multi-select, and True/False.
        Return ONLY a JSON array of objects with: 
        { type, question, options, correctAnswer, explanation, timeLimit, marks }`;

        const text = await callGemini(prompt);
        const idx = text.indexOf('[');
        const questionsData = JSON.parse(text.slice(idx));

        const createdQuestions = await Question.insertMany(
            questionsData.map(q => ({ ...q, quizId: null }))
        );

        const quiz = await Quiz.create({
            title: `${topic} Assessment`,
            topic,
            difficulty,
            questions: createdQuestions.map(q => q._id),
            createdByUser: req.user.id,
            timeLimit: timeLimit || 600 // 10 mins default
        });

        await Question.updateMany(
            { _id: { $in: quiz.questions } },
            { $set: { quizId: quiz._id } }
        );

        res.status(201).json({ quizId: quiz._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "AI Generation failed" });
    }
};

/**
 * Grade and Submit Quiz
 */
exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, answers, timeTaken } = req.body;
        const userId = req.user.id;

        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        let score = 0;
        const gradedAnswers = [];

        for (const q of quiz.questions) {
            const userAnswer = answers.find(a => a.questionId.toString() === q._id.toString())?.answer;
            let isCorrect = false;

            if (q.type === 'mcq' || q.type === 'true-false') {
                isCorrect = String(userAnswer) === String(q.correctAnswer);
            } else if (q.type === 'multi-select') {
                const uAns = Array.isArray(userAnswer) ? userAnswer.map(String).sort() : [];
                const cAns = Array.isArray(q.correctAnswer) ? q.correctAnswer.map(String).sort() : [];
                isCorrect = JSON.stringify(uAns) === JSON.stringify(cAns);
            } else if (q.type === 'coding') {
                // Future: Add real test case execution logic here
                isCorrect = false;
            }

            if (isCorrect) score += q.marks || 1;
            gradedAnswers.push({
                questionId: q._id,
                answer: userAnswer,
                correct: isCorrect,
                marksObtained: isCorrect ? (q.marks || 1) : 0
            });
        }

        const percentage = (score / (quiz.questions.length || 1)) * 100;

        const attempt = await QuizAttempt.create({
            userId,
            quizId,
            answers: gradedAnswers,
            score,
            totalQuestions: quiz.questions.length,
            percentage,
            status: 'completed',
            submittedAt: new Date(),
            timeTaken
        });

        // Update Analytics
        updateDailyProgress(userId, { type: 'quiz' });
        updateStudentPerformance(userId);

        res.json({
            attemptId: attempt._id,
            score,
            percentage,
            gradedAnswers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Submission failed" });
    }
};

/**
 * Get Quiz Details (filtered)
 */
exports.getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('questions', '-correctAnswer -explanation');
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get Results Details
 */
exports.getQuizResult = async (req, res) => {
    try {
        const attempt = await QuizAttempt.findById(req.params.id)
            .populate('quizId')
            .populate('answers.questionId');
        if (!attempt) return res.status(404).json({ message: "Result not found" });
        res.json(attempt);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get Recent Quiz Attempts for the user
 */
exports.getRecentAttempts = async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 5;
        const attempts = await QuizAttempt.find({ userId: req.user.id })
            .sort({ submittedAt: -1 })
            .limit(count)
            .populate('quizId', 'title topic');

        // Map to format expected by dashboard
        const formatted = attempts.map(attempt => ({
            id: attempt._id,
            title: attempt.quizId?.title || 'External Assessment',
            score: attempt.percentage,
            date: new Date(attempt.submittedAt).toLocaleDateString(),
            status: attempt.percentage >= 70 ? 'passed' : 'failed'
        }));

        res.json(formatted);
    } catch (err) {
        console.error("Recent attempts failed:", err);
        res.status(500).json({ message: "Failed to load recent activity" });
    }
};

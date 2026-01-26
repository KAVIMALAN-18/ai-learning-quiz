// Dashboard Controller
// Provides data for the user dashboard

const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const Roadmap = require('../models/Roadmap');

/**
 * GET /api/dashboard/overview
 * Returns user profile and aggregated stats for the dashboard.
 */
exports.getDashboardOverview = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('name level goals lastActive');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Completed quizzes count
        const completedQuizzes = await QuizAttempt.countDocuments({ userId, status: 'completed' });

        // Roadmap progress percent
        const roadmap = await Roadmap.findOne({ userId });
        let progressPercent = 0;
        if (roadmap && roadmap.steps && roadmap.steps.length > 0) {
            const completed = roadmap.steps.filter(s => s.completed).length;
            progressPercent = Math.round((completed / roadmap.steps.length) * 100);
        }

        // Last activity (use lastActive from user or latest quiz attempt)
        const lastQuiz = await QuizAttempt.findOne({ userId }).sort({ submittedAt: -1 }).select('submittedAt');
        const lastActivity = user.lastActive || (lastQuiz && lastQuiz.submittedAt) || null;

        res.json({
            name: user.name,
            level: user.level,
            goals: user.goals,
            completedQuizzes,
            roadmapProgress: progressPercent,
            lastActivity,
        });
    } catch (err) {
        console.error('Dashboard overview error:', err);
        res.status(500).json({ message: 'Failed to load dashboard data' });
    }
};

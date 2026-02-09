/* DEBUG VERSION */
const mongoose = require('mongoose');

const QuizAttempt = require('../models/QuizAttempt');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const DailyProgress = require('../models/DailyProgress');
const StudentPerformance = require('../models/StudentPerformance');
const Course = require('../models/Course');
const StudySession = require('../models/StudySession');
const Progress = require('../models/Progress');

/* ==============================
   GET /api/analytics/overview
   ============================== */
exports.getOverview = async (req, res) => {
    try {
        const userId = req.user.id;

        // Parallel data fetching for performance
        const [quizStats, roadmaps, studySessions] = await Promise.all([
            QuizAttempt.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed' } },
                {
                    $group: {
                        _id: null,
                        totalQuizzes: { $sum: 1 },
                        avgScore: { $avg: '$score' },
                        avgPercentage: { $avg: '$percentage' }
                    }
                }
            ]),
            Roadmap.find({ userId }).select('steps'),
            StudySession.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                { $group: { _id: null, totalMinutes: { $sum: '$duration' } } }
            ])
        ]);

        const stats = quizStats[0] || { totalQuizzes: 0, avgScore: 0, avgPercentage: 0 };
        const totalMinutes = studySessions[0]?.totalMinutes || 0;

        // Roadmap Progress Calculation
        let totalSteps = 0;
        let completedSteps = 0;
        roadmaps.forEach(map => {
            if (map.steps) {
                totalSteps += map.steps.length;
                completedSteps += map.steps.filter(s => s.completed).length;
            }
        });
        const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

        // Streak Calculation
        const streak = await calculateStreak(userId);

        // Activity Data (Last 7 Days)
        const activityData = await getActivityData(userId);

        res.json({
            totalQuizzes: stats.totalQuizzes,
            avgScore: Math.round(stats.avgScore),
            avgPercentage: Math.round(stats.avgPercentage),
            progressPercent,
            streak,
            completedSteps,
            totalSteps,
            completedCourses: roadmaps.length, // Or count completed roadmaps
            hoursSpent: Math.round(totalMinutes / 60 * 10) / 10,
            activityData
        });

    } catch (err) {
        console.error('Analytics Overview Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Helpers
async function calculateStreak(userId) {
    try {
        const history = await DailyProgress.find({ userId }).sort({ date: -1 });
        if (history.length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const record of history) {
            const recordDate = new Date(record.date);
            recordDate.setHours(0, 0, 0, 0);

            // Check if record is today or consecutive day
            const diffTime = Math.abs(currentDate - recordDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
                streak++;
                currentDate = recordDate;
            } else {
                break;
            }
        }
        return streak;
    } catch (err) {
        console.error('Streak calculation error:', err);
        return 0;
    }
}

async function getActivityData(userId) {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0);

        const activities = await DailyProgress.find({
            userId,
            date: { $gte: last7Days }
        }).sort({ date: 1 });

        return activities.map(a => ({
            date: a.date,
            lessons: a.lessonsCompleted || 0,
            quizzes: a.quizzesTaken || 0,
            percentage: a.completionPercentage || 0
        }));
    } catch (err) {
        console.error('Activity data fetch error:', err);
        return [];
    }
}
/* ==============================
   GET /api/analytics/quizzes (Recent Results)
   ============================== */
exports.getQuizPerformance = async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch last 10 completed quizzes
        const attempts = await QuizAttempt.find({ userId, status: 'completed' })
            .sort({ submittedAt: -1 })
            .limit(10)
            .populate('quizId', 'title topic') // Populate quiz details if needed
            .lean();

        // Format for frontend
        const data = attempts.map(a => ({
            id: a._id,
            quizTitle: a.quizId?.title || 'Unknown Quiz',
            topic: a.quizId?.topic || 'General',
            date: a.submittedAt,
            score: a.score,
            totalQuestions: a.totalQuestions || 0, // Fallback if using old data
            percentage: a.percentage !== undefined ? a.percentage : (a.totalQuestions ? Math.round((a.score / a.totalQuestions) * 100) : 0),
            timeTaken: a.timeTaken
        })).reverse(); // Show oldest to newest for charts? Or handle in frontend. Usually charts need chronological.

        res.json(data);
    } catch (err) {
        console.error('Quiz Performance Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

/* ==============================
   GET /api/analytics/mastery (Topic Mastery)
   ============================== */
exports.getTopicAccuracy = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const mastery = await QuizAttempt.aggregate([
            { $match: { userId, status: 'completed' } },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: 'quizId',
                    foreignField: '_id',
                    as: 'quiz'
                }
            },
            { $unwind: '$quiz' },
            {
                $group: {
                    _id: '$quiz.topic',
                    avgPercentage: { $avg: '$percentage' },
                    attempts: { $sum: 1 }
                }
            },
            {
                $project: {
                    topic: '$_id',
                    accuracy: { $round: ['$avgPercentage', 1] },
                    attempts: 1
                }
            },
            { $sort: { accuracy: -1 } }
        ]);

        res.json(mastery);
    } catch (err) {
        console.error('Topic Mastery Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

/* ==============================
   GET /api/analytics/roadmap-progress
   ============================== */
exports.getRoadmapProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const roadmaps = await Roadmap.find({ userId }).select('steps');

        let totalSteps = 0;
        let completedSteps = 0;
        roadmaps.forEach(map => {
            if (map.steps) {
                totalSteps += map.steps.length;
                completedSteps += map.steps.filter(s => s.completed).length;
            }
        });
        const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

        res.json({ progress });
    } catch (err) {
        console.error('Roadmap Progress Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
/* ==============================
   GET /api/analytics/study-time
   ============================== */
exports.getStudyTime = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        // Aggregate Study Sessions
        const studyStats = await StudySession.aggregate([
            { $match: { userId, date: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalMinutes: { $sum: "$duration" }
                }
            }
        ]);

        // Transform to 7-day array
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const activity = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const stat = studyStats.find(s => s._id === dateStr);
            activity.push({
                day: days[d.getDay()],
                hours: stat ? Number((stat.totalMinutes / 60).toFixed(2)) : 0,
                date: dateStr
            });
        }

        res.json(activity);
    } catch (err) {
        console.error('Study Time Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

/* ==============================
   GET /api/analytics/progress (Study Progress)
   ============================== */
exports.getProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch progress records
        const progress = await Progress.find({ userId }).sort({ lastUpdated: -1 });
        res.json(progress);
    } catch (err) {
        console.error('Progress Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
/* ==============================
   POST /api/analytics/session
   ============================== */
exports.saveStudySession = async (req, res) => {
    try {
        const { topic, duration } = req.body;
        if (!topic || !duration) {
            return res.status(400).json({ message: 'Topic and duration are required' });
        }

        const session = await StudySession.create({
            userId: req.user.id,
            topic,
            duration: Number(duration),
            date: new Date()
        });

        res.status(201).json(session);
    } catch (err) {
        console.error('Save Session Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

/* ==============================
   POST /api/analytics/quiz-result
   ============================== */
exports.saveQuizResult = async (req, res) => {
    try {
        const { quizId, score, totalQuestions, timeTaken } = req.body;

        // Calculate percentage
        const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

        // Create or update quiz attempt
        // Note: Usually quiz submission logic is in quiz.controller.js.
        // This endpoint might be used if the frontend calculates the score locally or for external quizzes.
        // Assuming we are saving a NEW attempt here.

        const attempt = await QuizAttempt.create({
            userId: req.user.id,
            quizId,
            score,
            totalQuestions,
            percentage,
            timeTaken,
            status: 'completed',
            submittedAt: new Date()
        });

        // Update Progress (Optional: Update course progress if linked)
        // ...

        res.status(201).json(attempt);
    } catch (err) {
        console.error('Save Quiz Result Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
/* ==============================
   GET /api/analytics/detailed-performance (Legacy/Aggregated)
   ============================== */
exports.getDetailedPerformance = async (req, res) => {
    // Re-using getOverview logic or returning aggregated structure for frontend compatibility
    // For now, let's redirect to getOverview or construct a similar object
    try {
        // Reuse the logic from getOverview to construct the 'StudentPerformance' shape the frontend expects
        // Or simpler: Just return what getOverview returns and update frontend to use that.
        // But to keep frontend changes minimal in this step, let's shape it.

        // ... (We can refactor this later, for now let's rely on individual endpoints)
        res.status(410).json({ message: "Endpoint deprecated. Use specific analytics endpoints." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

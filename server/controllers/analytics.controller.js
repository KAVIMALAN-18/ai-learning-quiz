const mongoose = require('mongoose');
const QuizAttempt = require('../models/QuizAttempt');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const DailyProgress = require('../models/DailyProgress');
const StudentPerformance = require('../models/StudentPerformance');
const Course = require('../models/Course');

/* ==============================
   GET /api/analytics/overview
   ============================== */
exports.getOverview = async (req, res) => {
    console.log("🚀 [Analytics] getOverview requested by user:", req.user?.id);
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Not authorized" });
        }

        console.log(`📊 Fetching analytics for user: ${userId}`);

        // 1. Validate and Cast UserID for aggregation
        let userObjectId;
        try {
            userObjectId = new mongoose.Types.ObjectId(userId);
        } catch (e) {
            console.error("❌ Invalid UserID for aggregation:", userId);
            // If casting fails, we might still be able to use the string ID for non-aggregate queries
            // but for aggregate we need the object. We'll fallback to dummy score.
        }

        // 1. Unified Quiz Stats & Streak
        const [quizStats, roadmaps] = await Promise.all([
            QuizAttempt.aggregate([
                { $match: { userId: userObjectId, status: 'completed' } },
                {
                    $facet: {
                        overall: [
                            { $group: { _id: null, total: { $sum: 1 }, avgScore: { $avg: '$score' } } }
                        ],
                        activity: [
                            { $sort: { submittedAt: -1 } },
                            { $limit: 100 }, // Look at last 100 entries for trend/activity
                            {
                                $group: {
                                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" } },
                                    count: { $sum: 1 }
                                }
                            }
                        ],
                        lastAttempt: [
                            { $sort: { submittedAt: -1 } },
                            { $limit: 1 },
                            { $project: { submittedAt: 1 } }
                        ]
                    }
                }
            ]),
            Roadmap.find({ userId })
        ]);

        const stats = quizStats[0].overall[0] || { total: 0, avgScore: 0 };
        const totalQuizzes = stats.total;
        const avgScore = Math.round(stats.avgScore || 0);

        // 2. Roadmap Progress
        let totalSteps = 0;
        let completedSteps = 0;
        roadmaps.forEach(map => {
            if (map.steps) {
                totalSteps += map.steps.length;
                completedSteps += map.steps.filter(s => s.completed).length;
            }
        });
        const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

        // 3. Streak Calculation (Simpler)
        let streak = 0;
        const lastActive = quizStats[0].lastAttempt[0]?.submittedAt;
        if (lastActive) {
            const diffDays = (new Date() - new Date(lastActive)) / (1000 * 60 * 60 * 24);
            if (diffDays < 2) streak = 1; // Simplified streak check
        }

        // 4. Map Activity Data (7 days)
        const activityMap = {};
        quizStats[0].activity.forEach(a => activityMap[a._id] = a.count);

        const activityData = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            activityData.push(Math.min((activityMap[dateStr] || 0) * 20, 100));
        }

        res.json({
            totalQuizzes,
            avgScore,
            progressPercent,
            streak,
            completedSteps,
            totalSteps,
            completedCourses: roadmaps.length,
            hoursSpent: 0,
            activityData
        });

    } catch (err) {
        console.error('🔥 Critical Analytics Error:', err);
        res.status(500).json({
            message: 'Server Error',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

/* ==============================
   GET /api/analytics/quiz-performance
   ============================== */
exports.getQuizPerformance = async (req, res) => {
    try {
        const userId = req.user.id;
        const attempts = await QuizAttempt.find({ userId, status: 'completed' })
            .sort({ submittedAt: 1 })
            .limit(10)
            .select('submittedAt score')
            .lean();

        const data = attempts.map((a, i) => ({
            label: a.submittedAt.toLocaleDateString(),
            score: a.score
        }));

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ==============================
   GET /api/analytics/progress (Daily Completion %)
   ============================== */
exports.getProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const progress = await DailyProgress.find({
            userId,
            date: { $gte: last30Days }
        }).sort({ date: 1 }).lean();

        // Fill in missing days with 0 (or previous value? 0 is safer for daily activity)
        // If "Completion %" is cumulative, we should take the last knonwn.
        // If it's "Daily Efficiency", it's distinct.
        // User asked "How user improves daily/weekly". This implies cumulative or trend.
        // Let's return the raw daily snapshots.

        const data = progress.map(p => ({
            date: p.date.toLocaleDateString(),
            value: p.completionPercentage || 0
        }));

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ==============================
   GET /api/analytics/topic-accuracy
   ============================== */
exports.getTopicAccuracy = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const data = await QuizAttempt.aggregate([
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
                    avgScore: { $avg: '$score' }
                }
            },
            {
                $project: {
                    topic: '$_id',
                    accuracy: { $round: ['$avgScore', 1] }
                }
            }
        ]);

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ==============================
   GET /api/analytics/roadmap-progress
   ============================== */
exports.getRoadmapProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const roadmaps = await Roadmap.find({ userId }).lean();

        let completed = 0;
        let pending = 0;

        roadmaps.forEach(r => {
            r.steps.forEach(s => {
                if (s.completed) completed++;
                else pending++;
            });
        });

        res.json([
            { name: 'Completed', value: completed },
            { name: 'Pending', value: pending }
        ]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ==============================
   GET /api/analytics/study-time
   ============================== */
exports.getStudyTime = async (req, res) => {
    try {
        const userId = req.user.id;
        const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const attempts = await QuizAttempt.find({
            userId,
            submittedAt: { $gte: last7Days },
            status: 'completed'
        }).select('submittedAt timeTaken').lean();

        // Group by day of week
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const activity = Array(7).fill(0).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return { day: days[d.getDay()], hours: 0, date: d.toDateString() };
        });

        attempts.forEach(a => {
            const dayStr = new Date(a.submittedAt).toDateString();
            const slot = activity.find(s => s.date === dayStr);
            if (slot) slot.hours += (a.timeTaken || 0) / 3600; // convert seconds to hours
        });

        res.json(activity.map(a => ({ day: a.day, hours: Number(a.hours.toFixed(2)) })));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
/* ==============================
   GET /api/analytics/detailed-performance
   ============================== */
exports.getDetailedPerformance = async (req, res) => {
    try {
        const userId = req.user.id;
        let performance = await StudentPerformance.findOne({ userId });

        if (!performance) {
            // Lazy update if record doesn't exist but user has activity
            const { updateStudentPerformance } = require('../utils/analyticsHelper');
            await updateStudentPerformance(userId);
            performance = await StudentPerformance.findOne({ userId });
        }

        if (!performance) {
            return res.json({
                overallStats: {
                    totalQuizzesTaken: 0,
                    averageScore: 0,
                    overallAccuracy: 0,
                    totalTimeSpent: 0,
                    completionPercentage: 0
                },
                coursePerformance: [],
                topicMastery: [],
                performanceHistory: [],
                suggestions: ["Start your first quiz to see your performance metrics here!"]
            });
        }

        res.json(performance);
    } catch (err) {
        console.error("Detailed Analytics Error:", err);
        res.status(500).json({ message: err.message });
    }
};

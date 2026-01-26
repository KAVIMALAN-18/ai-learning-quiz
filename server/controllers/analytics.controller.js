const mongoose = require('mongoose');
const QuizAttempt = require('../models/QuizAttempt');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');

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

        // 1. Quiz Stats
        const totalQuizzes = await QuizAttempt.countDocuments({
            userId,
            status: 'completed'
        }).catch(err => { console.error("Error counting quizzes:", err); return 0; });

        let avgScore = 0;
        if (userObjectId) {
            try {
                const avgScoreResult = await QuizAttempt.aggregate([
                    { $match: { userId: userObjectId, status: 'completed' } },
                    { $group: { _id: null, avg: { $avg: '$score' } } }
                ]);
                avgScore = (avgScoreResult[0] && typeof avgScoreResult[0].avg === 'number') ? Math.round(avgScoreResult[0].avg) : 0;
            } catch (err) {
                console.error("❌ Aggregation error:", err);
            }
        }

        // 2. Roadmap Progress
        let totalSteps = 0;
        let completedSteps = 0;
        let progressPercent = 0;
        try {
            const roadmaps = await Roadmap.find({ userId });
            roadmaps.forEach(map => {
                if (map.steps && map.steps.length > 0) {
                    totalSteps += map.steps.length;
                    completedSteps += map.steps.filter(s => s.completed).length;
                }
            });
            progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
        } catch (err) {
            console.error("Error fetching roadmaps:", err);
        }

        // 3. Streak Calculation
        let streak = 0;
        try {
            const attempts = await QuizAttempt.find({ userId, status: 'completed' })
                .sort({ submittedAt: -1 })
                .select('submittedAt');

            const lastActive = attempts.length > 0 ? attempts[0].submittedAt : null;
            if (lastActive) {
                const hoursSinceLast = (new Date() - new Date(lastActive)) / (1000 * 60 * 60);
                if (hoursSinceLast < 48) {
                    streak = 1;
                }
            }
        } catch (err) {
            console.error("Error calculating streak:", err);
        }

        // 4. Activity Data (Last 7 Days)
        const activityData = [];
        try {
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);

                const nextDate = new Date(date);
                nextDate.setDate(date.getDate() + 1);

                const count = await QuizAttempt.countDocuments({
                    userId,
                    submittedAt: { $gte: date, $lt: nextDate },
                    status: 'completed'
                });
                activityData.push(Math.min(count * 20, 100));
            }
        } catch (err) {
            console.error("Error calculating activity data:", err);
            while (activityData.length < 7) activityData.push(0);
        }

        res.json({
            totalQuizzes,
            avgScore,
            progressPercent,
            streak,
            completedSteps,
            totalSteps,
            completedCourses: 0,
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

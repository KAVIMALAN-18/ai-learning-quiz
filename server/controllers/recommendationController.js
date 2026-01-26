const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const Roadmap = require('../models/Roadmap');
const { analyzeAndGeneratePlan } = require('../utils/aiReasoning');

/**
 * GET /api/recommendations
 * Gathers user data, performs analysis, and returns AI-driven study recommendations.
 */
exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Check Cache (valid for 12h for AI features)
        const cached = await Recommendation.findOne({
            userId,
            generatedAt: { $gt: new Date(Date.now() - 12 * 60 * 60 * 1000) }
        });

        if (cached && !req.query.refresh) {
            return res.json({
                recommendations: cached,
                source: 'cache'
            });
        }

        // 2. Data Gathering for Analysis
        const [user, attempts, roadmaps] = await Promise.all([
            User.findById(userId).lean(),
            QuizAttempt.find({ userId, status: 'completed' })
                .sort({ submittedAt: -1 })
                .limit(10)
                .populate('quizId')
                .lean(),
            Roadmap.find({ userId }).lean()
        ]);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // 3. Performance Analyzer
        const perfData = {
            currentLevel: user.currentLevel || 'Beginner',
            goals: user.learningGoals || [],
            history: attempts.map(a => ({
                topic: a.quizId?.topic || 'General',
                score: a.score,
                timeSpent: a.timeTaken,
                date: a.submittedAt,
                // Extract topics of wrong answers if available
                missedTopics: a.answers
                    .filter(ans => !ans.correct)
                    .map(ans => a.quizId?.topic || 'General')
            })),
            roadmap: roadmaps.map(r => ({
                title: r.title,
                progress: r.steps?.length > 0 ? (r.steps.filter(s => s.completed).length / r.steps.length) * 100 : 0
            }))
        };

        // 4. AI Study Plan Generator
        const aiOutput = await analyzeAndGeneratePlan(perfData);

        // 5. Structure and Save Result
        const recommendationData = {
            userId,
            weaknessAnalysis: aiOutput.weaknessAnalysis,
            studyPlan: aiOutput.studyPlan,
            progressMetrics: {
                improvementPercent: calculateImprovement(attempts),
                consistencyScore: calculateConsistency(attempts),
                weeklyTrend: attempts.slice(0, 7).map(a => ({
                    label: new Date(a.submittedAt).toLocaleDateString(),
                    score: a.score
                }))
            },
            resources: aiOutput.resources,
            generatedAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };

        const updatedRec = await Recommendation.findOneAndUpdate(
            { userId },
            recommendationData,
            { upsert: true, new: true }
        );

        res.json({ recommendations: updatedRec, source: 'ai' });
    } catch (err) {
        console.error('🔥 Analytics/AI Error:', err);
        res.status(500).json({ message: 'Skill analysis failed', details: err.message });
    }
};

/**
 * Helpers for Progress Tracking
 */
function calculateImprovement(attempts) {
    if (attempts.length < 2) return 0;
    const latest = attempts[0].score;
    const previous = attempts[attempts.length - 1].score;
    return Math.round(((latest - previous) / (previous || 1)) * 100);
}

function calculateConsistency(attempts) {
    if (attempts.length === 0) return 0;
    // Simple consistency: based on count of attempts in last 7 days
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const count = attempts.filter(a => new Date(a.submittedAt) > lastWeek).length;
    return Math.min(count * 20, 100);
}

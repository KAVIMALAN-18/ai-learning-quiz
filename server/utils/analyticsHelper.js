const DailyProgress = require("../models/DailyProgress");
const Roadmap = require("../models/Roadmap");
const QuizAttempt = require("../models/QuizAttempt");
const StudentPerformance = require("../models/StudentPerformance");
const Course = require("../models/Course");

/**
 * Updates the DailyProgress record for a user.
 * Should be called whenever a significant learning action occurs (lesson complete, quiz done).
 * @param {string} userId
 * @param {object} action - { type: 'lesson' | 'quiz', count: 1 }
 */
exports.updateDailyProgress = async (userId, action = {}) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let totalSteps = 0;
        let completedSteps = 0;

        const roadmaps = await Roadmap.find({ userId });
        roadmaps.forEach(map => {
            if (map.steps && map.steps.length > 0) {
                totalSteps += map.steps.length;
                completedSteps += map.steps.filter(s => s.completed).length;
            }
        });

        const completionPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

        let progress = await DailyProgress.findOne({ userId, date: today });

        if (!progress) {
            progress = new DailyProgress({
                userId,
                date: today,
                lessonsCompleted: 0,
                quizzesTaken: 0,
                pointsEarned: 0,
                completionPercentage: 0
            });
        }

        progress.completionPercentage = completionPercentage;

        if (action.type === 'lesson') {
            progress.lessonsCompleted += (action.count || 1);
            progress.pointsEarned += 10;
        } else if (action.type === 'quiz') {
            progress.quizzesTaken += (action.count || 1);
            progress.pointsEarned += 20;
        }

        await progress.save();
        console.log(`✅ DailyProgress updated for user ${userId}: ${completionPercentage}%`);

    } catch (err) {
        console.error("❌ Failed to update DailyProgress:", err);
    }
};

/**
 * Updates the StudentPerformance record for a user by aggregating all their activity.
 * @param {string} userId 
 */
exports.updateStudentPerformance = async (userId) => {
    try {
        const attempts = await QuizAttempt.find({ userId, status: 'completed' }).populate('quizId');

        if (attempts.length === 0) return;

        let totalScore = 0;
        let totalCorrect = 0;
        let totalQuestions = 0;
        let totalTime = 0;

        const topicStats = {};
        const history = [];

        attempts.forEach(attempt => {
            totalScore += attempt.score;
            totalTime += (attempt.timeTaken || 0);

            const attemptCorrect = attempt.answers?.filter(a => a.correct).length || 0;
            const attemptTotal = attempt.answers?.length || 1;
            totalCorrect += attemptCorrect;
            totalQuestions += attemptTotal;

            history.push({
                date: attempt.submittedAt,
                score: attempt.score,
                accuracy: Math.round((attemptCorrect / attemptTotal) * 100)
            });

            const topic = attempt.quizId?.topic || 'General';
            if (!topicStats[topic]) {
                topicStats[topic] = { correct: 0, total: 0, attempts: 0 };
            }
            topicStats[topic].correct += attemptCorrect;
            topicStats[topic].total += attemptTotal;
            topicStats[topic].attempts += 1;
        });

        const avgScore = Math.round(totalScore / attempts.length);
        const overallAccuracy = Math.round((totalCorrect / totalQuestions) * 100);

        const UserProgress = require('../models/UserProgress');
        const userProgressList = await UserProgress.find({ userId }).populate('courseId');

        const coursePerformance = userProgressList.map(up => {
            const courseIdStr = up.courseId?._id?.toString();
            const courseAttempts = attempts.filter(a => a.quizId?.courseId?.toString() === courseIdStr);
            const cAvgScore = courseAttempts.length > 0
                ? Math.round(courseAttempts.reduce((acc, curr) => acc + curr.score, 0) / courseAttempts.length)
                : 0;

            return {
                courseId: up.courseId?._id,
                courseTitle: up.courseId?.title,
                completionPercentage: up.isCompleted ? 100 : 0,
                averageScore: cAvgScore,
                quizzesTaken: courseAttempts.length
            };
        });

        const topicMastery = Object.keys(topicStats).map(topic => {
            const accuracy = Math.round((topicStats[topic].correct / topicStats[topic].total) * 100);
            let status = 'Improving';
            if (accuracy >= 85) status = 'Strong';
            else if (accuracy < 60) status = 'Weak';

            return {
                topicName: topic,
                accuracy,
                attempts: topicStats[topic].attempts,
                status
            };
        });

        const suggestions = [];
        const weakTopics = topicMastery.filter(t => t.status === 'Weak').map(t => t.topicName);
        if (weakTopics.length > 0) {
            suggestions.push(`Focus more on: ${weakTopics.join(', ')}`);
        }
        if (overallAccuracy < 70) {
            suggestions.push("Try reviewing the concept breakdowns before starting the mini tests.");
        }
        if (attempts.length < 5) {
            suggestions.push("Keep practicing! Consistency is key to building mastery.");
        }

        await StudentPerformance.findOneAndUpdate(
            { userId },
            {
                $set: {
                    overallStats: {
                        totalQuizzesTaken: attempts.length,
                        averageScore: avgScore,
                        overallAccuracy,
                        totalTimeSpent: totalTime,
                        completionPercentage: 0
                    },
                    coursePerformance,
                    topicMastery,
                    performanceHistory: history.slice(-10),
                    suggestions
                }
            },
            { upsert: true, new: true }
        );

        console.log(`📊 Performance metrics updated for user ${userId}`);

    } catch (err) {
        console.error("❌ Failed to update StudentPerformance:", err);
    }
};

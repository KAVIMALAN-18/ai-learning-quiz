const Course = require('../models/Course');
const Module = require('../models/Module');
const Topic = require('../models/Topic');
const UserProgress = require('../models/UserProgress');
const { updateDailyProgress } = require("../utils/analyticsHelper");

/**
 * GET all courses
 */
exports.getAllCourses = async (req, res) => {
    try {
        const userId = req.user?.id;
        const courses = await Course.find({ isActive: true }).select('-modules').lean();

        // Get user progress for all courses if logged in
        let progressEntries = [];
        if (userId) {
            progressEntries = await UserProgress.find({ userId }).lean();
        }

        const coursesWithProgress = courses.map(course => {
            const userProgress = progressEntries.find(p => p.courseId.toString() === course._id.toString());

            let progress = 0;
            if (userProgress && course.totalTopics > 0) {
                progress = Math.round((userProgress.completedTopics.length / course.totalTopics) * 100);
            }

            return {
                ...course,
                progress,
                isEnrolled: !!userProgress
            };
        });

        res.json(coursesWithProgress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET course by slug (with curriculum)
 */
exports.getCourseDetails = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user.id;

        const course = await Course.findOne({ slug })
            .populate({
                path: 'modules',
                options: { sort: { 'order': 1 } },
                populate: {
                    path: 'topics',
                    options: { sort: { 'order': 1 } },
                    select: 'title slug' // Don't send full content in curriculum list
                }
            })
            .lean();

        if (!course) return res.status(404).json({ message: "Course not found" });

        // Fetch user progress for this course
        const progress = await UserProgress.findOne({ userId, courseId: course._id }).lean();

        res.json({
            ...course,
            userProgress: progress || { completedTopics: [], lastTopicId: null }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET topic by ID (with full content)
 */
exports.getTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const userId = req.user.id;

        const topic = await Topic.findById(topicId).lean();
        if (!topic) return res.status(404).json({ message: "Topic not found" });

        // Update last accessed topic in progress
        await UserProgress.findOneAndUpdate(
            { userId, courseId: topic.moduleId.courseId }, // This still needs correct courseId mapping or direct lookup
            { lastTopicId: topicId },
            { upsert: true }
        );

        res.json(topic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * POST mark topic as completed
 */
exports.completeTopic = async (req, res) => {
    try {
        const { topicId, courseId } = req.body;
        const userId = req.user.id;

        const progress = await UserProgress.findOneAndUpdate(
            { userId, courseId },
            { $addToSet: { completedTopics: topicId } },
            { new: true, upsert: true }
        );

        if (progress) {
            updateDailyProgress(userId, { type: 'topic' });
        }

        res.json(progress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * POST submit topic test
 */
exports.submitTopicTest = async (req, res) => {
    try {
        const { topicId, courseId, answers } = req.body;
        const userId = req.user.id;

        const topic = await Topic.findById(topicId).populate('moduleId');
        if (!topic) return res.status(404).json({ message: "Topic not found" });

        // Calculate score (simple MCQ check)
        let correctCount = 0;
        const questions = topic.practiceQuestions || [];
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) correctCount++;
        });

        const scorePercent = (correctCount / (questions.length || 1)) * 100;
        const passed = scorePercent >= 80;

        // Update progress
        const progress = await UserProgress.findOneAndUpdate(
            { userId, courseId },
            {
                $addToSet: { completedTopics: passed ? topicId : undefined },
            },
            { new: true, upsert: true }
        );

        if (passed) {
            updateDailyProgress(userId, { type: 'quiz' });
        }

        res.json({
            score: scorePercent,
            passed,
            progress
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

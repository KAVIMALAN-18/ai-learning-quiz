const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const UserProgress = require('../models/UserProgress');

/**
 * GET all courses
 */
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isActive: true }).select('-modules').lean();
        res.json(courses);
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
                    path: 'lessons',
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
            userProgress: progress || { completedLessons: [], lastLessonId: null }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET lesson by ID (with full content)
 */
exports.getLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const userId = req.user.id;

        const lesson = await Lesson.findById(lessonId).lean();
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });

        // Update last accessed lesson in progress
        await UserProgress.findOneAndUpdate(
            { userId, courseId: lesson.moduleId.courseId }, // This requires moduleId to have courseId or some mapping
            { lastLessonId: lessonId },
            { upsert: true }
        );

        res.json(lesson);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * POST mark lesson as completed
 */
exports.completeLesson = async (req, res) => {
    try {
        const { lessonId, courseId } = req.body;
        const userId = req.user.id;

        const progress = await UserProgress.findOneAndUpdate(
            { userId, courseId },
            { $addToSet: { completedLessons: lessonId } },
            { new: true, upsert: true }
        );

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

        const lesson = await Lesson.findById(topicId).populate('moduleId');
        if (!lesson) return res.status(404).json({ message: "Topic not found" });

        // Calculate score (simple MCQ check)
        let correctCount = 0;
        const questions = lesson.quiz || [];
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) correctCount++;
        });

        const scorePercent = (correctCount / (questions.length || 1)) * 100;
        const passed = scorePercent >= 80;

        // Update progress
        const progress = await UserProgress.findOneAndUpdate(
            { userId, courseId },
            {
                $addToSet: { completedLessons: passed ? topicId : undefined },
            },
            { new: true, upsert: true }
        );

        // Unlock next topic logic
        if (passed) {
            // Find next lesson in the same module
            let nextLesson = await Lesson.findOne({
                moduleId: lesson.moduleId._id,
                order: { $gt: lesson.order }
            }).sort({ order: 1 });

            // If no next lesson in module, find first lesson of next module
            if (!nextLesson) {
                const nextModule = await Module.findOne({
                    courseId: courseId,
                    order: { $gt: lesson.moduleId.order }
                }).sort({ order: 1 });

                if (nextModule) {
                    nextLesson = await Lesson.findOne({ moduleId: nextModule._id }).sort({ order: 1 });
                }
            }

            // In a more advanced system, we'd use TopicProgress model to set 'available'
            // For now, the UI logic can check completedLessons to see if previous is done.
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

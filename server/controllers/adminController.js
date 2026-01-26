const User = require('../models/User');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Roadmap = require('../models/Roadmap');
const AuditLog = require('../models/AuditLog');

// Get all users with pagination
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search
            ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
            : {};

        const users = await User.find(query)
            .select('-password -twoFactorSecret') // Exclude sensitive
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({ users, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// Manage User (Ban, Change Role)
exports.manageUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { action, role } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Only Super Admins can modify other Super Admins' });
        }

        if (action === 'ban') {
            user.lockUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        } else if (action === 'unban') {
            user.lockUntil = null;
            user.loginAttempts = 0;
        } else if (action === 'promote') {
            user.role = role;
        }

        await user.save();

        await AuditLog.create({
            action: `ADMIN_${action.toUpperCase()}`,
            actorId: req.user.id,
            targetId: user._id,
            details: { role: user.role, lockUntil: user.lockUntil },
            ipAddress: req.ip
        });

        res.json({ message: `User ${action} successful`, user });
    } catch (err) {
        res.status(500).json({ message: 'Operation failed' });
    }
};

// Get Admin Overview Stats
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
        const totalQuizzes = await QuizAttempt.countDocuments({ status: 'completed' });

        const avgScoreResult = await QuizAttempt.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, avg: { $avg: '$score' } } }
        ]);
        const avgScore = avgScoreResult[0] ? Math.round(avgScoreResult[0].avg) : 0;

        // New users in last 7 days
        const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newUserGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalUsers,
            activeUsers,
            totalQuizzes,
            avgScore,
            newUserGrowth
        });
    } catch (err) {
        console.error("Admin stats error:", err);
        res.status(500).json({ message: 'Failed to fetch admin stats' });
    }
};

// Quiz Management
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('createdByUser', 'name email').sort({ createdAt: -1 });
        res.json({ quizzes });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        await Quiz.findByIdAndDelete(id);
        res.json({ message: 'Quiz deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete quiz' });
    }
};

// Roadmap Management
exports.getAllRoadmaps = async (req, res) => {
    try {
        const roadmaps = await Roadmap.find().populate('userId', 'name email').sort({ updatedAt: -1 });
        res.json({ roadmaps });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch roadmaps' });
    }
};

// Get System Logs
exports.getSystemLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('actorId', 'name email')
            .sort({ timestamp: -1 })
            .limit(100);
        res.json({ logs });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch logs' });
    }
};
// Curriculum Management
exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create course' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update course' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await Course.findByIdAndDelete(id);
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete course' });
    }
};

exports.createModule = async (req, res) => {
    try {
        const { courseId, title, order } = req.body;
        const module = await Module.create({ courseId, title, order });
        await Course.findByIdAndUpdate(courseId, { $push: { modules: module._id } });
        res.status(201).json(module);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create module' });
    }
};

exports.createLesson = async (req, res) => {
    try {
        const { moduleId, title, slug, content, codeSnippets, resources, quiz, order } = req.body;
        const lesson = await Lesson.create({ moduleId, title, slug, content, codeSnippets, resources, quiz, order });
        await Module.findByIdAndUpdate(moduleId, { $push: { lessons: lesson._id } });
        res.status(201).json(lesson);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create lesson' });
    }
};

exports.updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findByIdAndUpdate(id, req.body, { new: true });
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update lesson' });
    }
};

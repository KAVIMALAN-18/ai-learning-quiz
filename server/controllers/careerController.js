const Certificate = require('../models/Certificate');
const Placement = require('../models/Placement');
const Resume = require('../models/Resume');
const QuizAttempt = require('../models/QuizAttempt');
const UserProgress = require('../models/UserProgress');
const mongoose = require('mongoose');

/**
 * GET Skill Readiness Metrics
 */
exports.getReadinessMetrics = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // 1. Technical Score (Avg quiz score)
        const techAvg = await QuizAttempt.aggregate([
            { $match: { userId: userObjectId, status: 'completed' } },
            { $group: { _id: null, avg: { $avg: '$score' } } }
        ]);
        const technical = techAvg[0] ? Math.round(techAvg[0].avg) : 0;

        // 2. Aptitude Score (Dummy for now or filter specific quizzes)
        const aptitude = 75; // Logic placeholder

        // 3. Project Score (Based on roadmap/course progress)
        const progressCount = await UserProgress.countDocuments({ userId, isCompleted: true });
        const projectScore = Math.min(progressCount * 25, 100);

        // 4. Communication Score (From soft skills or interview sessions)
        const communication = 82; // Logic placeholder

        const overall = Math.round((technical + aptitude + projectScore + communication) / 4);

        res.json({
            overall,
            technical,
            aptitude,
            projectScore,
            communication
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET All Placements for user
 */
exports.getPlacements = async (req, res) => {
    try {
        const placements = await Placement.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(placements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * POST Create Placement Application
 */
exports.applyToJob = async (req, res) => {
    try {
        const { companyName, role, location } = req.body;
        const newPlacement = await Placement.create({
            userId: req.user.id,
            companyName,
            role,
            location
        });
        res.status(201).json(newPlacement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * POST Generate Certificate
 */
exports.generateCertificate = async (req, res) => {
    try {
        const { courseId, courseName, score } = req.body;
        const userId = req.user.id;
        const userName = req.user.name || "LearnSphere Learner";

        // Verification ID generation
        const verificationId = `CERT-${userId.toString().slice(-4)}-${Date.now().toString().slice(-6)}`.toUpperCase();

        const certificate = await Certificate.create({
            userId,
            courseId,
            courseName,
            userName,
            score,
            verificationId,
            qrCodeData: `https://learnsphere.io/verify/${verificationId}`
        });

        res.status(201).json(certificate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
/**
 * GET Verify Certificate (Public)
 */
exports.verifyCertificate = async (req, res) => {
    try {
        const { verificationId } = req.params;
        const cert = await Certificate.findOne({ verificationId }).populate('userId', 'name').lean();

        if (!cert) {
            return res.status(404).json({ valid: false, message: "Certificate not found" });
        }

        res.json({
            valid: true,
            certificate: {
                id: cert.verificationId,
                name: cert.userName,
                course: cert.courseName,
                completionDate: cert.issueDate,
                score: cert.score,
                status: 'valid'
            }
        });
    } catch (err) {
        res.status(500).json({ valid: false, message: err.message });
    }
};

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    getOverview,
    getQuizPerformance,
    getTopicAccuracy,
    getRoadmapProgress,
    getStudyTime,
    getProgress,
    saveStudySession,
    saveQuizResult,
    getDetailedPerformance
} = require("../controllers/analytics.controller");

// GET /api/analytics/overview
router.get("/overview", protect, getOverview);

// Detailed Performance Data
router.get("/detailed-performance", protect, getDetailedPerformance);

// Chart Data Ends
router.get("/quiz-performance", protect, getQuizPerformance);
router.get("/topic-accuracy", protect, getTopicAccuracy);
router.get("/roadmap-progress", protect, getRoadmapProgress);
router.get("/study-time", protect, getStudyTime);
router.get("/progress", protect, getProgress);

// POST Data
router.post("/session", protect, saveStudySession);
router.post("/quiz-result", protect, saveQuizResult);

module.exports = router;

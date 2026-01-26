const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    getOverview,
    getQuizPerformance,
    getTopicAccuracy,
    getRoadmapProgress,
    getStudyTime
} = require("../controllers/analytics.controller");

// GET /api/analytics/overview
router.get("/overview", protect, getOverview);

// Chart Data Ends
router.get("/quiz-performance", protect, getQuizPerformance);
router.get("/topic-accuracy", protect, getTopicAccuracy);
router.get("/roadmap-progress", protect, getRoadmapProgress);
router.get("/study-time", protect, getStudyTime);

module.exports = router;

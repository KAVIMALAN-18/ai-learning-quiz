const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardOverview } = require('../controllers/dashboard.controller');

// GET /api/dashboard/overview
router.get('/overview', protect, getDashboardOverview);
router.get('/roadmap/:topic', protect, require('../controllers/dashboard.controller').getRoadmapByTopic);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const recommendationController = require('../controllers/recommendationController');

router.use(protect);

router.get('/', recommendationController.getRecommendations);

module.exports = router;

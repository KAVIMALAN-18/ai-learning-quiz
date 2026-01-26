const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getReadinessMetrics,
    getPlacements,
    applyToJob,
    generateCertificate
} = require('../controllers/careerController');

router.get('/metrics', protect, getReadinessMetrics);
router.get('/placements', protect, getPlacements);
router.post('/placements', protect, applyToJob);
router.post('/certificates/generate', protect, generateCertificate);

module.exports = router;

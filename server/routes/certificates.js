const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const certificateController = require('../controllers/certificateController');

// Protected routes (require authentication)
router.post('/generate', protect, certificateController.generateCertificate);
router.get('/my-certificates', protect, certificateController.getMyCertificates);
router.get('/:id', protect, certificateController.getCertificateById);

// Public routes (no authentication required)
router.get('/verify/:certificateId', certificateController.verifyCertificate);

module.exports = router;

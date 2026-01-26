const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.get('/stats', profileController.getStats);

// Settings routes
router.put('/password', profileController.changePassword);
router.put('/preferences', profileController.updatePreferences);

// Account deletion
router.delete('/account', profileController.deleteAccount);

module.exports = router;

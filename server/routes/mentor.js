const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const mentorController = require('../controllers/mentorController');

router.use(protect);

router.post('/chat', mentorController.chatWithMentor);
router.get('/history', mentorController.getChatHistory);
router.post('/career-path', mentorController.generateCareerPath);

module.exports = router;

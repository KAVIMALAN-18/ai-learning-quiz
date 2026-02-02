const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getAllCourses,
    getCourseDetails,
    getTopic,
    completeTopic,
    submitTopicTest
} = require('../controllers/courseController');

router.get('/', getAllCourses);
router.get('/:slug', protect, getCourseDetails);
router.get('/topics/:topicId', protect, getTopic);
router.post('/complete-topic', protect, completeTopic);
router.post('/submit-topic-test', protect, submitTopicTest);

module.exports = router;

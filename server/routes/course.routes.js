const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getAllCourses,
    getCourseDetails,
    getLesson,
    completeLesson,
    submitTopicTest
} = require('../controllers/courseController');

router.get('/', protect, getAllCourses);
router.get('/:slug', protect, getCourseDetails);
router.get('/lessons/:lessonId', protect, getLesson);
router.post('/complete-lesson', protect, completeLesson);
router.post('/submit-test', protect, submitTopicTest);

module.exports = router;

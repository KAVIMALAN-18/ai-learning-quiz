const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// All routes require login AND admin role
router.use(protect); // Checks valid token
router.use(authorize('admin', 'super_admin')); // Checks Role

router.get('/stats', adminController.getAdminStats);
router.get('/users', adminController.getAllUsers);
router.post('/users/:userId/manage', adminController.manageUser);
router.get('/quizzes', adminController.getAllQuizzes);
router.delete('/quizzes/:id', adminController.deleteQuiz);
router.get('/roadmaps', adminController.getAllRoadmaps);
router.get('/logs', adminController.getSystemLogs);

// Curriculum Management
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);
router.post('/modules', adminController.createModule);
router.post('/lessons', adminController.createLesson);
router.put('/lessons/:id', adminController.updateLesson);

module.exports = router;

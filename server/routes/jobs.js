const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const jobController = require('../controllers/jobController');

// Public read (optional, usually requires auth)
router.get('/', jobController.getJobs);

// Protected routes
router.use(protect);

// Company & Jobs
router.post('/companies', jobController.createCompany);
router.post('/post', jobController.postJob);

// Smart Features
router.get('/recommendations', jobController.getRecommendations);

// Applications
router.post('/apply', jobController.applyForJob);
router.get('/my-applications', jobController.getMyApplications); // For Students

// Recruiter Management
router.get('/:jobId/applications', jobController.getJobApplications);
router.patch('/applications/:applicationId/status', jobController.updateApplicationStatus);

module.exports = router;

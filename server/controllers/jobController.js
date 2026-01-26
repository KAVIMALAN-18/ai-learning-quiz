const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const User = require('../models/User');

// Helper to calculate basic skill overlap score (0-100)
// In a real app, this would use Gemini for deep semantic matching
const calculateMatchScore = (userSkills, jobSkills) => {
    if (!jobSkills || jobSkills.length === 0) return 50; // Neutral if no skills specified
    if (!userSkills || userSkills.length === 0) return 0;

    const normalizedUser = userSkills.map(s => s.toLowerCase());
    const normalizedJob = jobSkills.map(s => s.toLowerCase());

    const matches = normalizedJob.filter(skill => normalizedUser.includes(skill));
    return Math.round((matches.length / normalizedJob.length) * 100);
};

exports.createCompany = async (req, res) => {
    try {
        const { name, description, website, location, industry, logo } = req.body;
        const company = await Company.create({
            name,
            ownerId: req.user.id,
            description,
            website,
            location,
            industry,
            logo
        });
        res.status(201).json({ company });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create company', error: err.message });
    }
};

exports.postJob = async (req, res) => {
    try {
        const { companyId, title, description, skillsRequired, type, location, salary, isRemote } = req.body;

        // Verify ownership
        const company = await Company.findOne({ _id: companyId, ownerId: req.user.id });
        if (!company) return res.status(403).json({ message: 'Unauthorized to post for this company' });

        const job = await Job.create({
            companyId,
            recruiterId: req.user.id,
            title,
            description,
            skillsRequired,
            type,
            location,
            salary,
            isRemote
        });
        res.status(201).json({ job });
    } catch (err) {
        res.status(500).json({ message: 'Failed to post job', error: err.message });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const { type, isRemote, minSalary } = req.query;
        const filter = { status: 'OPEN' };

        if (type) filter.type = type;
        if (isRemote === 'true') filter.isRemote = true;
        if (minSalary) filter['salary.max'] = { $gte: Number(minSalary) };

        const jobs = await Job.find(filter)
            .populate('companyId', 'name logo location')
            .sort({ createdAt: -1 });

        res.json({ jobs });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch jobs' });
    }
};

// Smart Recommendations
exports.getRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Gather user skills from mastery map + manual tags
        // User.mastery is a Map, convert keys to array
        const verifiedSkills = user.mastery ? Array.from(user.mastery.keys()) : [];
        // Could also mix in user.strengths if available

        const allJobs = await Job.find({ status: 'OPEN' }).populate('companyId', 'name logo');

        // Calculate score for each job
        const scoredJobs = allJobs.map(job => {
            const score = calculateMatchScore(verifiedSkills, job.skillsRequired);
            return { ...job.toObject(), matchScore: score };
        });

        // Sort by score desc
        scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

        res.json({ jobs: scoredJobs.slice(0, 10) }); // Top 10
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to generate recommendations' });
    }
};

exports.applyForJob = async (req, res) => {
    try {
        const { jobId, resumeUrl, coverLetter } = req.body;

        const existing = await Application.findOne({ jobId, applicantId: req.user.id });
        if (existing) return res.status(400).json({ message: 'Already applied' });

        const job = await Job.findById(jobId);
        const user = await User.findById(req.user.id);

        // Calculate initial match score
        const verifiedSkills = user.mastery ? Array.from(user.mastery.keys()) : [];
        const score = calculateMatchScore(verifiedSkills, job.skillsRequired);

        const application = await Application.create({
            jobId,
            applicantId: req.user.id,
            resumeUrl,
            coverLetter,
            matchScore: score, // Store initial score
            status: 'APPLIED'
        });

        // Increment job applicant count
        await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

        res.status(201).json({ application });
    } catch (err) {
        res.status(500).json({ message: 'Failed to apply' });
    }
};

exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Verify ownership: Job must belong to a company owned by this user
        // (Simplified check: verify job.recruiterId === user.id)
        const job = await Job.findOne({ _id: jobId, recruiterId: req.user.id });
        if (!job) return res.status(403).json({ message: 'Unauthorized to view applications for this job' });

        const applications = await Application.find({ jobId })
            .populate('applicantId', 'name email mobile mastery')
            .sort({ matchScore: -1 });

        res.json({ applications });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        // Verify ownership via Job lookup
        const app = await Application.findById(applicationId).populate('jobId');
        if (!app) return res.status(404).json({ message: 'Application not found' });

        if (String(app.jobId.recruiterId) !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        app.status = status;
        await app.save();

        res.json({ application: app });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update status' });
    }
};

exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user.id })
            .populate({
                path: 'jobId',
                populate: { path: 'companyId', select: 'name logo' }
            })
            .sort({ appliedAt: -1 });

        res.json({ applications });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch your applications' });
    }
};

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] }, // Free text requirements
    skillsRequired: { type: [String], default: [] }, // Structured tags for matching (e.g., 'React', 'Node')
    type: {
        type: String,
        enum: ['FullTime', 'PartTime', 'Internship', 'Contract'],
        required: true
    },
    location: { type: String, required: true }, // 'Remote', 'Bengaluru', etc.
    isRemote: { type: Boolean, default: false },
    salary: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: 'USD' }
    },
    status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
    applicantsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);

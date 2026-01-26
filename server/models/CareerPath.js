const mongoose = require('mongoose');

const CareerPathSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: String, required: true }, // e.g. "Frontend Developer"

    // The generated roadmap specific to this career path
    roadmap: [{
        title: { type: String },
        description: { type: String },
        status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
        resources: [{ title: String, url: String }]
    }],

    // Analysis of user's fit for this role
    readiness: {
        score: { type: Number, default: 0 }, // 0-100
        missingSkills: [String],
        strongSkills: [String],
        nextMilestone: { type: String }
    },

    generatedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CareerPath', CareerPathSchema);

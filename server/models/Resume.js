const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        location: String,
        summary: String
    },
    education: [{
        institution: String,
        degree: String,
        year: String,
        score: String
    }],
    experience: [{
        company: String,
        role: String,
        duration: String,
        description: String
    }],
    skills: [String],
    projects: [{
        title: String,
        description: String,
        link: String
    }],
    certificates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate'
    }],
    scores: {
        technical: Number,
        aptitude: Number,
        softSkills: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);

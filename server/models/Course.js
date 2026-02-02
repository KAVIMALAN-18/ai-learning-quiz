const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    thumbnail: { type: String },
    icon: { type: String },

    // Professional Course Profile
    category: {
        type: String,
        enum: ['Programming', 'Backend', 'Frontend', 'Database', 'AI/ML', 'Cloud/DevOps', 'Mobile'],
        required: true
    },
    tags: [{ type: String }], // For search

    // Course Details
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    estimatedTime: { type: String }, // e.g., "40 hours"

    // Professional Profile Fields
    overview: { type: String }, // Detailed course overview
    industryUsage: { type: String }, // How it's used in industry
    careerRelevance: { type: String }, // Career impact
    prerequisites: [{ type: String }], // What students need to know
    objectives: [{ type: String }], // Learning objectives
    skillsGained: [{ type: String }], // Skills students will gain
    learningOutcomes: [{ type: String }], // What students will be able to do
    toolsUsed: [{ type: String }], // Technologies/tools covered
    realWorldApplications: [{ type: String }], // Real-world use cases

    // Course Structure
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    totalModules: { type: Number, default: 0 },
    totalTopics: { type: Number, default: 0 },

    // Exam Configuration
    hasFinalExam: { type: Boolean, default: true },
    passingScore: { type: Number, default: 70 }, // Percentage

    // Metadata
    instructor: { type: String, default: 'AI Learning Platform' },
    isActive: { type: Boolean, default: true },
    enrollmentCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);

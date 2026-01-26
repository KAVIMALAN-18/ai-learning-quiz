const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // 1. Weakness Analysis
    weaknessAnalysis: [{
        topic: { type: String, required: true },
        level: { type: String },
        weaknessScore: { type: Number }, // 0-100%
        suggestedAction: { type: String }
    }],

    // 2. AI Generated Study Plan
    studyPlan: {
        durationDays: { type: Number, default: 7 },
        plan: [{
            day: { type: Number },
            topic: { type: String },
            tasks: [{
                taskType: { type: String }, // 'Practice', 'Revision', 'Reading', 'Rest'
                detail: { type: String },
                resourceLink: { type: String }
            }]
        }]
    },

    // 3. Progress Tracking
    progressMetrics: {
        improvementPercent: { type: Number, default: 0 },
        consistencyScore: { type: Number, default: 0 },
        weeklyTrend: [{ date: Date, score: Number }]
    },

    // 4. Curated Resources
    resources: [{
        topic: { type: String },
        links: [{
            title: { type: String },
            url: { type: String },
            type: { type: String, enum: ['YouTube', 'Article', 'Documentation', 'Course'] }
        }]
    }],

    generatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

// Index for quick lookup
RecommendationSchema.index({ userId: 1 });

module.exports = mongoose.model('Recommendation', RecommendationSchema);

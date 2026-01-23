const mongoose = require('mongoose');

const DailyTaskSchema = new mongoose.Schema({
    day: { type: String, required: true }, // e.g., "Monday"
    tasks: [{
        type: { type: String, enum: ['quiz', 'roadmap_step', 'review'], required: true },
        title: { type: String, required: true },
        topic: { type: String },
        duration: { type: String }, // e.g., "15 mins"
        completed: { type: Boolean, default: false }
    }]
});

const StudyPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekStarting: { type: Date, required: true },
    goals: { type: [String], default: [] },
    schedule: [DailyTaskSchema],
    aiSummary: { type: String },
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);

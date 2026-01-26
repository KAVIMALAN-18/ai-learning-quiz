const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    thumbnail: { type: String },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    estimatedTime: { type: String }, // e.g., "10 hours"
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);

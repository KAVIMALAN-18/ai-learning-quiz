const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: Number, default: 0 },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }]
}, { timestamps: true });

module.exports = mongoose.model('Module', ModuleSchema);

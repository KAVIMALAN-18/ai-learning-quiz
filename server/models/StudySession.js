const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StudySession', StudySessionSchema);

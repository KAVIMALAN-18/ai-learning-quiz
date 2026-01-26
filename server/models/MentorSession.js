const mongoose = require('mongoose');

const MentorSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [{
        role: { type: String, enum: ['user', 'model'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    // Context to help the AI remember user's current focus
    context: {
        currentGoal: { type: String }, // e.g., "Learn React"
        lastTopic: { type: String },   // e.g., "Hooks"
        mood: { type: String }         // e.g., "Frustrated", "Motivated" - strictly internal for AI
    },
    lastActive: { type: Date, default: Date.now }
});

// Index for quick retrieval of user's session
MentorSessionSchema.index({ userId: 1 });

module.exports = mongoose.model('MentorSession', MentorSessionSchema);

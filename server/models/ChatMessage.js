const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true, trim: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  message: { type: String, required: true },
}, { timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);

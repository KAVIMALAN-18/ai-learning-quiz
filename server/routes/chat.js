const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');

const { callGemini } = require('../utils/ai');

// Helper to call Gemini for chat completions
async function callGeminiChat({ topic, level, history, question }) {
  // Build a conversational prompt including recent history
  let prompt = `You are an AI Tutor for the topic "${topic}". The student level is ${level}.`;
  prompt += '\n\nPrevious conversation:';
  history.forEach((m) => {
    prompt += `\n${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.message}`;
  });
  prompt += `\nStudent: ${question}`;
  prompt += `\n\nProvide a clear, concise, and ${level === 'beginner' ? 'beginner-friendly, example-driven' : 'detailed'} answer. Use examples where appropriate.`;

  return await callGemini(prompt);
}

// POST /api/chat/ask  { topic, question }
router.post('/ask', protect, async (req, res) => {
  try {
    const { topic, question } = req.body;
    if (!topic || !question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ message: 'Topic and question are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const level = user.currentLevel || 'beginner';

    // Save user question
    const userMsg = await ChatMessage.create({ userId: user._id, topic: topic.trim(), role: 'user', message: question.trim() });

    // Fetch last 10 messages for context (latest first -> keep order)
    const history = await ChatMessage.find({ userId: user._id, topic: topic.trim() }).sort({ createdAt: -1 }).limit(10);
    const historyAsc = history.reverse();

    // Call Gemini
    const aiText = await callGeminiChat({ topic: topic.trim(), level, history: historyAsc, question: question.trim() });

    // Save AI response
    const aiMsg = await ChatMessage.create({ userId: user._id, topic: topic.trim(), role: 'assistant', message: aiText });

    return res.json({ answer: aiText, aiMessage: aiMsg });
  } catch (error) {
    console.error('Chat ask error:', error.message || error);
    if (error.response && error.response.data) console.error('Gemini error:', JSON.stringify(error.response.data));
    return res.status(500).json({ message: 'Failed to process question', error: error.message });
  }
});

// GET /api/chat/messages?topic=JavaScript
router.get('/messages', protect, async (req, res) => {
  try {
    const topic = (req.query.topic || '').trim();
    if (!topic) return res.status(400).json({ message: 'Topic query parameter is required' });

    const messages = await ChatMessage.find({ userId: req.user.id, topic }).sort({ createdAt: 1 }).limit(200);
    return res.json({ messages });
  } catch (error) {
    console.error('Chat messages error:', error.message || error);
    return res.status(500).json({ message: 'Failed to load messages', error: error.message });
  }
});

// DELETE /api/chat/clear?topic=JavaScript
router.delete('/clear', protect, async (req, res) => {
  try {
    const topic = (req.query.topic || '').trim();
    if (!topic) return res.status(400).json({ message: 'Topic query parameter is required' });

    await ChatMessage.deleteMany({ userId: req.user.id, topic });
    return res.json({ message: 'Chat cleared' });
  } catch (error) {
    console.error('Clear chat error:', error.message || error);
    return res.status(500).json({ message: 'Failed to clear chat', error: error.message });
  }
});

module.exports = router;

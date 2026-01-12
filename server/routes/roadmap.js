const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Roadmap = require('../models/Roadmap');

// Helper to call Gemini (configurable via env)
async function generateRoadmapWithGemini({ topic, level }) {
  const GEMINI_URL = process.env.GEMINI_API_URL;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_URL || !GEMINI_KEY) {
    throw new Error('Gemini API URL or key not configured in environment');
  }

  const prompt = `Create a clear, actionable step-by-step learning roadmap for the topic "${topic}" for a ${level} learner. Provide 6-10 numbered steps. For each step include a short title and a 1-2 sentence description.`;

  // Attempt a generic POST to the configured Gemini endpoint. The exact API
  // shape may vary; this code expects a text result in one of common fields.
  const response = await axios.post(
    GEMINI_URL,
    { prompt },
    {
      headers: {
        'Authorization': `Bearer ${GEMINI_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    }
  );

  // Try multiple common locations for generated text
  const data = response.data || {};
  let text = '';
  if (typeof data === 'string') text = data;
  else if (data.output_text) text = data.output_text;
  else if (data.text) text = data.text;
  else if (data.output) text = JSON.stringify(data.output);
  else if (data.choices && data.choices[0]) {
    text = data.choices[0].message?.content || data.choices[0].text || JSON.stringify(data.choices[0]);
  } else {
    text = JSON.stringify(data);
  }

  // Parse into steps: look for numbered lines or bullets
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const steps = [];

  for (const line of lines) {
    // match leading number or bullet
    const m = line.match(/^\d+\.?\s*(?:[-.)]?\s*)?(.*)$/);
    let content = m ? m[1] : line.replace(/^[-*•]\s*/, '');

    // Try to split title and description by ' - ' or ': '
    let title = content;
    let description = '';
    const splitter = content.match(/\s[-–—:]\s/);
    if (splitter) {
      const parts = content.split(/\s[-–—:]\s/);
      title = parts[0];
      description = parts.slice(1).join(' - ');
    } else {
      // try to split at first dash
      const idx = content.indexOf(' - ');
      if (idx > 0) {
        title = content.slice(0, idx);
        description = content.slice(idx + 3);
      } else {
        // if the line is long, take first 6 words as title
        const words = content.split(/\s+/);
        if (words.length > 10) {
          title = words.slice(0, 6).join(' ') + '...';
          description = words.slice(6).join(' ');
        }
      }
    }

    steps.push({ title: title.trim(), description: description.trim(), completed: false });
    if (steps.length >= 12) break;
  }

  // If parsing produced no steps, create a fallback
  if (steps.length === 0) {
    steps.push({ title: `Learn basics of ${topic}`, description: `Start with foundational concepts for ${topic} at ${level} level.`, completed: false });
  }

  return steps;
}

/*
  POST /api/roadmap/generate
  Body: { topic: "JavaScript" }
  Protected route — use auth middleware to get user id
*/
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    // Fetch user to get level
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const level = user.currentLevel || 'beginner';

    // Generate roadmap via Gemini
    const steps = await generateRoadmapWithGemini({ topic: topic.trim(), level });

    // Save to DB
    const roadmap = await Roadmap.create({ userId: user._id, topic: topic.trim(), level, steps });

    return res.status(201).json({ roadmap });
  } catch (error) {
    console.error('Roadmap generation error:', error.message || error);
    if (error.response && error.response.data) {
      console.error('Gemini response error:', JSON.stringify(error.response.data));
    }
    return res.status(500).json({ message: 'Failed to generate roadmap', error: error.message });
  }
});

// GET /api/roadmap?topic=JavaScript
router.get('/', authMiddleware, async (req, res) => {
  try {
    const topic = (req.query.topic || '').trim();
    if (!topic) return res.status(400).json({ message: 'Topic query parameter is required' });

    let roadmap = await Roadmap.findOne({ userId: req.user.id, topic });
    if (!roadmap) {
      // auto-generate if missing
      const user = await User.findById(req.user.id);
      const level = user?.currentLevel || 'beginner';
      const steps = await generateRoadmapWithGemini({ topic, level });
      roadmap = await Roadmap.create({ userId: req.user.id, topic, level, steps });
    }

    return res.json({ roadmap });
  } catch (error) {
    console.error('Fetch roadmap error:', error.message || error);
    return res.status(500).json({ message: 'Failed to fetch roadmap', error: error.message });
  }
});

// PATCH /api/roadmap/:id/steps/:index  -> update completed flag
router.patch('/:id/steps/:index', authMiddleware, async (req, res) => {
  try {
    const { id, index } = req.params;
    const { completed } = req.body;

    const roadmap = await Roadmap.findOne({ _id: id, userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

    const idx = parseInt(index, 10);
    if (Number.isNaN(idx) || idx < 0 || idx >= roadmap.steps.length) {
      return res.status(400).json({ message: 'Invalid step index' });
    }

    roadmap.steps[idx].completed = !!completed;
    await roadmap.save();

    return res.json({ roadmap });
  } catch (error) {
    console.error('Update step error:', error.message || error);
    return res.status(500).json({ message: 'Failed to update step', error: error.message });
  }
});

// POST /api/roadmap/:id/regenerate -> regenerate steps for given roadmap
router.post('/:id/regenerate', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const roadmap = await Roadmap.findOne({ _id: id, userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

    const user = await User.findById(req.user.id);
    const level = user?.currentLevel || roadmap.level || 'beginner';

    const steps = await generateRoadmapWithGemini({ topic: roadmap.topic, level });

    roadmap.steps = steps;
    roadmap.level = level;
    await roadmap.save();

    return res.json({ roadmap });
  } catch (error) {
    console.error('Regenerate roadmap error:', error.message || error);
    return res.status(500).json({ message: 'Failed to regenerate roadmap', error: error.message });
  }
});

module.exports = router;

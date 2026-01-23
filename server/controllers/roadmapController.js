const User = require("../models/User");
const Roadmap = require("../models/Roadmap");

const { callGemini } = require("../utils/ai");

/**
 * Builds a structured prompt for the AI to generate a roadmap.
 * @param {string} topic - The learning subject.
 * @param {string} level - User's proficiency level (beginner, intermediate, advanced).
 * @returns {string} The formatted prompt.
 */
function buildPrompt(topic, level) {
  return `Create a ${level}-friendly learning roadmap for "${topic}".\n\nReturn ONLY valid JSON in this format:\n{\n  "steps": [\n    { "title": "Step title", "description": "Short explanation" }\n  ]\n}\n`;
}

/**
 * Wrapper for the Gemini AI service call.
 * @param {string} prompt - The prompt to send.
 * @returns {Promise<string|null>} The AI's response text.
 */
async function callGeminiRaw(prompt) {
  try {
    return await callGemini(prompt);
  } catch (err) {
    console.error("Gemini call failed in roadmap controller:", err.message);
    return null;
  }
}

/**
 * Parses the AI's response into a valid array of roadmap steps.
 * Includes fallback logic for non-JSON or poorly formatted AI outputs.
 * @param {string} text - The raw text from the AI.
 * @returns {Array|null} Array of steps or null if parsing fails.
 */
function safeParseSteps(text) {
  if (!text || typeof text !== "string") return null;

  // Attempt 1: Extract JSON block
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonText = text.slice(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed.steps)) return parsed.steps;
    } catch (e) {
      // JSON failed, proceed to fallback line parsing
    }
  }

  // Attempt 2: Fallback line parsing (e.g., "1. Title - Description")
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const steps = [];
  for (const line of lines) {
    // Match numbered list: '1. Title - description'
    const matchNumbered = line.match(/^(?:\d+\.|[-*])\s*(.+?)(?:\s*[:-]\s*(.+))?$/);
    if (matchNumbered) {
      steps.push({ title: matchNumbered[1].trim(), description: (matchNumbered[2] || "").trim() });
      continue;
    }

    // Match dash separator: 'Title - Description'
    const matchDash = line.match(/^(.+?)\s+[-–—]\s+(.+)$/);
    if (matchDash) {
      steps.push({ title: matchDash[1].trim(), description: matchDash[2].trim() });
      continue;
    }

    // Attempt 3: If short line, treat as a simple title
    if (line.length < 80) {
      steps.push({ title: line, description: "" });
    }
  }

  return steps.length ? steps : null;
}


function fallbackRoadmap(topic, level) {
  const generic = [
    { title: `Fundamentals of ${topic}`, description: `Core concepts and syntax to get started with ${topic}.` },
    { title: `Build small projects`, description: `Create simple projects to apply core concepts and build confidence.` },
    { title: `Intermediate patterns`, description: `Learn common patterns and best practices for ${topic}.` },
    { title: `Testing & Debugging`, description: `Practice testing and debugging strategies.` },
    { title: `Real-world project`, description: `Work on a larger project and deploy it.` },
  ];
  return generic.map((s) => ({ ...s, completed: false }));
}

async function generateStepsForTopic(topic, level) {
  const prompt = buildPrompt(topic, level || "beginner");
  const text = await callGeminiRaw(prompt);
  const parsed = safeParseSteps(text);
  if (parsed && parsed.length) {
    // Normalize to { title, description, completed }
    return parsed.map((s) => ({ title: s.title || "Untitled step", description: s.description || "", completed: false }));
  }

  // Fallback deterministic roadmap
  return fallbackRoadmap(topic, level);
}

/* ==========================
   Controller methods
   ========================== */

exports.generateRoadmap = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { topic } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!topic) return res.status(400).json({ message: "Topic is required" });

    const user = await User.findById(userId).lean();
    const level = (user?.currentLevel) || "beginner";

    const steps = await generateStepsForTopic(topic, level);

    const roadmap = await Roadmap.create({ userId, topic, level, steps });

    return res.status(201).json({ roadmap });
  } catch (err) {
    console.error("❌ generateRoadmap error:", err);
    return res.status(500).json({ message: "Failed to generate roadmap" });
  }
};

exports.getRoadmap = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { topic } = req.query;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!topic) return res.status(400).json({ message: "Topic is required" });

    let roadmap = await Roadmap.findOne({ userId, topic }).lean();
    if (roadmap) return res.json({ roadmap });

    // Generate and persist roadmap
    const user = await User.findById(userId).lean();
    const level = (user?.currentLevel) || "beginner";
    const steps = await generateStepsForTopic(topic, level);

    roadmap = await Roadmap.create({ userId, topic, level, steps });
    return res.status(201).json({ roadmap });
  } catch (err) {
    console.error("❌ getRoadmap error:", err);
    return res.status(500).json({ message: "Failed to get roadmap" });
  }
};

exports.updateStep = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id, index } = req.params;
    const { completed } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const roadmap = await Roadmap.findOne({ _id: id, userId });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

    const idx = Number(index);
    if (Number.isNaN(idx) || idx < 0 || idx >= roadmap.steps.length) {
      return res.status(400).json({ message: "Invalid step index" });
    }

    roadmap.steps[idx].completed = !!completed;
    await roadmap.save();

    return res.json({ roadmap });
  } catch (err) {
    console.error("❌ updateStep error:", err);
    return res.status(500).json({ message: "Failed to update step" });
  }
};

exports.regenerateRoadmap = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const roadmap = await Roadmap.findOne({ _id: id, userId });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

    const steps = await generateStepsForTopic(roadmap.topic, roadmap.level);
    roadmap.steps = steps;
    await roadmap.save();

    return res.json({ roadmap });
  } catch (err) {
    console.error("❌ regenerateRoadmap error:", err);
    return res.status(500).json({ message: "Failed to regenerate roadmap" });
  }
};

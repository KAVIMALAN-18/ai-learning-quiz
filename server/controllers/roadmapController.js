const axios = require("axios");
const { GoogleGenerativeAI } = (() => {
  try {
    return require("@google/generative-ai");
  } catch (e) {
    return {};
  }
})();
const User = require("../models/User");
const Roadmap = require("../models/Roadmap");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL; // optional REST endpoint

function buildPrompt(topic, level) {
  return `Create a ${level}-friendly learning roadmap for "${topic}".\n\nReturn ONLY valid JSON in this format:\n{\n  "steps": [\n    { "title": "Step title", "description": "Short explanation" }\n  ]\n}\n`;
}

async function callGeminiRaw(prompt) {
  // Try SDK first if available
  try {
    if (GoogleGenerativeAI && typeof GoogleGenerativeAI === "function") {
      const client = new GoogleGenerativeAI(GEMINI_API_KEY);
      // Attempt to use the common pattern: getGenerativeModel -> generateContent
      if (typeof client.getGenerativeModel === "function") {
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
        if (model && typeof model.generateContent === "function") {
          const result = await model.generateContent(prompt);
          // result may contain text in multiple shapes; pick the most likely
          if (result?.output?.text) return result.output.text;
          if (result?.response?.text) return result.response.text?.() || result.response.text;
          if (typeof result === "string") return result;
          return JSON.stringify(result);
        }
      }
    }
  } catch (err) {
    console.warn("Gemini SDK call failed, falling back to REST call:", err.message);
  }

  // Fallback: REST call to GEMINI_API_URL if configured
  if (GEMINI_API_URL && GEMINI_API_KEY) {
    try {
      const resp = await axios.post(
        GEMINI_API_URL,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${GEMINI_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 30_000,
        }
      );

      // Try common response shapes
      if (resp?.data) {
        if (typeof resp.data === "string") return resp.data;
        if (resp.data.outputText) return resp.data.outputText;
        if (resp.data.text) return resp.data.text;
        if (Array.isArray(resp.data.choices) && resp.data.choices[0]?.text)
          return resp.data.choices[0].text;
        // Try nested fields
        if (resp.data?.candidates && resp.data.candidates[0]?.content)
          return resp.data.candidates[0].content;
        return JSON.stringify(resp.data);
      }
    } catch (err) {
      console.warn("Gemini REST call failed:", err.message);
    }
  }

  // As last resort return null to indicate no AI result
  return null;
}

function safeParseSteps(text) {
  if (!text || typeof text !== "string") return null;

  // Try to extract a JSON object from text
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonText = text.slice(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed.steps)) return parsed.steps;
    } catch (e) {
      // fallthrough to other parsers
    }
  }

  // Fallback: try to parse lines like "1. Title - Description"
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const steps = [];
  for (const line of lines) {
    // match numbered list '1. Title - description' or '- Title: description'
    const m1 = line.match(/^(?:\d+\.|[-*])\s*(.+?)(?:\s*[:-]\s*(.+))?$/);
    if (m1) {
      steps.push({ title: m1[1].trim(), description: (m1[2] || "").trim() });
      continue;
    }

    // match 'Title - Description'
    const m2 = line.match(/^(.+?)\s+[-–—]\s+(.+)$/);
    if (m2) {
      steps.push({ title: m2[1].trim(), description: m2[2].trim() });
      continue;
    }

    // If short line, treat as title
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

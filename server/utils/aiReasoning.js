const { callGemini } = require('./ai');

/**
 * Analyzes user performance and generates a comprehensive study plan using Gemini.
 * @param {Object} perfData - Detailed user analytics and history
 * @returns {Promise<Object>} Formatted AI output
 */
async function analyzeAndGeneratePlan(perfData) {
  const { currentLevel, goals, history, roadmap } = perfData;

  // Summarize history for the prompt
  const historySummary = history.map(h =>
    `- Quiz on ${h.topic}: Score ${h.score}%, Time: ${Math.round(h.timeSpent / 60)}m, Missed: ${h.missedTopics.join(', ') || 'None'}`
  ).join('\n');

  const roadmapSummary = roadmap.map(r =>
    `- Roadmap "${r.title}": ${Math.round(r.progress)}% complete`
  ).join('\n');

  const prompt = `
    Act as an elite AI Learning Architect. I need to analyze a student's performance and generate a hyper-personalized study mission.

    Student Context:
    - Level: ${currentLevel}
    - Goals: ${goals.join(', ')}
    
    Recent Quiz Performance:
    ${historySummary}

    Active Roadmaps:
    ${roadmapSummary}

    ---
    TASK:
    1. Analyze the performance to detect weak, medium, and strong topics.
    2. Suggest exactly 3-4 "Smart Recommendation Cards" for weak topics.
    3. Generate a structured 7-day Study Plan focusing on the weakest areas.
    4. Provide 3-5 high-quality external resource links (YouTube, Docs, or Articles).

    ---
    FORMAT RULES:
    - Provide ONLY valid JSON.
    - Study plan must have exactly 7 days.
    - Difficulty levels must be Beginner, Intermediate, or Advanced.

    Return JSON structure:
    {
      "weaknessAnalysis": [
        { "topic": "Name", "level": "Beginner", "weaknessScore": 75, "suggestedAction": "Practice/Revise/Watch" }
      ],
      "studyPlan": {
        "durationDays": 7,
        "plan": [
          { 
            "day": 1, 
            "topic": "Specific Topic", 
            "tasks": [
              { "taskType": "Practice", "detail": "Solve 10 problems on Topic X", "resourceLink": "" }
            ] 
          }
        ]
      },
      "resources": [
        { "topic": "Topic Name", "links": [ { "title": "Video title", "url": "URL", "type": "YouTube" } ] }
      ]
    }
  `;

  try {
    const text = await callGemini(prompt);

    // Extract JSON string
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI failed to return valid JSON');

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('❌ AI Reasoning Error:', err);
    return getFallbackPlan(currentLevel, goals);
  }
}

function getFallbackPlan(level, goals) {
  return {
    weaknessAnalysis: [{ topic: goals[0] || "General Learning", level, weaknessScore: 50, suggestedAction: "Basic Review" }],
    studyPlan: {
      durationDays: 7,
      plan: Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        topic: goals[0] || "Foundations",
        tasks: [{ taskType: "Revision", detail: "Focus on fundamentals", resourceLink: "" }]
      }))
    },
    resources: [{ topic: "Learning Foundations", links: [{ title: "Official Documentation", url: "https://docs.microsoft.com", type: "Documentation" }] }]
  };
}

module.exports = { analyzeAndGeneratePlan };

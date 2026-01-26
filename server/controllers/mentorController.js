const MentorSession = require('../models/MentorSession');
const CareerPath = require('../models/CareerPath');
const User = require('../models/User');
const { callGemini } = require('../utils/ai'); // Assuming this helper exists from previous steps

// Helper to construct the system prompt with user context
const buildSystemPrompt = (user, context) => {
    const masteryStr = user.mastery
        ? Array.from(user.mastery.entries()).map(([k, v]) => `${k}: ${v}%`).join(', ')
        : 'No mastery data yet.';

    return `
    You are a friendly, encouraging, and highly technical AI Mentor for a coding platform.
    
    User Context:
    - Name: ${user.name}
    - Proficiency: ${user.currentLevel}
    - Known Skills: ${masteryStr}
    - Current Goal: ${context?.currentGoal || user.learningGoals?.[0] || 'Becoming a developer'}
    
    Your Role:
    1. Answer technical questions clearly but concisely.
    2. Suggest next steps based on their weak areas.
    3. Be motivating but realistic.
    4. Keep responses under 150 words unless asked for a detailed explanation.
    
    Current Interaction:
  `;
};

exports.chatWithMentor = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        // 1. Get User & Session
        const user = await User.findById(userId);
        let session = await MentorSession.findOne({ userId });

        if (!session) {
            session = await MentorSession.create({
                userId,
                messages: [],
                context: { currentGoal: user.learningGoals?.[0] || '' }
            });
        }

        // 2. Add User Message
        session.messages.push({ role: 'user', content: message });

        // 3. Call AI
        const systemPrompt = buildSystemPrompt(user, session.context);
        // Construct history for Gemini (last 10 messages to save tokens)
        const history = session.messages.slice(-10).map(m => `${m.role === 'user' ? 'User' : 'Mentor'}: ${m.content}`).join('\n');
        const finalPrompt = `${systemPrompt}\n\nChat History:\n${history}\n\nMentor:`;

        const responseText = await callGemini(finalPrompt);

        // 4. Update Session
        session.messages.push({ role: 'model', content: responseText });
        session.lastActive = new Date();
        // Optional: simple intent dection to update context could go here
        await session.save();

        res.json({ reply: responseText });
    } catch (err) {
        console.error('Mentor Chat Error:', err);
        res.status(500).json({ message: 'Mentor is taking a break. Try again later.' });
    }
};

exports.generateCareerPath = async (req, res) => {
    try {
        const { targetRole } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);

        const prompt = `
      Act as a Career Counselor. Create a step-by-step roadmap for a ${user.currentLevel} developer 
      who wants to become a "${targetRole}".
      
      User's Current Skills: ${JSON.stringify(user.mastery || {})}
      
      Return a JSON object with this structure (no markdown):
      {
        "readinessScore": 0-100,
        "missingSkills": ["List", "of", "skills"],
        "roadmap": [
          { "title": "Step Name", "description": "Brief description", "status": "pending" }
        ],
        "strongSkills": ["List", "of", "good", "skills"]
      }
    `;

        const aiResponse = await callGemini(prompt);
        // Basic JSON extraction (robustness needed in prod)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const planData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        if (!planData) throw new Error('Failed to parse AI Plan');

        // Save to DB
        const careerPath = await CareerPath.findOneAndUpdate(
            { userId, targetRole },
            {
                roadmap: planData.roadmap,
                readiness: {
                    score: planData.readinessScore,
                    missingSkills: planData.missingSkills,
                    strongSkills: planData.strongSkills
                },
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        res.json({ careerPath });
    } catch (err) {
        console.error('Career Path Error:', err);
        res.status(500).json({ message: 'Failed to generate career path.' });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const session = await MentorSession.findOne({ userId: req.user.id });
        res.json({ messages: session ? session.messages : [] });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch history' });
    }
};

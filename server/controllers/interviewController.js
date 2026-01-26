const InterviewSession = require('../models/InterviewSession');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * START Mock Interview Session
 */
exports.startInterview = async (req, res) => {
    try {
        const { type, topic } = req.body;
        const userId = req.user.id;

        // Use AI to generate 5 initial questions
        const prompt = `Generate 5 professional ${type} interview questions for a candidate specializing in ${topic || 'Software Development'}. Return only as a JSON array of strings.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const questionsArray = JSON.parse(text);

        const session = await InterviewSession.create({
            userId,
            type,
            topic,
            questions: questionsArray.map(q => ({ question: q }))
        });

        res.status(201).json(session);
    } catch (err) {
        res.status(500).json({ message: "Failed to start AI interview: " + err.message });
    }
};

/**
 * SUBMIT Answer and get Feedback
 */
exports.submitAnswer = async (req, res) => {
    try {
        const { sessionId, questionIndex, answer } = req.body;
        const session = await InterviewSession.findById(sessionId);

        if (!session) return res.status(404).json({ message: "Session not found" });

        const questionText = session.questions[questionIndex].question;

        // Get AI feedback for this answer
        const prompt = `
            Question: ${questionText}
            Answer: ${answer}
            ---
            Analyze the answer. Provide:
            1. Feedback (be constructive)
            2. Suggested Improvement
            3. Score (1-10)
            Return as JSON: { "feedback": "...", "improvement": "...", "score": 8 }
        `;

        const result = await model.generateContent(prompt);
        const feedback = JSON.parse(result.response.text());

        session.questions[questionIndex].userAnswer = answer;
        session.questions[questionIndex].aiFeedback = feedback.feedback;
        session.questions[questionIndex].score = feedback.score;

        await session.save();
        res.json(session.questions[questionIndex]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

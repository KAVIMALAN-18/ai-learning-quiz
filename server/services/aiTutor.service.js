const { callGemini } = require('../utils/ai');

/**
 * AI Tutor Service - Personalized Learning Recommendations
 * Uses Gemini AI to analyze user performance and provide guidance
 */

/**
 * Analyze user performance and identify strengths/weaknesses
 */
async function analyzeUserPerformance(userData) {
    try {
        const { quizScores, completedTopics, timeSpent, accuracyHistory } = userData;

        const prompt = `You are an expert learning advisor. Analyze this student's performance data and provide insights:

Quiz Scores: ${JSON.stringify(quizScores.slice(-10))}
Completed Topics: ${completedTopics.length} topics
Total Study Time: ${timeSpent} minutes
Recent Accuracy: ${JSON.stringify(accuracyHistory.slice(-5))}

Provide a JSON response with:
{
  "strengths": ["list of 2-3 strong areas"],
  "weaknesses": ["list of 2-3 areas to improve"],
  "overallLevel": "Beginner/Intermediate/Advanced",
  "insights": "Brief personalized insight (2-3 sentences)"
}

Return ONLY valid JSON, no additional text.`;

        const response = await callGemini(prompt);

        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid AI response format');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error analyzing performance:', error);
        return {
            strengths: ['Consistent learning'],
            weaknesses: ['Need more practice'],
            overallLevel: 'Intermediate',
            insights: 'Keep up the good work! Focus on regular practice to improve.'
        };
    }
}

/**
 * Suggest relevant courses based on user's current progress
 */
async function suggestCourses(userData, availableCourses) {
    try {
        const { completedCourses, quizScores, overallLevel } = userData;

        const prompt = `You are a course recommendation expert. Based on this student's profile, suggest 3-5 relevant courses:

Completed Courses: ${completedCourses.join(', ') || 'None'}
Skill Level: ${overallLevel || 'Beginner'}
Recent Performance: ${quizScores.slice(-3).map(q => `${q.courseName}: ${q.score}%`).join(', ')}

Available Courses:
${availableCourses.map(c => `- ${c.title} (${c.level}, ${c.category})`).join('\n')}

Provide a JSON response with:
{
  "recommendations": [
    {
      "courseId": "course-id",
      "reason": "Why this course is recommended (1 sentence)"
    }
  ]
}

Return ONLY valid JSON, no additional text.`;

        const response = await callGemini(prompt);
        const jsonMatch = response.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            // Fallback: recommend first 3 courses
            return {
                recommendations: availableCourses.slice(0, 3).map(c => ({
                    courseId: c.id,
                    reason: `Great for ${c.level} learners in ${c.category}`
                }))
            };
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error suggesting courses:', error);
        return {
            recommendations: availableCourses.slice(0, 3).map(c => ({
                courseId: c.id,
                reason: `Recommended based on your learning path`
            }))
        };
    }
}

/**
 * Suggest specific topics to focus on
 */
async function suggestTopics(userData) {
    try {
        const { weaknesses, quizScores } = userData;

        const prompt = `You are a learning path advisor. Based on these weak areas, suggest specific topics to study:

Weak Areas: ${weaknesses.join(', ')}
Recent Quiz Performance: ${quizScores.slice(-5).map(q => `${q.courseName}: ${q.accuracy}%`).join(', ')}

Provide a JSON response with:
{
  "topics": [
    {
      "topic": "Topic name",
      "priority": "High/Medium/Low",
      "reason": "Why focus on this (1 sentence)"
    }
  ]
}

Suggest 3-5 topics. Return ONLY valid JSON, no additional text.`;

        const response = await callGemini(prompt);
        const jsonMatch = response.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            return {
                topics: [
                    { topic: 'Review fundamentals', priority: 'High', reason: 'Build strong foundation' },
                    { topic: 'Practice exercises', priority: 'Medium', reason: 'Improve accuracy' }
                ]
            };
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error suggesting topics:', error);
        return {
            topics: [
                { topic: 'Review weak areas', priority: 'High', reason: 'Focus on improvement' }
            ]
        };
    }
}

/**
 * Generate a personalized practice test
 */
async function generatePracticeTest(topic, difficulty = 'Intermediate', questionCount = 5) {
    try {
        const prompt = `You are a quiz generator. Create ${questionCount} multiple-choice questions for:

Topic: ${topic}
Difficulty: ${difficulty}

Provide a JSON response with:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct"
    }
  ]
}

Return ONLY valid JSON, no additional text.`;

        const response = await callGemini(prompt);
        const jsonMatch = response.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error('Invalid response format');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error generating practice test:', error);
        return {
            questions: [
                {
                    question: `Sample question about ${topic}`,
                    options: ['Option A', 'Option B', 'Option C', 'Option D'],
                    correctAnswer: 0,
                    explanation: 'This is a sample question'
                }
            ]
        };
    }
}

/**
 * Create a personalized study plan
 */
async function createStudyPlan(userData, timeAvailable = '1 hour/day') {
    try {
        const { strengths, weaknesses, overallLevel } = userData;

        const prompt = `You are a study plan expert. Create a 7-day personalized study plan:

Student Level: ${overallLevel}
Strengths: ${strengths.join(', ')}
Weaknesses: ${weaknesses.join(', ')}
Available Time: ${timeAvailable}

Provide a JSON response with:
{
  "plan": [
    {
      "day": 1,
      "focus": "Topic to focus on",
      "activities": ["Activity 1", "Activity 2"],
      "duration": "30 mins"
    }
  ],
  "goals": ["Weekly goal 1", "Weekly goal 2"]
}

Create a 7-day plan. Return ONLY valid JSON, no additional text.`;

        const response = await callGemini(prompt);
        const jsonMatch = response.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            return {
                plan: [
                    {
                        day: 1,
                        focus: 'Review fundamentals',
                        activities: ['Watch tutorials', 'Practice exercises'],
                        duration: '1 hour'
                    }
                ],
                goals: ['Complete daily practice', 'Improve accuracy']
            };
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error creating study plan:', error);
        return {
            plan: [],
            goals: ['Stay consistent', 'Practice daily']
        };
    }
}

/**
 * AI Chat - Answer student questions
 */
async function chatWithTutor(question, context = {}) {
    try {
        const prompt = `You are a friendly and knowledgeable learning tutor. Answer this student's question:

Question: ${question}

${context.userLevel ? `Student Level: ${context.userLevel}` : ''}
${context.currentTopic ? `Current Topic: ${context.currentTopic}` : ''}

Provide a helpful, encouraging response. Keep it concise (2-4 sentences). Be supportive and educational.`;

        const response = await callGemini(prompt);
        return response.trim();
    } catch (error) {
        console.error('Error in AI chat:', error);
        return "I'm here to help! Could you please rephrase your question?";
    }
}

module.exports = {
    analyzeUserPerformance,
    suggestCourses,
    suggestTopics,
    generatePracticeTest,
    createStudyPlan,
    chatWithTutor
};

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const aiService = {
    // Analyze user performance
    analyzePerformance: async (performanceData) => {
        const response = await axios.post(`${API_URL}/ai/analyze`, performanceData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Get course recommendations
    getRecommendations: async (userData) => {
        const response = await axios.post(`${API_URL}/ai/recommendations`, userData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Get study plan
    getStudyPlan: async (userData) => {
        const response = await axios.post(`${API_URL}/ai/study-plan`, userData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Generate practice test
    generatePracticeTest: async (testData) => {
        const response = await axios.post(`${API_URL}/ai/practice-test`, testData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Chat with AI tutor
    chat: async (question, context = {}) => {
        const response = await axios.post(`${API_URL}/ai/chat`, { question, context }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Get suggested topics
    getSuggestedTopics: async (userData) => {
        const response = await axios.post(`${API_URL}/ai/topics`, userData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    }
};

export default aiService;

import api from './api.client';

const BASE = '/quiz';

const quizService = {
  // Generate a new quiz (AI-backed)
  generateQuiz: async ({ topic, difficulty, count, timeLimit, options }) => {
    const res = await api.post(`${BASE}/generate`, { topic, difficulty, count, timeLimit, options });
    return res.data;
  },

  // Fetch quiz by id
  getQuiz: async (quizId) => {
    const res = await api.get(`${BASE}/${quizId}`);
    return res.data;
  },

  // Submit answers for grading
  submitQuiz: async (quizId, payload) => {
    const res = await api.post(`${BASE}/${quizId}/submit`, payload);
    return res.data;
  },

  // Fetch result
  getResult: async (quizId) => {
    const res = await api.get(`${BASE}/result/${quizId}`);
    return res.data;
  },

  // Get recent quizzes for the current user
  listRecent: async (limit = 8) => {
    const res = await api.get(`${BASE}/recent?limit=${limit}`);
    return res.data;
  },

  // Get an ongoing quiz for continue feature
  getOngoing: async () => {
    const res = await api.get(`${BASE}/ongoing`);
    return res.data;
  },
};

export default quizService;

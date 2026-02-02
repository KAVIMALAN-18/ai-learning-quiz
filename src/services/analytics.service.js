import apiClient from "./api.client";

const analyticsService = {
    getQuizPerformance: async () => {
        const response = await apiClient.get("/analytics/quiz-performance");
        return response.data;
    },
    getTopicAccuracy: async () => {
        const response = await apiClient.get("/analytics/topic-accuracy");
        return response.data;
    },
    getRoadmapProgress: async () => {
        const response = await apiClient.get("/analytics/roadmap-progress");
        return response.data;
    },
    getStudyTime: async () => {
        const res = await apiClient.get("/analytics/study-time");
        return res.data;
    },
    getDetailedPerformance: async () => {
        const res = await apiClient.get("/analytics/detailed-performance");
        return res.data;
    },
    getProgress: async () => {
        const response = await apiClient.get("/analytics/progress");
        return response.data;
    }
};

export default analyticsService;

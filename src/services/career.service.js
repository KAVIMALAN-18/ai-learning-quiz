import apiClient from "./api.client";

const careerService = {
    // Readiness Metrics
    getMetrics: async () => {
        const res = await apiClient.get("/career/metrics");
        return res.data;
    },

    // Placements
    getPlacements: async () => {
        const res = await apiClient.get("/career/placements");
        return res.data;
    },
    applyToJob: async (data) => {
        const res = await apiClient.post("/career/placements", data);
        return res.data;
    },

    // Certificates
    generateCertificate: async (data) => {
        const res = await apiClient.post("/career/certificates/generate", data);
        return res.data;
    },

    // AI Interviews
    startInterview: async (type, topic) => {
        const res = await apiClient.post("/interview/start", { type, topic });
        return res.data;
    },
    submitInterviewAnswer: async (data) => {
        const res = await apiClient.post("/interview/submit", data);
        return res.data;
    }
};

export default careerService;

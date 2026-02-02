import apiClient from "./api.client";

const courseService = {
    list: async () => {
        const res = await apiClient.get("/courses");
        return res.data;
    },
    getDetails: async (slug) => {
        const res = await apiClient.get(`/courses/${slug}`);
        return res.data;
    },
    getTopic: async (topicId) => {
        const res = await apiClient.get(`/courses/topics/${topicId}`);
        return res.data;
    },
    completeTopic: async (courseId, topicId) => {
        const res = await apiClient.post("/courses/complete-topic", { courseId, topicId });
        return res.data;
    },
    submitTopicTest: async (courseId, topicId, answers) => {
        const res = await apiClient.post("/courses/submit-topic-test", { courseId, topicId, answers });
        return res.data;
    }
};

export default courseService;

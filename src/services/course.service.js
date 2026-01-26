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
    getLesson: async (lessonId) => {
        const res = await apiClient.get(`/courses/lessons/${lessonId}`);
        return res.data;
    },
    completeLesson: async (courseId, lessonId) => {
        const res = await apiClient.post("/courses/complete-lesson", { courseId, lessonId });
        return res.data;
    }
};

export default courseService;

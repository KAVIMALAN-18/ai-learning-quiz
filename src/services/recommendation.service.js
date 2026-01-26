import apiClient from "./api.client";

const recommendationService = {
    /**
     * Get personalized recommendations for the current user
     * @param {boolean} refresh - Force a fresh AI generation
     */
    getRecommendations: async (refresh = false) => {
        const response = await apiClient.get(`/recommendations${refresh ? '?refresh=true' : ''}`);
        return response.data;
    }
};

export default recommendationService;

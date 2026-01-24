import { useState, useEffect } from "react";
import { DASHBOARD_STATS, LEARNING_VELOCITY, RECENT_ASSESSMENTS, ACTIVE_ROADMAP } from "../data/dashboard.mock";

/**
 * Custom hook to fetch and manage Dashboard data.
 * Currently uses mock data but is structured to easily plug in API calls.
 */
export const useDashboardData = () => {
    const [data, setData] = useState({
        stats: [],
        velocity: {},
        recentQuizzes: [],
        roadmap: {},
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real app, replace with:
            // const response = await api.get('/dashboard/stats');
            // setData(response.data);

            setData({
                stats: DASHBOARD_STATS,
                velocity: LEARNING_VELOCITY,
                recentQuizzes: RECENT_ASSESSMENTS,
                roadmap: ACTIVE_ROADMAP,
            });
        } catch (err) {
            setError(err.message || "Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return { ...data, isLoading, error, refresh: fetchDashboardData };
};

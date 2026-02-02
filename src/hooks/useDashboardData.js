import { useState, useEffect, useRef } from "react";
import dashboardService from "../services/dashboard.service";
import quizService from "../services/quiz.service";
import analyticsService from "../services/analytics.service";
import { BookOpen, CheckCircle2, Trophy, Zap } from "lucide-react";

/**
 * Custom hook to fetch and manage Dashboard data.
 * Connects to real backend APIs including new interactive charts.
 */
export const useDashboardData = () => {
    const [data, setData] = useState({
        stats: [],
        velocity: {},
        recentQuizzes: [],
        roadmap: {},
        charts: {
            performance: [],
            topics: [],
            roadmapData: []
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const lastFetchRef = useRef(0);

    const fetchDashboardData = async (force = false) => {
        const now = Date.now();
        // Prevent re-fetching within 1.5 seconds unless forced (resolves StrictMode and re-render noise)
        if (!force && (now - lastFetchRef.current < 1500)) return;
        lastFetchRef.current = now;

        setIsLoading(true);
        setError(null);
        try {
            const [analytics, recent, roadmaps, perf, topics, rProgress] = await Promise.all([
                dashboardService.getAnalyticsOverview(),
                quizService.listRecent(5),
                dashboardService.getRoadmap("JavaScript"),
                analyticsService.getQuizPerformance(),
                analyticsService.getTopicAccuracy(),
                analyticsService.getRoadmapProgress()
            ]);

            // Map Analytics to Stats array
            const stats = [
                {
                    label: "Courses Enrolled",
                    value: analytics.completedCourses || 0,
                    subtext: "Active paths",
                    icon: BookOpen,
                    colorClass: "bg-primary-500"
                },
                {
                    label: "Quizzes Done",
                    value: analytics.totalQuizzes || 0,
                    subtext: "Total attempted",
                    icon: CheckCircle2,
                    colorClass: "bg-success"
                },
                {
                    label: "Avg. Accuracy",
                    value: `${analytics.avgScore || 0}%`,
                    subtext: "Average score",
                    icon: Trophy,
                    colorClass: "bg-warning"
                },
                {
                    label: "Learning Streak",
                    value: `${analytics.streak || 0} Days`,
                    subtext: "Current streak",
                    icon: Zap,
                    colorClass: "bg-primary-600"
                }
            ];

            // Map Recent Quizzes
            const recentQuizzesArr = (recent.quizzes || []).map(q => ({
                id: q._id,
                title: q.quizId?.title || q.quizId?.topic || 'Quiz',
                score: q.score,
                status: q.score >= 60 ? 'Passed' : 'Failed',
                date: new Date(q.submittedAt).toLocaleDateString(),
                duration: `${Math.round(q.timeTaken / 60)} mins`,
                difficulty: q.quizId?.difficulty || 'Intermediate'
            }));

            // Map Roadmap
            const activeRoadmap = roadmaps?.roadmap || (Array.isArray(roadmaps) ? roadmaps[0] : roadmaps);
            const roadmapResult = activeRoadmap ? {
                title: activeRoadmap.topic,
                subtitle: activeRoadmap.level,
                steps: (activeRoadmap.steps || []).slice(0, 3).map(s => ({
                    title: s.title,
                    status: s.completed ? 'completed' : 'active'
                }))
            } : {};

            setData({
                stats,
                velocity: {
                    mastery: analytics.progressPercent || 0,
                    completedModules: analytics.completedSteps || 0,
                    totalModules: analytics.totalSteps || 0,
                    activityData: analytics.activityData || []
                },
                recentQuizzes: recentQuizzesArr,
                roadmap: roadmapResult,
                charts: {
                    performance: perf,
                    topics: topics,
                    roadmapData: rProgress
                }
            });
        } catch (err) {
            console.error("Dashboard error:", err);
            setError(err.response?.data?.message || err.message || "Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return { ...data, isLoading, error, refresh: (force = true) => fetchDashboardData(force) };
};

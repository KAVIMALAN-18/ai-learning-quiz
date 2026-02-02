import React, { createContext, useContext, useState, useEffect } from 'react';
import RecommendationEngine from '../services/recommendation.service';

const ProgressContext = createContext();

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within ProgressProvider');
    }
    return context;
};

const STORAGE_KEY = 'learning_progress';

const initialState = {
    completedCourses: [],
    completedTopics: {},
    quizScores: [],
    accuracyHistory: [],
    timeSpent: 0,
    lastUpdated: new Date().toISOString()
};

export const ProgressProvider = ({ children }) => {
    const [progress, setProgress] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : initialState;
        } catch (error) {
            console.error('Error loading progress:', error);
            return initialState;
        }
    });

    // Persist to localStorage whenever progress changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }, [progress]);

    // Complete a course
    const completeCourse = (courseId) => {
        setProgress(prev => ({
            ...prev,
            completedCourses: [...new Set([...prev.completedCourses, courseId])],
            lastUpdated: new Date().toISOString()
        }));
    };

    // Complete a topic
    const completeTopic = (courseId, topicId) => {
        setProgress(prev => ({
            ...prev,
            completedTopics: {
                ...prev.completedTopics,
                [courseId]: [...new Set([...(prev.completedTopics[courseId] || []), topicId])]
            },
            lastUpdated: new Date().toISOString()
        }));
    };

    // Add quiz score
    const addQuizScore = (quizData) => {
        const { courseId, courseName, score, totalQuestions, correctAnswers, timeTaken } = quizData;

        const newScore = {
            id: Date.now(),
            courseId,
            courseName,
            score,
            totalQuestions,
            correctAnswers,
            accuracy: Math.round((correctAnswers / totalQuestions) * 100),
            timeTaken,
            date: new Date().toISOString()
        };

        setProgress(prev => ({
            ...prev,
            quizScores: [...prev.quizScores, newScore],
            accuracyHistory: [
                ...prev.accuracyHistory,
                {
                    date: new Date().toLocaleDateString(),
                    accuracy: newScore.accuracy,
                    timestamp: Date.now()
                }
            ],
            timeSpent: prev.timeSpent + (timeTaken || 0),
            lastUpdated: new Date().toISOString()
        }));
    };

    // Get course progress percentage
    const getCourseProgress = (courseId, totalTopics) => {
        const completed = progress.completedTopics[courseId]?.length || 0;
        return totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;
    };

    // Get average score
    const getAverageScore = () => {
        if (progress.quizScores.length === 0) return 0;
        const total = progress.quizScores.reduce((sum, quiz) => sum + quiz.score, 0);
        return Math.round(total / progress.quizScores.length);
    };

    // Get average accuracy
    const getAverageAccuracy = () => {
        if (progress.quizScores.length === 0) return 0;
        const total = progress.quizScores.reduce((sum, quiz) => sum + quiz.accuracy, 0);
        return Math.round(total / progress.quizScores.length);
    };

    // Get recent accuracy trend (last 7 entries)
    const getAccuracyTrend = () => {
        return progress.accuracyHistory.slice(-7);
    };

    // Get quiz scores by course
    const getScoresByCourse = () => {
        const scoreMap = {};
        progress.quizScores.forEach(quiz => {
            if (!scoreMap[quiz.courseName]) {
                scoreMap[quiz.courseName] = [];
            }
            scoreMap[quiz.courseName].push(quiz.score);
        });

        return Object.entries(scoreMap).map(([course, scores]) => ({
            course,
            avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            count: scores.length
        }));
    };

    // Reset all progress (for testing)
    const resetProgress = () => {
        setProgress(initialState);
    };

    // Get AI recommendations based on current progress
    const getRecommendations = () => {
        if (progress.quizScores.length === 0) {
            return null;
        }



        const userData = {
            quizResults: progress.quizScores,
            courseProgress: {},
            timeSpent: { total: progress.timeSpent },
            accuracyTrends: progress.accuracyHistory
        };

        return RecommendationEngine.analyzePerformance(userData);
    };

    // Get readiness score for a specific topic
    const getReadinessScore = (topicId) => {
        const recommendations = getRecommendations();
        if (!recommendations || !recommendations.readiness) {
            return null;
        }

        return recommendations.readiness.find(r => r.topic === topicId);
    };

    // Get learning velocity
    const getLearningVelocity = () => {
        const recommendations = getRecommendations();
        return recommendations?.learningVelocity || { velocity: 0, trend: 'neutral', message: 'No data available' };
    };

    // Get consistency metrics
    const getConsistencyMetrics = () => {
        const recommendations = getRecommendations();
        return recommendations?.consistencyScore || { score: 0, level: 'insufficient-data' };
    };

    const value = {
        progress,
        completeCourse,
        completeTopic,
        addQuizScore,
        getCourseProgress,
        getAverageScore,
        getAverageAccuracy,
        getAccuracyTrend,
        getScoresByCourse,
        resetProgress,
        getRecommendations,
        getReadinessScore,
        getLearningVelocity,
        getConsistencyMetrics
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};

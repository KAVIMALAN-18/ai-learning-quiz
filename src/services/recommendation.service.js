/**
 * Smart Learning Recommendation Engine
 * Analyzes user performance and generates personalized learning suggestions
 */

class RecommendationEngine {
    /**
     * Analyze user performance data and generate comprehensive recommendations
     */
    static analyzePerformance(userData) {
        const {
            quizResults = [],
            courseProgress = {},
            timeSpent = {},
            accuracyTrends = []
        } = userData;

        const weakAreas = this.detectWeakAreas(quizResults, accuracyTrends);
        const strongAreas = this.detectStrongAreas(quizResults, accuracyTrends);
        const learningGaps = this.findLearningGaps(courseProgress);
        const consistencyScore = this.calculateConsistency(timeSpent, quizResults);
        const learningVelocity = this.calculateLearningVelocity(quizResults, accuracyTrends);
        const timeTrends = this.getTimeTrends(quizResults);
        const readiness = this.detectTopicReadiness(quizResults, strongAreas);
        const learningPath = this.generateLearningPath(weakAreas, strongAreas, courseProgress);

        return {
            weakAreas,
            strongAreas,
            learningGaps,
            consistencyScore,
            learningVelocity,
            timeTrends,
            readiness,
            learningPath,
            recommendations: this.generateRecommendations({
                weakAreas,
                strongAreas,
                learningGaps,
                consistencyScore,
                courseProgress,
                learningVelocity,
                readiness
            })
        };
    }

    /**
     * Detect weak areas based on quiz performance
     */
    static detectWeakAreas(quizResults, accuracyTrends) {
        const topicScores = {};

        // Aggregate scores by topic
        quizResults.forEach(result => {
            const topic = result.topic || result.courseName;
            if (!topicScores[topic]) {
                topicScores[topic] = { scores: [], count: 0 };
            }
            topicScores[topic].scores.push(result.score || result.accuracy);
            topicScores[topic].count++;
        });

        // Calculate average and identify weak areas (< 70%)
        const weakAreas = [];
        Object.entries(topicScores).forEach(([topic, data]) => {
            const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.count;
            if (avgScore < 70) {
                weakAreas.push({
                    topic,
                    avgScore: Math.round(avgScore),
                    attempts: data.count,
                    severity: avgScore < 50 ? 'high' : avgScore < 60 ? 'medium' : 'low'
                });
            }
        });

        return weakAreas.sort((a, b) => a.avgScore - b.avgScore);
    }

    /**
     * Detect strong areas based on quiz performance
     */
    static detectStrongAreas(quizResults, accuracyTrends) {
        const topicScores = {};

        quizResults.forEach(result => {
            const topic = result.topic || result.courseName;
            if (!topicScores[topic]) {
                topicScores[topic] = { scores: [], count: 0 };
            }
            topicScores[topic].scores.push(result.score || result.accuracy);
            topicScores[topic].count++;
        });

        // Identify strong areas (>= 85%)
        const strongAreas = [];
        Object.entries(topicScores).forEach(([topic, data]) => {
            const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.count;
            if (avgScore >= 85) {
                strongAreas.push({
                    topic,
                    avgScore: Math.round(avgScore),
                    attempts: data.count,
                    level: avgScore >= 95 ? 'expert' : avgScore >= 90 ? 'advanced' : 'proficient'
                });
            }
        });

        return strongAreas.sort((a, b) => b.avgScore - a.avgScore);
    }

    /**
     * Find learning gaps in course progression
     */
    static findLearningGaps(courseProgress) {
        const gaps = [];

        Object.entries(courseProgress).forEach(([course, progress]) => {
            if (progress.completed < progress.total) {
                const completionRate = (progress.completed / progress.total) * 100;
                if (completionRate < 50) {
                    gaps.push({
                        course,
                        completionRate: Math.round(completionRate),
                        remaining: progress.total - progress.completed,
                        priority: completionRate < 25 ? 'high' : 'medium'
                    });
                }
            }
        });

        return gaps.sort((a, b) => a.completionRate - b.completionRate);
    }

    /**
     * Calculate learning consistency score
     */
    static calculateConsistency(timeSpent, quizResults) {
        if (quizResults.length < 3) {
            return { score: 0, level: 'insufficient-data' };
        }

        // Check if user is taking quizzes regularly
        const dates = quizResults.map(r => new Date(r.date || r.timestamp));
        const daysBetween = [];

        for (let i = 1; i < dates.length; i++) {
            const diff = Math.abs(dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
            daysBetween.push(diff);
        }

        const avgDaysBetween = daysBetween.reduce((a, b) => a + b, 0) / daysBetween.length;

        let consistencyScore = 100;
        if (avgDaysBetween > 7) consistencyScore = 40;
        else if (avgDaysBetween > 3) consistencyScore = 70;
        else if (avgDaysBetween <= 1) consistencyScore = 100;

        return {
            score: Math.round(consistencyScore),
            level: consistencyScore >= 80 ? 'excellent' : consistencyScore >= 60 ? 'good' : 'needs-improvement',
            avgDaysBetween: Math.round(avgDaysBetween)
        };
    }

    /**
     * Generate personalized recommendations
     */
    static generateRecommendations({ weakAreas, strongAreas, learningGaps, consistencyScore, courseProgress }) {
        const recommendations = [];

        // Revise weak topics
        if (weakAreas.length > 0) {
            const criticalTopics = weakAreas.filter(w => w.severity === 'high');
            if (criticalTopics.length > 0) {
                recommendations.push({
                    type: 'revise',
                    priority: 'high',
                    title: 'Revise These Topics',
                    description: `Focus on improving ${criticalTopics.length} critical topic${criticalTopics.length > 1 ? 's' : ''} where you scored below 50%`,
                    topics: criticalTopics.map(t => t.topic),
                    action: 'Review fundamentals and practice more exercises'
                });
            } else {
                recommendations.push({
                    type: 'revise',
                    priority: 'medium',
                    title: 'Practice More Here',
                    description: `Strengthen your understanding in ${weakAreas.length} topic${weakAreas.length > 1 ? 's' : ''}`,
                    topics: weakAreas.map(t => t.topic),
                    action: 'Take additional quizzes and review concepts'
                });
            }
        }

        // Ready for advanced level
        if (strongAreas.length >= 3) {
            const expertTopics = strongAreas.filter(s => s.level === 'expert');
            if (expertTopics.length > 0) {
                recommendations.push({
                    type: 'advance',
                    priority: 'high',
                    title: 'Ready for Advanced Level',
                    description: `You've mastered ${expertTopics.length} topic${expertTopics.length > 1 ? 's' : ''}. Time to level up!`,
                    topics: expertTopics.map(t => t.topic),
                    action: 'Explore advanced courses and challenging projects'
                });
            }
        }

        // Complete unfinished courses
        if (learningGaps.length > 0) {
            const highPriorityGaps = learningGaps.filter(g => g.priority === 'high');
            if (highPriorityGaps.length > 0) {
                recommendations.push({
                    type: 'complete',
                    priority: 'medium',
                    title: 'Complete Started Courses',
                    description: `You have ${highPriorityGaps.length} course${highPriorityGaps.length > 1 ? 's' : ''} with less than 25% completion`,
                    topics: highPriorityGaps.map(g => g.course),
                    action: 'Dedicate time to finish what you started'
                });
            }
        }

        // Consistency improvement
        if (consistencyScore.level === 'needs-improvement') {
            recommendations.push({
                type: 'consistency',
                priority: 'low',
                title: 'Improve Learning Consistency',
                description: `You're taking quizzes every ${consistencyScore.avgDaysBetween} days on average`,
                action: 'Try to practice daily or every other day for better retention'
            });
        }

        // Suggested next course
        if (strongAreas.length > 0 && weakAreas.length === 0) {
            recommendations.push({
                type: 'next-course',
                priority: 'high',
                title: 'Suggested Next Course',
                description: 'Based on your strong performance, here are recommended next steps',
                action: 'Explore related advanced topics or new domains'
            });
        }

        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    /**
     * Calculate learning velocity - improvement rate over time
     */
    static calculateLearningVelocity(quizResults, accuracyTrends) {
        if (quizResults.length < 2) {
            return { velocity: 0, trend: 'neutral', message: 'Need more data to calculate velocity' };
        }

        // Compare first half vs second half of quiz results
        const midpoint = Math.floor(quizResults.length / 2);
        const firstHalf = quizResults.slice(0, midpoint);
        const secondHalf = quizResults.slice(midpoint);

        const firstAvg = firstHalf.reduce((sum, q) => sum + (q.score || q.accuracy || 0), 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, q) => sum + (q.score || q.accuracy || 0), 0) / secondHalf.length;

        const improvement = secondAvg - firstAvg;
        const velocity = Math.round(improvement);

        let trend = 'neutral';
        let message = '';

        if (improvement > 10) {
            trend = 'accelerating';
            message = 'Your performance is improving rapidly! Keep up the great work.';
        } else if (improvement > 0) {
            trend = 'improving';
            message = 'You are making steady progress. Stay consistent!';
        } else if (improvement < -10) {
            trend = 'declining';
            message = 'Performance has declined. Consider reviewing fundamentals.';
        } else {
            trend = 'stable';
            message = 'Performance is stable. Try challenging yourself with harder topics.';
        }

        return { velocity, trend, message, firstAvg: Math.round(firstAvg), secondAvg: Math.round(secondAvg) };
    }

    /**
     * Detect topic readiness - determine if user is ready for advanced topics
     */
    static detectTopicReadiness(quizResults, strongAreas) {
        const readinessLevels = [];

        strongAreas.forEach(area => {
            const topicQuizzes = quizResults.filter(q =>
                (q.topic || q.courseName) === area.topic
            );

            if (topicQuizzes.length === 0) return;

            // Calculate criteria for readiness
            const avgScore = area.avgScore;
            const consistency = topicQuizzes.filter(q => (q.score || q.accuracy) >= 80).length / topicQuizzes.length;
            const attempts = area.attempts;

            let readinessScore = 0;
            let level = 'novice';
            let requirements = [];

            // Score calculation
            if (avgScore >= 90) readinessScore += 40;
            else if (avgScore >= 80) readinessScore += 30;
            else if (avgScore >= 70) readinessScore += 20;

            if (consistency >= 0.8) readinessScore += 30;
            else if (consistency >= 0.6) readinessScore += 20;

            if (attempts >= 5) readinessScore += 30;
            else if (attempts >= 3) readinessScore += 20;
            else if (attempts >= 2) readinessScore += 10;

            // Determine level
            if (readinessScore >= 85) {
                level = 'expert';
                requirements = ['Maintain performance', 'Explore advanced topics'];
            } else if (readinessScore >= 70) {
                level = 'ready';
                requirements = ['Take one more advanced quiz', 'Achieve 85%+ consistently'];
            } else if (readinessScore >= 50) {
                level = 'almost';
                requirements = ['Practice more', 'Improve consistency'];
            } else {
                level = 'novice';
                requirements = ['Build foundation', 'Complete more quizzes'];
            }

            readinessLevels.push({
                topic: area.topic,
                readinessScore: Math.round(readinessScore),
                level,
                avgScore,
                consistency: Math.round(consistency * 100),
                attempts,
                requirements
            });
        });

        return readinessLevels;
    }

    /**
     * Get time-based trends - analyze when user studies most effectively
     */
    static getTimeTrends(quizResults) {
        if (quizResults.length < 3) {
            return { bestTime: null, pattern: 'insufficient-data', message: 'Take more quizzes to identify patterns' };
        }

        const timeOfDay = { morning: 0, afternoon: 0, evening: 0, night: 0 };
        const dayOfWeek = { weekday: 0, weekend: 0 };
        const performanceByTime = { morning: [], afternoon: [], evening: [], night: [] };

        quizResults.forEach(quiz => {
            const date = new Date(quiz.date || quiz.timestamp);
            const hour = date.getHours();
            const day = date.getDay();
            const score = quiz.score || quiz.accuracy || 0;

            // Time of day categorization
            let timeCategory = 'evening';
            if (hour >= 5 && hour < 12) {
                timeCategory = 'morning';
            } else if (hour >= 12 && hour < 17) {
                timeCategory = 'afternoon';
            } else if (hour >= 17 && hour < 21) {
                timeCategory = 'evening';
            } else {
                timeCategory = 'night';
            }

            timeOfDay[timeCategory]++;
            performanceByTime[timeCategory].push(score);

            // Day of week
            if (day === 0 || day === 6) {
                dayOfWeek.weekend++;
            } else {
                dayOfWeek.weekday++;
            }
        });

        // Find best performing time
        let bestTime = 'evening';
        let bestAvg = 0;

        Object.keys(performanceByTime).forEach(time => {
            if (performanceByTime[time].length > 0) {
                const avg = performanceByTime[time].reduce((a, b) => a + b, 0) / performanceByTime[time].length;
                if (avg > bestAvg) {
                    bestAvg = avg;
                    bestTime = time;
                }
            }
        });

        const preferredDay = dayOfWeek.weekday >= dayOfWeek.weekend ? 'weekdays' : 'weekends';

        return {
            bestTime,
            bestTimeScore: Math.round(bestAvg),
            preferredDay,
            pattern: 'identified',
            message: `You perform best during ${bestTime} on ${preferredDay}`,
            distribution: timeOfDay
        };
    }

    /**
     * Generate personalized learning path
     */
    static generateLearningPath(weakAreas, strongAreas, _courseProgress) {
        const path = [];

        // Step 1: Address critical weak areas first
        const criticalWeak = weakAreas.filter(w => w.severity === 'high');
        if (criticalWeak.length > 0) {
            path.push({
                phase: 'Foundation',
                priority: 1,
                focus: 'Strengthen Weak Areas',
                topics: criticalWeak.map(w => w.topic),
                estimatedWeeks: Math.ceil(criticalWeak.length * 0.5),
                actions: [
                    'Review fundamental concepts',
                    'Complete practice exercises',
                    'Take assessment quizzes'
                ]
            });
        }

        // Step 2: Improve moderate weak areas
        const moderateWeak = weakAreas.filter(w => w.severity === 'medium' || w.severity === 'low');
        if (moderateWeak.length > 0) {
            path.push({
                phase: 'Improvement',
                priority: 2,
                focus: 'Build Confidence',
                topics: moderateWeak.map(w => w.topic),
                estimatedWeeks: Math.ceil(moderateWeak.length * 0.3),
                actions: [
                    'Practice regularly',
                    'Apply concepts in projects',
                    'Retake quizzes for mastery'
                ]
            });
        }

        // Step 3: Level up strong areas
        if (strongAreas.length >= 2) {
            path.push({
                phase: 'Advancement',
                priority: 3,
                focus: 'Master Advanced Topics',
                topics: strongAreas.slice(0, 3).map(s => `Advanced ${s.topic}`),
                estimatedWeeks: 2,
                actions: [
                    'Explore advanced concepts',
                    'Build complex projects',
                    'Teach others or create content'
                ]
            });
        }

        // Step 4: New topics exploration
        path.push({
            phase: 'Exploration',
            priority: 4,
            focus: 'Expand Knowledge',
            topics: ['New related topics', 'Complementary skills'],
            estimatedWeeks: 3,
            actions: [
                'Explore new domains',
                'Take beginner courses',
                'Build diverse projects'
            ]
        });

        return path;
    }
}

export default RecommendationEngine;

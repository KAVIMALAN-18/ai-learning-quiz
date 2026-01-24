import {
    BookOpen,
    CheckCircle2,
    Trophy,
    Zap,
    Target
} from "lucide-react";

export const DASHBOARD_STATS = [
    {
        label: "Courses Enrolled",
        value: "4",
        subtext: "2 active path",
        icon: BookOpen,
        colorClass: "bg-primary-500"
    },
    {
        label: "Quizzes Done",
        value: "12",
        subtext: "+3 this week",
        icon: CheckCircle2,
        colorClass: "bg-success"
    },
    {
        label: "Avg. Accuracy",
        value: "78%",
        subtext: "Top 15% rank",
        icon: Trophy,
        colorClass: "bg-warning"
    },
    {
        label: "Learning Streak",
        value: "5 Days",
        subtext: "Goal: 10 days",
        icon: Zap,
        colorClass: "bg-primary-600"
    }
];

export const LEARNING_VELOCITY = {
    mastery: 62,
    completedModules: 8,
    totalModules: 14,
    activityData: [40, 70, 30, 85, 50, 20, 10]
};

export const RECENT_ASSESSMENTS = [
    {
        id: 1,
        title: 'React Hooks Mastery',
        score: 92,
        status: 'Passed',
        date: '2 hours ago',
        duration: '15 mins',
        iconType: 'trophy',
        difficulty: 'Intermediate'
    },
    {
        id: 2,
        title: 'Advanced CSS Grid',
        score: 65,
        status: 'Failed',
        date: '1 day ago',
        duration: '12 mins',
        iconType: 'target',
        difficulty: 'Advanced'
    },
    {
        id: 3,
        title: 'Node.js Async Patterns',
        score: 88,
        status: 'Passed',
        date: '3 days ago',
        duration: '20 mins',
        iconType: 'trophy',
        difficulty: 'Intermediate'
    },
];

export const ACTIVE_ROADMAP = {
    title: "Frontend Mastery",
    subtitle: "Advanced React Architectures",
    steps: [
        { title: 'Custom Hooks', status: 'completed' },
        { title: 'Context API', status: 'active' },
        { title: 'Performance', status: 'locked' }
    ]
};

export const ANALYTICS_SUMMARY = {
    avgScore: 78,
    quizzesTaken: 12,
    weeklyEngagement: 5,
    activityTrends: "+12% vs last wk"
};

export const PROGRESS_KPIs = {
    totalAssessments: 12,
    successRate: 100
};

import React from 'react';
import { BookOpen, CheckCircle2, Trophy, Zap } from 'lucide-react';
import StatCard from '../ui/StatCard';

export default function DashboardSummaryCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                label="Courses Enrolled"
                value="4"
                subtext="2 in progress"
                icon={BookOpen}
                color="bg-blue-500"
            />
            <StatCard
                label="Quizzes Completed"
                value="12"
                subtext="+3 this week"
                icon={CheckCircle2}
                color="bg-emerald-500"
            />
            <StatCard
                label="Average Score"
                value="78%"
                subtext="Top 15% of students"
                icon={Trophy}
                color="bg-amber-500"
            />
            <StatCard
                label="Learning Streak"
                value="5 Days"
                subtext="Keep it up!"
                icon={Zap}
                color="bg-indigo-500"
            />
        </div>
    );
}

import React from 'react';
import { Target, Trophy, Clock, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Label, Title } from '../ui/Typography';

export function AnalyticsKpiCards({ stats }) {
    const kpis = [
        {
            label: 'Learning Progress',
            value: `${stats.completionPercentage || 0}%`,
            sub: 'Course Completion',
            icon: Target,
            color: 'bg-primary-600',
            shadow: 'shadow-primary-600/20'
        },
        {
            label: 'Performance',
            value: `${stats.averageScore || 0}%`,
            sub: 'Average Score',
            icon: Trophy,
            color: 'bg-indigo-600',
            shadow: 'shadow-indigo-600/20'
        },
        {
            label: 'Knowledge Checks',
            value: stats.totalQuizzesTaken || 0,
            sub: 'Quizzes Taken',
            icon: Zap,
            color: 'bg-amber-500',
            shadow: 'shadow-amber-500/20'
        },
        {
            label: 'Time Invested',
            value: Math.round((stats.totalTimeSpent || 0) / 60),
            sub: 'Total Minutes',
            icon: Clock,
            color: 'bg-slate-900',
            shadow: 'shadow-slate-900/20'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {kpis.map((kpi, idx) => (
                <Card key={idx} className="p-8 border-none bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 ${kpi.color} rounded-2xl flex items-center justify-center text-white shadow-2xl ${kpi.shadow}`}>
                            <kpi.icon size={28} />
                        </div>
                        <div className="text-right">
                            <Label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black block mb-1">{kpi.label}</Label>
                            <div className="text-3xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.sub}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}

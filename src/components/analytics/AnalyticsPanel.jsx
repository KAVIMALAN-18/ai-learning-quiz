import React, { useMemo } from 'react';
import StatCard from './StatCard';
import InsightsPanel from './InsightsPanel';

// Mock analytics generator (defensive)
const useMockAnalytics = (user) => {
  return useMemo(() => {
    const total = 14;
    const scores = [60, 65, 70, 75, 80, 82, 85, 88];
    const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return {
      totalAttempts: total,
      avgScore: average,
      bestScore: Math.max(...scores),
      improvement: scores.length >= 2 ? Math.round(((scores[scores.length - 1] - scores[scores.length - 2]) / scores[scores.length - 2]) * 100) : 0,
      trend: scores,
      strengths: [
        { topic: 'JavaScript Basics', note: 'Solid foundation in variables, control flow.' },
        { topic: 'HTML & CSS', note: 'Good structure and semantics.' },
      ],
      needs: [
        { topic: 'Async & Promises', note: 'Practice Promises, async/await and error handling.' },
        { topic: 'Advanced Array Methods', note: 'Focus on map/reduce/filter in complex use-cases.' },
      ],
    };
  }, [user]);
};

export default function AnalyticsPanel({ user }) {
  const data = useMockAnalytics(user);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
          <StatCard label="Quizzes Attempted" value={data.totalAttempts} hint="Total successful attempts" />
          <StatCard label="Average Score" value={`${data.avgScore}%`} percent={data.avgScore} hint="Across your recent sessions" />
          <StatCard label="Best Performance" value={`${data.bestScore}%`} hint="Your all-time high score" />
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Growth Index</div>
              <div className="text-2xl font-extrabold text-emerald-600">+{data.improvement}% <span className="text-sm font-medium text-slate-400 font-sans">vs previous period</span></div>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Keep maintaining your steady practice schedule to ensure continuous skill improvement.</p>
        </div>
      </div>

      <InsightsPanel strengths={data.strengths} needs={data.needs} />
    </div>
  );
}

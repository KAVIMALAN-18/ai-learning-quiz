import React, { useMemo } from 'react';
import StatCard from './StatCard';
import TrendSparkline from './TrendSparkline';
import InsightsPanel from './InsightsPanel';

// Mock analytics generator (defensive)
const useMockAnalytics = (user) => {
  return useMemo(() => {
    const total = 14;
    const scores = [60, 65, 70, 75, 80, 82, 85, 88];
    const average = Math.round(scores.reduce((a,b) => a+b,0)/scores.length);
    return {
      totalAttempts: total,
      avgScore: average,
      bestScore: Math.max(...scores),
      improvement: scores.length >= 2 ? Math.round(((scores[scores.length-1] - scores[scores.length-2])/scores[scores.length-2])*100) : 0,
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
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Quizzes Attempted" value={data.totalAttempts} hint="Total attempts" />
          <StatCard label="Average Score" value={`${data.avgScore}%`} percent={data.avgScore} hint="Across recent quizzes" />
          <StatCard label="Best Score" value={`${data.bestScore}%`} hint="Top performance" />
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Improvement</div>
              <div className="text-lg font-semibold">{data.improvement}% vs previous</div>
            </div>
            <div>
              <TrendSparkline data={data.trend} />
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">Keep a steady practice schedule to continue improving.</div>
        </div>
      </div>

      <InsightsPanel strengths={data.strengths} needs={data.needs} />
    </div>
  );
}

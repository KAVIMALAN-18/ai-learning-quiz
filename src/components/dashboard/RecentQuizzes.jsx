import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Target } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function RecentQuizzes() {
    const navigate = useNavigate();

    // Mock Data
    const recentQuizzes = [
        { id: 1, title: 'React Hooks Mastery', score: 92, status: 'Passed', date: '2 hours ago' },
        { id: 2, title: 'Advanced CSS Grid', score: 65, status: 'Failed', date: '1 day ago' },
        { id: 3, title: 'Node.js Async Patterns', score: 88, status: 'Passed', date: '3 days ago' },
    ];

    return (
        <Card className="overflow-hidden" noPadding>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg">Recent Quizzes</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/quizzes")}>View All Quizzes</Button>
            </div>
            <div className="divide-y divide-slate-50">
                {recentQuizzes.map((quiz) => (
                    <div key={quiz.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 p-2 rounded-lg ${quiz.status === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {quiz.status === 'Passed' ? <CheckCircle2 size={18} /> : <Target size={18} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{quiz.title}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{quiz.date} • {quiz.time || '15 mins'}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-lg font-bold ${quiz.score >= 80 ? 'text-emerald-600' : quiz.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                {quiz.score}%
                            </div>
                            <div className={`text-xs font-bold uppercase tracking-wider ${quiz.status === 'Passed' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {quiz.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

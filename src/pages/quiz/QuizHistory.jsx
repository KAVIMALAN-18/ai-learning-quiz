import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import {
    History,
    Search,
    Filter,
    Calendar,
    Clock,
    Target,
    CheckCircle2,
    XCircle,
    ChevronRight,
    ArrowUpDown,
    Trophy
} from 'lucide-react';

export default function QuizHistory() {
    const navigate = useNavigate();
    const [filterTopic, setFilterTopic] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortOrder, setSortOrder] = useState('date'); // 'date' | 'score'

    const [attempts, setAttempts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                // The backend returns an array of attempts with basic info
                // We might need to fetch more details if we want topic names, etc.
                // But the backend route already maps some fields.
                const data = await quizService.getHistory();
                // Map backend response to UI structure
                const mapped = (data.attempts || []).map(a => ({
                    id: a.attemptId,
                    title: a.title || 'Untitled Quiz',
                    topic: a.title || 'General', // Backend might not send topic separately
                    date: a.submittedAt,
                    score: a.score,
                    total: 100, // Score is usually percentage or total marks
                    time: 0, // Backend might not send this in history route
                    status: a.score >= 60 ? 'pass' : 'fail'
                }));
                setAttempts(mapped);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load history");
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Filtering & Sorting
    const filteredAttempts = attempts.filter(a => {
        const matchTopic = filterTopic === 'All' || a.topic === filterTopic;
        const matchStatus = filterStatus === 'All' || a.status === filterStatus;
        return matchTopic && matchStatus;
    }).sort((a, b) => {
        if (sortOrder === 'date') return new Date(b.date) - new Date(a.date);
        if (sortOrder === 'score') return b.score - a.score;
        return 0;
    });

    const getStatusColor = (status) => {
        return status === 'pass'
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-rose-100 text-rose-700 border-rose-200';
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <LoadingSpinner />
                <p className="mt-4 text-slate-500 font-medium">Loading your quiz history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-6">
                <ErrorState
                    title="History Unavailable"
                    message={error}
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-fade-in font-sans">

            {/* 1. Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-8 border-b border-slate-200 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <History className="text-indigo-600" size={32} /> My Quiz History
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Track your progress and analyze your performance over time.</p>
                </div>
                <div className="flex gap-3">
                    <Card className="px-4 py-2 flex items-center gap-3 bg-indigo-50 border-indigo-100">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <Trophy size={18} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-indigo-600 uppercase">Avg. Score</div>
                            <div className="text-lg font-black text-indigo-900">72%</div>
                        </div>
                    </Card>
                    <Card className="px-4 py-2 flex items-center gap-3 bg-emerald-50 border-emerald-100">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-emerald-600 uppercase">Passed</div>
                            <div className="text-lg font-black text-emerald-900">14</div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* 2. Filters & Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
                    <Filter size={18} className="text-slate-400 mr-2" />
                    {['All', 'React', 'JavaScript', 'Node.js', 'CSS'].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilterTopic(t)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filterTopic === t ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    >
                        <option value="All">All Status</option>
                        <option value="pass">Passed</option>
                        <option value="fail">Failed</option>
                    </select>

                    <button
                        onClick={() => setSortOrder(sortOrder === 'date' ? 'score' : 'date')}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        <ArrowUpDown size={14} />
                        {sortOrder === 'date' ? 'Date' : 'Score'}
                    </button>
                </div>
            </div>

            {/* 3. Quiz Attempts List */}
            <div className="space-y-4">
                {filteredAttempts.length > 0 ? (
                    filteredAttempts.map((attempt) => (
                        <Card
                            key={attempt.id}
                            className={`p-4 md:p-6 transition-all duration-200 group relative overflow-hidden border-l-0 ${attempt.status === 'pass' ? 'hover:border-emerald-200' : 'hover:border-rose-200'
                                }`}
                        >
                            {/* Status Indicator Strip */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${attempt.status === 'pass' ? 'bg-emerald-400' : 'bg-rose-400'}`} />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-2">

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(attempt.status)}`}>
                                            {attempt.status}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(attempt.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {attempt.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium">{attempt.topic}</p>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6 md:gap-12">
                                    <div className="text-center">
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Score</div>
                                        <div className="font-black text-xl text-slate-800">
                                            {attempt.score}<span className="text-sm text-slate-400 font-medium">/{attempt.total}</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Accuracy</div>
                                        <div className={`font-black text-xl ${attempt.status === 'pass' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {Math.round((attempt.score / attempt.total) * 100)}%
                                        </div>
                                    </div>
                                    <div className="text-center hidden sm:block">
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Time</div>
                                        <div className="font-bold text-slate-700 flex items-center justify-center gap-1">
                                            <Clock size={14} className="text-slate-400" /> {formatTime(attempt.time)}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                                    <Button
                                        variant="ghost"
                                        className="text-slate-500 hover:text-indigo-600"
                                        onClick={() => navigate('/dashboard/quizzes/start')}
                                    >
                                        Retry
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200"
                                        onClick={() => navigate(`/dashboard/quizzes/result/${attempt.id}`)} // In real app use attempt ID
                                    >
                                        View Result <ChevronRight size={16} className="ml-1" />
                                    </Button>
                                </div>

                            </div>
                        </Card>
                    ))
                ) : (
                    /* Empty State */
                    <div className="text-center py-24 bg-white border border-dashed border-slate-200 rounded-2xl">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <History size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No attempts found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8">
                            {filterTopic !== 'All'
                                ? `You haven't taken any ${filterTopic} quizzes yet.`
                                : "You haven't taken any quizzes yet. Start learning today!"}
                        </p>
                        <Button size="lg" onClick={() => navigate('/dashboard/quizzes')} className="shadow-xl shadow-indigo-500/20">
                            Start Your First Quiz
                        </Button>
                    </div>
                )}
            </div>

        </div>
    );
}

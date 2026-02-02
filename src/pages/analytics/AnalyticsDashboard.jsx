import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Filter, Calendar, Download, RefreshCcw } from 'lucide-react';
import analyticsService from '../../services/analytics.service';
import { AnalyticsKpiCards } from '../../components/analytics/AnalyticsKpiCards';
import { ScoreTrendChart, CourseComparisonChart } from '../../components/analytics/PerformanceCharts';
import { TopicMastery } from '../../components/analytics/TopicMastery';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

export default function AnalyticsDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const performanceData = await analyticsService.getDetailedPerformance();
            setData(performanceData);
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
            setError("Unable to load performance metrics at this time.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchAnalytics();
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading && !refreshing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <LoadingSpinner size={48} />
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Processing your performance data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-20">
                <ErrorState
                    title="Analysis Failed"
                    message={error}
                    onRetry={fetchAnalytics}
                />
            </Container>
        );
    }

    const hasActivity = data && data.overallStats?.totalQuizzesTaken > 0;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white border-b border-slate-100 sticky top-0 z-30 px-8 py-6">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-600/20">
                            <BarChart3 size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 px-2 py-0.5 bg-primary-50 rounded-md">Growth Engine</span>
                                <span className="text-slate-300">/</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Intelligence</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Performance Analytics</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl mr-2">
                            <button className="px-4 py-2 bg-white text-slate-900 shadow-sm rounded-lg text-[10px] font-black uppercase tracking-widest">7 Days</button>
                            <button className="px-4 py-2 text-slate-400 hover:text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">30 Days</button>
                        </div>
                        <Button
                            variant="secondary"
                            className="bg-white border-slate-100 hover:bg-slate-50 p-3 rounded-xl shadow-sm text-slate-500"
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            <RefreshCcw size={18} className={refreshing ? 'animate-spin' : ''} />
                        </Button>
                        <Button variant="primary" className="px-6 py-3 font-black shadow-premium flex items-center gap-2">
                            <Download size={18} />
                            <span className="hidden sm:inline">EXPORT REPORT</span>
                        </Button>
                    </div>
                </div>
            </header>

            <Container className="mt-12 space-y-12">
                {!hasActivity ? (
                    <div className="py-20 animate-fade-in">
                        <EmptyState
                            icon={TrendingUp}
                            title="No Analytics Data Yet"
                            description="Complete your first roadmap topic and quiz to unlock real-time performance insights and AI-driven skill mapping."
                            actionText="BROWSE COURSES"
                            onAction={() => window.location.href = '/dashboard/roadmap'}
                        />
                    </div>
                ) : (
                    <div className="animate-fade-in space-y-12">
                        {/* KPI Cards */}
                        <AnalyticsKpiCards stats={data.overallStats} />

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <ScoreTrendChart data={data.performanceHistory} />
                            <CourseComparisonChart data={data.coursePerformance} />
                        </div>

                        {/* Mastery Section */}
                        <TopicMastery
                            topics={data.topicMastery}
                            suggestions={data.suggestions}
                        />
                    </div>
                )}
            </Container>
        </div>
    );
}

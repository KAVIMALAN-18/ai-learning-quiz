import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    TrendingUp,
    Target,
    BookOpen,
    PlayCircle,
    RefreshCw,
    Calendar,
    CheckCircle2,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import recommendationService from '../../services/recommendation.service';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Title, SectionHeader, BodyText, Label, MetaText } from '../../components/ui/Typography';
import Container from '../../components/ui/Container';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import { AccuracyBar } from '../../components/ui/Analytics';
import PerformanceChart from '../../components/analytics/PerformanceChart';

export default function RecommendationPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRecommendations = async (forceRefresh = false) => {
        try {
            if (forceRefresh) setRefreshing(true);
            else setLoading(true);

            setError(null);
            const res = await recommendationService.getRecommendations(forceRefresh);
            setData(res.recommendations);
        } catch (err) {
            setError("We couldn't generate your study plan right now. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
                <LoadingSpinner size={48} />
                <p className="mt-4 text-neutral-500 font-medium">AI is analyzing your performance...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-10">
                <ErrorState title="Analysis Failed" message={error} onRetry={() => fetchRecommendations()} />
            </Container>
        );
    }

    const { weaknessAnalysis = [], studyPlan = { plan: [] }, progressMetrics = {}, resources = [] } = data || {};

    return (
        <Container className="py-8 space-y-10 animate-fade-in pb-20">
            {/* 1. Header & Overview */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <MetaText className="uppercase font-bold tracking-[0.2em] text-primary-600 block mb-2">
                        Intelligent Assistant
                    </MetaText>
                    <Title className="text-4xl flex items-center gap-3">
                        AI Study recommendations <Sparkles className="text-primary-500" fill="currentColor" size={32} />
                    </Title>
                    <BodyText className="mt-4 text-neutral-500 max-w-xl">
                        Based on your recent quiz attempts and roadmap progress, we've identified key areas for improvement.
                    </BodyText>
                </div>
                <Button
                    variant="outline"
                    onClick={() => fetchRecommendations(true)}
                    disabled={refreshing}
                    className="bg-white shadow-sm"
                >
                    <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Regenerating...' : 'Refresh Analysis'}
                </Button>
            </div>

            {/* 2. Progress Tracker KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-8 border-none bg-neutral-900 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={80} />
                    </div>
                    <Label className="text-white/60 mb-2 block">Improvement Rate</Label>
                    <div className="text-4xl font-black mb-1">+{progressMetrics.improvementPercent || 0}%</div>
                    <p className="text-xs text-success font-bold">vs. last assessment</p>
                </Card>

                <Card className="p-8 lg:col-span-2 group hover:border-primary-100 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <Label className="text-neutral-500 mb-1 block">Learning Trajectory</Label>
                            <MetaText className="text-[10px] font-black uppercase text-primary-600 tracking-widest">Recent Performance Trend</MetaText>
                        </div>
                        <Badge variant="primary" size="sm">Auto-Generated</Badge>
                    </div>
                    <div className="h-[180px]">
                        <PerformanceChart data={progressMetrics.weeklyTrend || []} isLoading={loading} />
                    </div>
                </Card>
            </div>

            {/* 3. Performance Analyzer Cards */}
            <div className="space-y-6">
                <SectionHeader>Performance Analyzer</SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {weaknessAnalysis.map((item, idx) => (
                        <Card key={idx} className="p-6 border-neutral-100 h-full flex flex-col justify-between group hover:shadow-xl transition-all">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="neutral" size="sm" className="bg-neutral-50">{item.level}</Badge>
                                    <AlertCircle size={16} className="text-primary-400" />
                                </div>
                                <h4 className="font-black text-lg text-neutral-900 mb-2">{item.topic}</h4>
                                <AccuracyBar
                                    percentage={100 - item.weaknessScore}
                                    label="Mastery level"
                                    color={item.weaknessScore > 50 ? 'error' : 'warning'}
                                />
                            </div>
                            <div className="mt-6">
                                <Button variant="ghost" size="sm" className="w-full justify-between text-primary-600 hover:bg-primary-50 px-0">
                                    {item.suggestedAction} <ArrowRight size={14} />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* 4. AI Study Plan Generator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <SectionHeader className="flex items-center gap-2">
                        <Calendar size={24} className="text-primary-600" /> 7-Day Study Mission
                    </SectionHeader>
                    <div className="space-y-4">
                        {studyPlan.plan.map((dayPlan, idx) => (
                            <Card key={idx} className="p-0 overflow-hidden border-neutral-100">
                                <div className="flex">
                                    <div className="w-16 bg-neutral-50 flex flex-col items-center justify-center border-r border-neutral-100">
                                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">Day</span>
                                        <span className="text-2xl font-black text-neutral-900 leading-tight">{dayPlan.day}</span>
                                    </div>
                                    <div className="p-6 flex-1 bg-white">
                                        <h5 className="font-bold text-neutral-900 mb-4">{dayPlan.topic}</h5>
                                        <div className="flex flex-wrap gap-3">
                                            {dayPlan.tasks.map((task, tIdx) => (
                                                <div key={tIdx} className="flex-1 min-w-[200px] p-3 rounded-lg bg-neutral-50 border border-neutral-100 flex items-start gap-3">
                                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${task.taskType === 'Practice' ? 'bg-primary-500' :
                                                        task.taskType === 'Revision' ? 'bg-amber-500' : 'bg-emerald-500'
                                                        }`} />
                                                    <div>
                                                        <p className="text-xs font-bold text-neutral-900 leading-none mb-1">{task.taskType}</p>
                                                        <p className="text-xs text-neutral-500 leading-tight">{task.detail}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 5. Resource Suggestions */}
                <div className="space-y-6">
                    <SectionHeader className="flex items-center gap-2">
                        <BookOpen size={24} className="text-success" /> Curated Resources
                    </SectionHeader>
                    <Card className="p-8 border-none bg-neutral-50">
                        <div className="space-y-8">
                            {resources.map((res, idx) => (
                                <div key={idx} className="space-y-4">
                                    <Label className="text-neutral-400 uppercase tracking-[0.2em]">{res.topic}</Label>
                                    <div className="space-y-3">
                                        {res.links.map((link, lIdx) => (
                                            <a
                                                key={lIdx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-between p-4 rounded-xl bg-white border border-neutral-100 hover:border-primary-300 transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="text-primary-600 bg-primary-50 p-2 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                        {link.type === 'YouTube' ? <PlayCircle size={18} /> :
                                                            link.type === 'Article' ? <BookOpen size={18} /> : <ArrowRight size={18} />}
                                                    </div>
                                                    <span className="text-sm font-bold text-neutral-800 line-clamp-1">{link.title}</span>
                                                </div>
                                                <ArrowRight size={14} className="text-neutral-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Tips Card */}
                    <Card className="p-8 bg-primary-50 border-primary-100 shadow-sm">
                        <h4 className="font-black text-primary-900 mb-2">Pro Tip</h4>
                        <p className="text-sm text-primary-800 leading-relaxed mb-6">
                            Consistency is key. Follow the 7-day plan without skipping slots to boost your <strong>Consistency Score</strong> and win the weekly badge.
                        </p>
                        <Button fullWidth size="sm" className="bg-primary-600 hover:bg-primary-700">Set Reminders</Button>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

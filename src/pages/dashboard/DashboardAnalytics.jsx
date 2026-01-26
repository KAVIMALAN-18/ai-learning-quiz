import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import analyticsService from '../../services/analytics.service';
import dashboardService from '../../services/dashboard.service';
import Container from '../../components/ui/Container';
import { Title, SectionHeader, BodyText, MetaText, Label } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Trophy, CheckCircle2, Calendar, LayoutDashboard, BarChart3, PieChart, Activity, Clock } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';

// New Chart Components
import PerformanceChart from '../../components/analytics/PerformanceChart';
import TopicChart from '../../components/analytics/TopicChart';
import ProgressDonut from '../../components/analytics/ProgressDonut';
import StudyTimeChart from '../../components/analytics/StudyTimeChart';

export default function DashboardAnalytics() {
  const { loading: authLoading } = useAuth();
  const [overview, setOverview] = useState(null);
  const [charts, setCharts] = useState({
    performance: [],
    topics: [],
    roadmap: [],
    studyTime: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, perf, top, road, time] = await Promise.all([
        dashboardService.getAnalyticsOverview(),
        analyticsService.getQuizPerformance(),
        analyticsService.getTopicAccuracy(),
        analyticsService.getRoadmapProgress(),
        analyticsService.getStudyTime()
      ]);

      setOverview(ov);
      setCharts({
        performance: perf,
        topics: top,
        roadmap: road,
        studyTime: time
      });
    } catch (err) {
      setError("Failed to load your performance insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (authLoading || loading) return (
    <Container className="py-20 flex flex-col items-center justify-center">
      <LoadingSpinner size={48} />
      <MetaText className="mt-4 animate-pulse uppercase font-black tracking-widest text-primary-600">Generating Real-time Insights...</MetaText>
    </Container>
  );

  return (
    <Container className="py-10 animate-fade-in pb-20">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-neutral-100">
          <div>
            <Label className="text-primary-600 block mb-2">
              Performance Intelligence
            </Label>
            <Title className="text-4xl italic">Progress Dashboard</Title>
            <BodyText className="mt-2 text-neutral-500 max-w-xl">
              A comprehensive analysis of your learning journey, accuracy trends, and roadmap velocity.
            </BodyText>
          </div>
          <div className="flex items-center gap-3 bg-neutral-100 p-1 rounded-md">
            <Badge variant="primary" className="bg-white shadow-sm">Live Data</Badge>
            <div className="flex items-center gap-1 px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <Label className="text-[10px] font-black uppercase text-neutral-400">Connected</Label>
            </div>
          </div>
        </div>

        {error ? (
          <div className="py-12">
            <ErrorState title="Sync Failed" message={error} onRetry={loadData} />
          </div>
        ) : (
          <div className="space-y-10">
            {/* 1. TOP STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 border-none bg-neutral-900 text-white group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-10 scale-150 rotate-12 transition-transform group-hover:scale-175">
                  <Activity size={64} />
                </div>
                <Label className="text-white/60 mb-2 block">Average Mastery</Label>
                <div className="text-4xl font-black mb-1">{overview?.avgScore ?? '0'}%</div>
                <p className="text-xs text-primary-400 font-bold uppercase tracking-widest">Global Proficiency</p>
              </Card>

              <Card className="p-8 border-neutral-100 shadow-sm flex flex-col justify-between">
                <div>
                  <Label className="text-neutral-400 mb-1 block">Consistency Score</Label>
                  <div className="text-3xl font-black text-neutral-900">{overview?.streak ?? '0'} Days</div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-primary-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-xs font-bold text-neutral-500">{overview?.totalQuizzes ?? '0'} Quizzes Taken</span>
                </div>
              </Card>

              <Card className="p-8 border-neutral-100 shadow-sm bg-indigo-50/30">
                <SectionHeader className="mt-0 text-sm mb-4">Roadmap Velocity</SectionHeader>
                <ProgressDonut data={charts.roadmap} />
              </Card>
            </div>

            {/* 2. TRENDS & DISTRIBUTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-8 border-neutral-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <SectionHeader className="m-0">Quiz Performance Trend</SectionHeader>
                  <LayoutDashboard size={18} className="text-neutral-300" />
                </div>
                <PerformanceChart data={charts.performance} />
              </Card>

              <Card className="p-8 border-neutral-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <SectionHeader className="m-0">Subject-wise Accuracy</SectionHeader>
                  <BarChart3 size={18} className="text-neutral-300" />
                </div>
                <TopicChart data={charts.topics} />
              </Card>
            </div>

            {/* 3. EFFORT & FOCUS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 p-8 border-neutral-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <SectionHeader className="m-0">Weekly Focus Area (Hours)</SectionHeader>
                  <Clock size={18} className="text-neutral-300" />
                </div>
                <StudyTimeChart data={charts.studyTime} />
              </Card>

              <Card className="p-8 border-none bg-primary-600 text-white flex flex-col justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <Trophy size={48} className="mx-auto mb-6 text-yellow-400 drop-shadow-lg" />
                  <h3 className="text-2xl font-black mb-2">Smart Insight</h3>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">
                    Based on your <span className="underline decoration-yellow-400 font-black">7-Day Study Time</span>, you are 24% more efficient than last week. Keep up the momentum!
                  </p>
                  <div className="mt-8 pt-8 border-t border-white/20">
                    <MetaText className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Platform Target</MetaText>
                    <div className="text-xl font-black">Top 5% of Learners</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

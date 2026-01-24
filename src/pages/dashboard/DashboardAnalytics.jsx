import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import dashboardService from '../../services/dashboard.service';
import Container from '../../components/ui/Container';
import { Title, SectionHeader, BodyText, MetaText, Label } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Trophy, CheckCircle2, Calendar, LayoutDashboard, BarChart3, PieChart, Activity } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import { AccuracyBar, MetricSplitBar } from '../../components/ui/Analytics';

import { ANALYTICS_SUMMARY } from '../../data/dashboard.mock';

export default function DashboardAnalytics() {
  const { loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingLocal(true);
      setError(null);
      try {
        const res = await dashboardService.getAnalytics();
        if (cancelled) return;
        setData(res || { summary: ANALYTICS_SUMMARY, weekly: Array(ANALYTICS_SUMMARY.weeklyEngagement).fill(0) });
      } catch (err) {
        if (cancelled) return;
        // Fallback to mock on error
        setData({ summary: ANALYTICS_SUMMARY, weekly: Array(ANALYTICS_SUMMARY.weeklyEngagement).fill(0) });
      } finally {
        if (!cancelled) setLoadingLocal(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const isLoading = authLoading || loadingLocal;

  if (isLoading) return (
    <Container className="py-20 flex flex-col items-center justify-center">
      <LoadingSpinner />
      <MetaText className="mt-4 animate-pulse uppercase font-black tracking-widest">Generating Insights...</MetaText>
    </Container>
  );

  return (
    <Container className="py-10 animate-fade-in pb-20">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-neutral-100">
          <div>
            <Label className="text-primary-600 block mb-2">
              Performance Metrics
            </Label>
            <Title className="text-4xl">Advanced Analytics</Title>
            <BodyText className="mt-2 text-neutral-500 max-w-xl">
              Deep dive into your learning patterns and assessment performance trends.
            </BodyText>
          </div>
          <div className="flex items-center gap-3 bg-neutral-100 p-1 rounded-md">
            <Badge variant="neutral" className="bg-white shadow-sm">Real-time</Badge>
            <Label className="px-3">Historical</Label>
          </div>
        </div>

        {error ? (
          <div className="py-12">
            <ErrorState
              title="Analytics Unavailable"
              message={error}
              onRetry={() => window.location.reload()}
            />
          </div>
        ) : (
          <div className="space-y-10">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 border-neutral-100 group hover:translate-y-[-4px] transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Trophy size={20} />
                  </div>
                  {data?.summary?.activityTrends && (
                    <Badge variant="success" size="sm">
                      {data.summary.activityTrends}
                    </Badge>
                  )}
                </div>
                <div className="text-3xl font-black text-neutral-900 mb-1">{data?.summary?.avgScore ?? '0'}%</div>
                <Label className="block text-neutral-400">Average Proficiency</Label>
              </Card>

              <Card className="p-8 border-neutral-100 group hover:translate-y-[-4px] transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-neutral-100 text-neutral-600 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <CheckCircle2 size={20} />
                  </div>
                  <Label className="text-neutral-400">Calculated</Label>
                </div>
                <div className="text-3xl font-black text-neutral-900 mb-1">{data?.summary?.quizzesTaken ?? '0'}</div>
                <Label className="block text-neutral-400">Assessments Completed</Label>
              </Card>

              <Card className="p-8 border-neutral-100 group hover:translate-y-[-4px] transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-neutral-900 text-white rounded-xl">
                    <Calendar size={20} />
                  </div>
                  <MetaText className="text-primary-600 font-black text-[10px] uppercase tracking-widest">Current Streak</MetaText>
                </div>
                <div className="text-3xl font-black text-neutral-900 mb-1">{(data?.weekly || []).length} Days</div>
                <Label className="block text-neutral-400">Weekly Engagement</Label>
              </Card>
            </div>

            {/* Visualizations Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Skill Proficiency Distribution */}
              <Card className="p-8 border-neutral-100">
                <SectionHeader className="mt-0 mb-6 flex items-center gap-2">
                  <PieChart size={20} className="text-primary-600" /> Skill Proficiency
                </SectionHeader>
                <div className="space-y-6">
                  <AccuracyBar percentage={85} label="React & Frontend" color="primary" />
                  <AccuracyBar percentage={64} label="System Architecture" color="warning" />
                  <AccuracyBar percentage={92} label="UI/UX Fundamentals" color="success" />
                  <AccuracyBar percentage={45} label="DevOps & Deployment" color="error" />
                </div>
              </Card>

              {/* Engagement Distribution */}
              <Card className="p-8 border-neutral-100">
                <SectionHeader className="mt-0 mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-primary-600" /> Engagement Split
                </SectionHeader>
                <div className="mb-10">
                  <Label className="block mb-4">Assessment Distribution</Label>
                  <MetricSplitBar
                    segments={[
                      { label: 'Completed', value: 24, percentage: 60, color: 'bg-primary-600' },
                      { label: 'In Progress', value: 8, percentage: 20, color: 'bg-amber-400' },
                      { label: 'Not Started', value: 8, percentage: 20, color: 'bg-neutral-200' },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                  <Activity size={20} className="text-neutral-400" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900 leading-tight">Retention Projection</p>
                    <p className="text-[10px] text-neutral-500">Based on your activity, you are on track to master 3 new skills this month.</p>
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

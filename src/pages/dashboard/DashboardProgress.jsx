import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../../services/dashboard.service';
import Container from '../../components/ui/Container';
import { Title, SectionHeader, BodyText, MetaText, Label } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { BarChart2, TrendingUp, Calendar, CheckCircle, Clock } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';

import { RECENT_ASSESSMENTS, PROGRESS_KPIs } from '../../data/dashboard.mock';

export default function DashboardProgress() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingLocal(true);
      setError(null);
      try {
        const data = await dashboardService.getProgress();
        if (cancelled) return;
        setProgress(data || { attempts: RECENT_ASSESSMENTS, kpis: PROGRESS_KPIs });
      } catch (err) {
        if (cancelled) return;
        // Fallback to mock on error
        setProgress({ attempts: RECENT_ASSESSMENTS, kpis: PROGRESS_KPIs });
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
      <MetaText className="mt-4 animate-pulse uppercase font-black tracking-widest">Aggregating Progress Data...</MetaText>
    </Container>
  );

  const attempts = progress?.attempts || [];

  return (
    <Container className="py-10 animate-fade-in pb-20">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-neutral-100">
          <div>
            <Label className="text-primary-600 block mb-2">
              Learning Velocity
            </Label>
            <Title className="text-4xl">Your Progress</Title>
            <BodyText className="mt-2 text-neutral-500 max-w-xl">
              Comprehensive overview of your quiz attempts and milestone completions.
            </BodyText>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <Label className="block mb-1 text-neutral-400">Global Status</Label>
              <Badge variant="success" size="sm">
                On Track
              </Badge>
            </div>
          </div>
        </div>

        {error ? (
          <div className="py-12">
            <ErrorState
              title="Progress Data Unavailable"
              message={error}
              onRetry={() => window.location.reload()}
            />
          </div>
        ) : attempts.length === 0 ? (
          <EmptyState
            title="No activity recorded"
            description="Your learning journey is waiting. Take your first assessment to see your performance metrics here."
            icon={BarChart2}
            action={() => navigate('/dashboard/quizzes')}
            actionLabel="Browse Quizzes"
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 border-neutral-100">
                <MetaText className="uppercase font-black tracking-widest text-[10px] text-neutral-400 block mb-2">Assessments</MetaText>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-neutral-900">{attempts.length}</span>
                  <span className="text-sm font-bold text-neutral-400 mb-1">Total</span>
                </div>
              </Card>
              <Card className="p-6 border-neutral-100">
                <Label className="block mb-2 text-neutral-400">Completion</Label>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-neutral-900">{progress?.kpis?.successRate || 100}%</span>
                  <Badge variant="success" size="sm" className="mb-1">Success</Badge>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center">
                  <Calendar size={16} />
                </div>
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest">Recent Activity</h3>
              </div>

              {attempts.map((attempt, idx) => (
                <Card key={idx} className="p-6 group hover:border-primary-200 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <SectionHeader className="mt-0 mb-1 text-lg font-black group-hover:text-primary-600 transition-colors">
                          {attempt.title || attempt.quizTitle || 'Technical Assessment'}
                        </SectionHeader>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-bold">
                            <Clock size={14} /> {attempt.duration || '12m'} taken
                          </div>
                          <div className="text-xs text-neutral-300 font-bold">•</div>
                          <div className="text-xs text-neutral-500 font-bold">Level: {attempt.difficulty || 'Advanced'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <Label className="block mb-1">Final Score</Label>
                        <Badge variant={attempt.score >= 80 ? 'success' : 'primary'}>
                          {attempt.score}%
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/quizzes/result/${attempt.id || idx}`)} className="h-10 px-6 font-black uppercase tracking-widest text-[10px]">
                        Review
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

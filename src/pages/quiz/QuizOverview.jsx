import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import { useAuth } from '../../context/useAuth';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import QuizCard from '../../components/quiz/QuizCard';
import { Plus, Search, Filter, History, Flame, ArrowUpDown, BookOpen, Layers, Rocket } from 'lucide-react';
import Container from '../../components/ui/Container';
import { Title, SectionHeader, BodyText, MetaText, Label } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

import { QUIZ_TEMPLATES } from '../../data/quiz.mock';

export default function QuizOverview() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [ongoing, setOngoing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [error, setError] = useState(null);

  // Templates from centralized mock data
  const templates = QUIZ_TEMPLATES;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const ongoingRes = await quizService.getOngoing().catch(() => null);
        if (cancelled) return;
        setOngoing(ongoingRes?.quiz || ongoingRes || null);
      } catch (err) {
        setError("Failed to sync your recent activity. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleStartTemplate = (template) => {
    navigate('/dashboard/quizzes/start', {
      state: {
        prefill: {
          topic: template.topic,
          difficulty: template.difficulty.toLowerCase(),
          count: template.questions.length
        }
      }
    });
  };

  const filteredTemplates = templates.filter(t => {
    const dMatch = difficultyFilter === 'All' || t.difficulty === difficultyFilter;
    const tMatch = topicFilter === 'All' || t.topic === topicFilter;
    return dMatch && tMatch;
  });

  if (authLoading) return (
    <Container className="py-10 animate-fade-in pb-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-neutral-100">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
        <div className="flex gap-6 items-center justify-between bg-neutral-100 p-2 rounded-lg">
          <Skeleton className="h-12 w-64" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    </Container>
  );

  if (error) return (
    <Container className="py-20">
      <ErrorState
        title="Knowledge Base Sync Failed"
        message={error}
        onRetry={() => window.location.reload()}
      />
    </Container>
  );

  return (
    <Container className="py-10 animate-fade-in pb-20">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-neutral-100">
          <div>
            <Label className="text-primary-600 block mb-2">
              Curated Library
            </Label>
            <Title className="text-4xl">Practice Assessments</Title>
            <BodyText className="mt-2 text-neutral-500 max-w-xl">
              Sharpen your skills with professional-grade quizzes designed to simulate real-world technical scenarios.
            </BodyText>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard/quizzes/history')} className="bg-white">
              <History size={18} className="mr-2" /> History
            </Button>
            <Button onClick={() => navigate('/dashboard/quizzes/start')} className="shadow-xl shadow-primary-600/20">
              <Plus size={18} className="mr-2" /> Custom Quiz
            </Button>
          </div>
        </div>

        {/* Ongoing Alert */}
        {ongoing && (
          <Card className="bg-primary-600 text-white p-1 overflow-hidden transition-transform hover:scale-[1.01] duration-500">
            <div className="bg-white/10 backdrop-blur-md rounded-md p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center animate-pulse shadow-inner">
                  <Flame size={28} className="text-white fill-white" />
                </div>
                <div>
                  <Label className="text-white/80 mb-1 block">Active Session</Label>
                  <SectionHeader className="text-white mt-0 mb-1 leading-tight">{ongoing.title || 'Incomplete Assessment'}</SectionHeader>
                  <BodyText className="text-white/70 text-sm">Resume your progress and finish strong.</BodyText>
                </div>
              </div>
              <Button
                onClick={() => navigate(`/dashboard/quizzes/attempt/${ongoing._id || ongoing.id}`)}
                className="bg-white text-primary-600 hover:bg-neutral-50 border-none font-black px-8 py-3 w-full sm:w-auto shadow-xl"
              >
                Continue Attempt
              </Button>
            </div>
          </Card>
        )}

        {/* Filters & Search Area */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-neutral-100 p-2 rounded-lg">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Search skills..."
                className="w-full pl-12 pr-4 py-3 bg-white border-neutral-200 rounded-md text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
              />
            </div>
            <Button variant="outline" className="bg-white h-[46px] w-[46px] p-0 shadow-sm">
              <ArrowUpDown size={18} />
            </Button>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <Label className="hidden sm:inline">Level:</Label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="flex-1 bg-white border border-neutral-200 text-neutral-900 text-xs font-black uppercase tracking-widest rounded-md focus:ring-primary-500 p-3 outline-none shadow-sm min-w-[140px]"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <Label className="hidden sm:inline">Topic:</Label>
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="flex-1 bg-white border border-neutral-200 text-neutral-900 text-xs font-black uppercase tracking-widest rounded-md focus:ring-primary-500 p-3 outline-none shadow-sm min-w-[140px]"
              >
                <option value="All">All Topics</option>
                <option value="React">React</option>
                <option value="JavaScript">JavaScript</option>
                <option value="CSS">CSS</option>
                <option value="Node.js">Node.js</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-0 overflow-hidden outline-none">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-12 w-full mt-4" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <QuizCard
                key={template.id}
                quiz={template}
                onStart={handleStartTemplate}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No assessments found"
            description="We couldn't find any quizzes matching your current filters. Try broadening your search or resetting filters."
            icon={Search}
            action={() => { setDifficultyFilter('All'); setTopicFilter('All'); }}
            actionLabel="Reset All Filters"
          />
        )}
      </div>
    </Container>
  );
}

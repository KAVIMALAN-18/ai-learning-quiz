import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  TrendingUp,
  Map,
  Zap,
  BookOpen,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Target,
  Calendar,
  Clock,
  BrainCircuit,
  Rocket
} from "lucide-react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import { Title, SectionHeader, BodyText, MetaText, Label } from "../ui/Typography";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import Skeleton from "../ui/Skeleton";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";

// New Chart Components
import PerformanceChart from '../analytics/PerformanceChart';
import ProgressDonut from '../analytics/ProgressDonut';

// 1. TOP SUMMARY CARD
const SummaryCard = ({ label, value, subtext, icon: Icon, colorClass, isLoading }) => (
  <Card className="relative overflow-hidden group h-full transition-all hover:translate-y-[-2px]">
    <div className={`absolute top-0 left-0 w-1.5 h-full ${colorClass}`} />
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <Label className="mb-1 block">
          {label}
        </Label>
        {isLoading ? (
          <Skeleton className="h-8 w-24 mb-2" />
        ) : (
          <div className="text-3xl font-black text-neutral-900 leading-none">
            {value}
          </div>
        )}
        {isLoading ? (
          <Skeleton className="h-3 w-32 mt-2" />
        ) : subtext && (
          <p className="text-xs text-neutral-400 mt-2 font-medium flex items-center gap-1">
            <TrendingUp size={12} className="text-success" /> {subtext}
          </p>
        )}
      </div>
      <div className="p-3 bg-neutral-50 rounded-lg text-neutral-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
        <Icon size={22} />
      </div>
    </div>
  </Card>
);

/* ------------------ Dashboard ------------------ */
const Dashboard = ({
  stats = [],
  velocity = {},
  recentQuizzes = [],
  roadmap = {},
  charts = { performance: [], topics: [], roadmapData: [] },
  isLoading = false
}) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <Container className="py-8 space-y-12 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
        <div>
          <MetaText className="uppercase font-black tracking-[0.3em] text-primary-600 block mb-2">
            Learning Dashboard
          </MetaText>
          <Title className="text-5xl font-black text-slate-900 tracking-tight">Hello, {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}</Title>
          <BodyText className="mt-4 text-slate-500 max-w-lg text-lg font-medium">
            Jump back into your curriculum and continue your journey towards mastery.
          </BodyText>
        </div>
        <div className="flex gap-4">
          <Button variant="primary" className="px-8 py-4 font-black shadow-xl shadow-primary-600/20" onClick={() => navigate('/dashboard/roadmap')}>
            CONTINUE LEARNING <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Column - Main Focus */}
        <div className="lg:col-span-2 space-y-12">

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {stats.slice(0, 2).map((stat, i) => (
              <Card key={i} className="p-8 border-none bg-white shadow-premium relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-full h-1.5 ${stat.colorClass || 'bg-primary-600'}`} />
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">{stat.label}</Label>
                <div className="text-4xl font-black text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-tight italic">{stat.subtext}</p>
              </Card>
            ))}
          </div>

          {/* RECENT ASSESSMENTS */}
          <Card className="p-0 border-none shadow-premium overflow-hidden bg-white">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <SectionHeader className="m-0 text-xl font-black text-slate-900">Recent Assessments</SectionHeader>
              <Button variant="ghost" size="sm" className="text-primary-600 font-bold" onClick={() => navigate("/dashboard/quizzes")}>View All</Button>
            </div>
            <div className="divide-y divide-slate-50">
              {isLoading ? (
                Array(2).fill(0).map((_, i) => <div key={i} className="p-8"><Skeleton className="h-20 w-full" /></div>)
              ) : recentQuizzes.length > 0 ? (
                recentQuizzes.slice(0, 3).map((quiz) => (
                  <div key={quiz.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all cursor-pointer group" onClick={() => navigate(`/dashboard/quizzes/result/${quiz.id}`)}>
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <Trophy size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg group-hover:text-primary-600 transition-colors uppercase tracking-tight">{quiz.title}</h4>
                        <MetaText className="text-[10px] font-bold text-slate-400">{quiz.date} • {quiz.duration}</MetaText>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900 leading-none mb-1">{quiz.score}%</div>
                        <Badge variant={quiz.status === 'Passed' ? 'success' : 'error'} size="sm" className="font-bold tracking-widest text-[9px] uppercase px-2">{quiz.status}</Badge>
                      </div>
                      <ArrowRight size={20} className="text-slate-200 group-hover:text-primary-600" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center">
                  <EmptyState title="No quiz attempts" description="Your assessment history will be tracked here." icon={Target} />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Active Path */}
        <div className="space-y-12">
          <Card className="p-0 border-none shadow-premium overflow-hidden bg-white rounded-3xl">
            <div className="p-10 bg-slate-900 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BrainCircuit size={100} />
              </div>
              <div className="relative z-10">
                <Label className="text-primary-400 block mb-3 uppercase tracking-widest font-black text-[10px]">Jump Back In</Label>
                <h3 className="text-3xl font-black mb-1 leading-tight tracking-tight">{roadmap.title}</h3>
                <p className="text-slate-400 text-sm font-medium">{roadmap.subtitle}</p>
              </div>
            </div>
            <div className="p-10">
              <div className="mb-10 flex flex-col items-center">
                <ProgressDonut data={charts.roadmapData} isLoading={isLoading} />
                <Label className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roadmap Progress</Label>
              </div>

              <div className="space-y-4">
                {roadmap.steps?.slice(0, 2).map((step, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-50 hover:border-primary-100 transition-all bg-slate-50/50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-white shadow-sm text-primary-600'}`}>
                      {step.status === 'completed' ? <CheckCircle2 size={18} /> : <Rocket size={18} />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`text-sm font-black truncate ${step.status === 'active' ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</p>
                      <Badge variant={step.status === 'completed' ? 'success' : step.status === 'active' ? 'primary' : 'neutral'} size="sm" className="mt-2 text-[8px] font-black uppercase tracking-widest">
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button fullWidth className="mt-10 py-5 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-600/10" onClick={() => navigate('/dashboard/roadmap')}>
                CONTINUE PATH <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;

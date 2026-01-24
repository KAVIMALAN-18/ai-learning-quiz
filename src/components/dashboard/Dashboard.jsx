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
  isLoading = false
}) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Authenticating...</p>
      </div>
    );
  }

  const { mastery = 0, completedModules = 0, totalModules = 0, activityData = [] } = velocity;

  return (
    <Container className="py-8 space-y-10 animate-fade-in pb-20">
      {/* 0. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <MetaText className="uppercase font-bold tracking-[0.2em] text-primary-600 block mb-2">
            Overview
          </MetaText>
          <Title className="text-4xl">Welcome back, {user?.name?.split(' ')[0] || user?.username}</Title>
          <BodyText className="mt-2 text-neutral-500 max-w-lg">
            Track your learning progress, review recent quiz performance, and continue your personalized roadmap.
          </BodyText>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard/roadmap')}>
            <Map size={18} className="mr-2" /> Roadmap
          </Button>
          <Button onClick={() => navigate('/dashboard/quizzes')}>
            <Zap size={18} className="mr-2" /> New Quiz
          </Button>
        </div>
      </div>

      {/* 1. TOP SUMMARY SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="h-32 p-6 flex flex-col justify-center">
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-8 w-1/2" />
            </Card>
          ))
        ) : (
          stats.map((stat, i) => (
            <SummaryCard key={i} {...stat} isLoading={isLoading} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* 2. PROGRESS OVERVIEW */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <SectionHeader className="mt-0 mb-0">Learning Velocity</SectionHeader>
              <Button variant="ghost" size="sm" className="text-primary-600 hover:bg-primary-50">
                View Detailed Analytics <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <Label className="text-neutral-600">Overall Mastery</Label>
                  {isLoading ? <Skeleton className="h-6 w-12" /> : <span className="text-2xl font-black text-neutral-900">{mastery}%</span>}
                </div>
                <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden mb-4 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg transition-all duration-1000"
                    style={{ width: isLoading ? '0%' : `${mastery}%` }}
                  />
                </div>
                <BodyText className="text-sm">
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ) : (
                    <>You have completed <strong>{completedModules} of {totalModules}</strong> core modules. Finish 2 more to unlock the next level.</>
                  )}
                </BodyText>
              </div>

              <div className="border-l border-neutral-100 pl-0 md:pl-12">
                <Label className="mb-4 block">Activity (7 Days)</Label>
                <div className="flex items-end justify-between h-24 gap-3">
                  {isLoading ? (
                    Array(7).fill(0).map((_, i) => <Skeleton key={i} className="flex-1 h-12" />)
                  ) : (
                    activityData.map((h, i) => (
                      <div key={i} className="flex-1 bg-neutral-50 rounded-t-md relative group">
                        <div
                          className="absolute bottom-0 w-full bg-primary-200 group-hover:bg-primary-500 rounded-t-md transition-all duration-300"
                          style={{ height: `${h}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-[10px] py-1 px-2 rounded font-bold transition-opacity whitespace-nowrap z-20">
                            {h}% effort
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-between text-[11px] text-neutral-400 mt-3 font-black">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 4. RECENT QUIZ ACTIVITY */}
          <Card className="overflow-hidden p-0" noPadding>
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <SectionHeader className="m-0">Recent Assessments</SectionHeader>
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/quizzes")}>View All</Button>
            </div>
            <div className="divide-y divide-neutral-100">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))
              ) : recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz) => (
                  <div key={quiz.id} className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-all group cursor-pointer" onClick={() => navigate(`/dashboard/quizzes/result/${quiz.id}`)}>
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-lg shadow-sm transition-transform group-hover:scale-110 ${quiz.status === 'Passed' ? 'bg-success/10 text-success' : 'bg-primary-50 text-primary-600'}`}>
                        {quiz.iconType === 'trophy' ? <Trophy size={20} /> : <Target size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">{quiz.title}</h4>
                        <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                          <Calendar size={12} /> {quiz.date} • <Clock size={12} /> {quiz.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className={`text-xl font-black ${quiz.score >= 80 ? 'text-success' : quiz.score >= 60 ? 'text-warning' : 'text-error'}`}>
                          {quiz.score}%
                        </div>
                        <Badge variant={quiz.status === 'Passed' ? 'success' : 'error'} size="sm">
                          {quiz.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="p-2">
                        <ArrowRight size={18} className="text-neutral-300 group-hover:text-primary-600" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center">
                  <EmptyState
                    title="No assessments found"
                    description="Your recent quiz history will appear here. Start your first assessment to track your progress."
                    icon={Target}
                    action={() => navigate("/dashboard/quizzes")}
                    actionLabel="Take Your First Quiz"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
          {/* 3. CURRENT ROADMAP SNAPSHOT */}
          <Card className="p-0 overflow-hidden shadow-premium border-none">
            <div className="p-8 bg-neutral-900 text-white relative">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <BrainCircuit size={80} />
              </div>
              <div className="relative z-10">
                <Label className="text-primary-400 block mb-3">
                  Active Roadmap
                </Label>
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-3/4 mb-2 bg-neutral-800" />
                    <Skeleton className="h-4 w-1/2 bg-neutral-800" />
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-black mb-1">{roadmap.title}</h3>
                    <p className="text-neutral-400 text-sm font-medium">{roadmap.subtitle}</p>
                  </>
                )}
              </div>
            </div>
            <div className="p-8 bg-white">
              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-neutral-100" />

                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-6">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-1" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))
                ) : (
                  roadmap.steps?.map((step, i) => (
                    <div key={i} className="flex gap-6 relative group">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 transition-all ${step.status === 'completed' ? 'border-success bg-success text-white shadow-lg shadow-success/20' :
                        step.status === 'active' ? 'border-primary-600 bg-white text-primary-600 ring-4 ring-primary-50 shadow-md' :
                          'border-neutral-200 bg-neutral-50 text-neutral-300'
                        }`}>
                        {step.status === 'completed' && <CheckCircle2 size={12} />}
                        {step.status === 'active' && <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />}
                      </div>
                      <div>
                        <p className={`text-sm font-bold leading-tight ${step.status === 'active' ? 'text-neutral-900' : 'text-neutral-500'}`}>{step.title}</p>
                        <Badge variant={step.status === 'completed' ? 'success' : step.status === 'active' ? 'primary' : 'neutral'} size="sm" className="mt-1">
                          {step.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button fullWidth className="mt-10 py-5 font-bold" onClick={() => navigate('/dashboard/roadmap')}>
                Continue Path <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </Card>

          {/* Quick Action Challenge */}
          <Card className="bg-primary-600 text-white border-none p-8 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                <Rocket size={24} className="text-white" />
              </div>
              <h4 className="font-black text-xl mb-2 tracking-tight">Daily Challenge</h4>
              <p className="text-primary-100 text-sm mb-8 leading-relaxed">
                Test your React skills with a lighting-fast micro-quiz.
              </p>
              <Button
                fullWidth
                onClick={() => navigate('/dashboard/quizzes')}
                className="bg-white text-primary-600 hover:bg-neutral-50 border-none font-black py-4 shadow-xl"
              >
                Boost Your Streak
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;

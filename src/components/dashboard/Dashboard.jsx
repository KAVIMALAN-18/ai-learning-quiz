import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Rocket,
  Sparkles,
  ArrowUpRight,
  LayoutDashboard
} from "lucide-react";
import { Card, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { Title, SectionHeader, BodyText, MetaText, Label } from "../ui/Typography";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import Skeleton from "../ui/Skeleton";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import PerformanceChart from '../analytics/PerformanceChart';
import ProgressDonut from '../analytics/ProgressDonut';
import LearningAdvisor from '../ai/LearningAdvisor';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

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

  if (authLoading || isLoading) {
    return (
      <Container className="py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-surface-500 font-medium animate-pulse">Personalizing your workspace...</p>
      </Container>
    );
  }

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 pb-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* 1. WELCOME SECTION */}
      <motion.section variants={itemVariants} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-4xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <Card noPadding className="relative overflow-hidden border-none shadow-2xl bg-slate-950 min-h-[320px] flex items-center">
          <div className="absolute top-0 right-0 p-12 opacity-5 animate-float pointer-events-none">
            <BrainCircuit size={400} />
          </div>

          <div className="relative z-10 w-full p-8 md:p-14 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles size={14} className="text-secondary-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/70">Learning Workspace</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Welcome back, <br />
                <span className="text-gradient from-primary-400 to-secondary-400">{firstName}</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium mb-10 max-w-sm leading-relaxed">
                You've completed <span className="text-white font-bold">85%</span> of your weekly progress. Ready to dive back in?
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button
                  variant="premium"
                  size="lg"
                  className="rounded-2xl"
                  onClick={() => navigate('/dashboard/roadmap')}
                >
                  Resume Learning <ArrowRight size={18} className="ml-2" />
                </Button>
                <Button
                  variant="glass"
                  size="lg"
                  className="rounded-2xl border-white/10 text-white"
                  onClick={() => navigate('/dashboard/quizzes')}
                >
                  Quick Practice
                </Button>
              </div>
            </div>

            <div className="hidden lg:block bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 w-64 text-center">
              <div className="relative inline-block mb-4">
                <ProgressDonut data={charts.roadmapData} size={120} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{velocity.mastery}%</span>
                </div>
              </div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-2">Overall Mastery</p>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* 2. STATS GRID */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} variant="glass" interactive className="p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-surface-100 text-surface-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                {stat.label.includes('Courses') ? <BookOpen size={20} /> :
                  stat.label.includes('Quizzes') ? <CheckCircle2 size={20} /> :
                    stat.label.includes('Score') ? <Trophy size={20} /> : <Zap size={20} />}
              </div>
              <ArrowUpRight size={16} className="text-surface-300 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <p className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="text-2xl font-black text-surface-900">{stat.value}</div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-primary-600 bg-primary-50 w-fit px-2 py-0.5 rounded-full">
              <TrendingUp size={10} /> {stat.subtext}
            </div>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* 3. MAIN CONTENT (Left) */}
        <div className="lg:col-span-2 space-y-10">
          {/* PERFORMANCE OVERVIEW */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary-50 text-secondary-600 rounded-xl">
                  <LayoutDashboard size={20} />
                </div>
                <h2 className="text-2xl font-black text-surface-900 tracking-tight">Performance Summary</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-primary-600">Analyze More</Button>
            </div>

            <Card variant="default" className="p-8">
              <div className="h-[300px]">
                <PerformanceChart data={charts.performance} />
              </div>
              <div className="mt-8 flex flex-wrap gap-8 justify-center items-center border-t border-surface-100 pt-8">
                <div className="text-center">
                  <p className="text-xs font-bold text-surface-400 uppercase mb-1">Weekly Growth</p>
                  <p className="text-xl font-black text-surface-900">+12%</p>
                </div>
                <div className="w-px h-8 bg-surface-100 hidden sm:block" />
                <div className="text-center">
                  <p className="text-xs font-bold text-surface-400 uppercase mb-1">Quiz Accuracy</p>
                  <p className="text-xl font-black text-emerald-600">88.4%</p>
                </div>
                <div className="w-px h-8 bg-surface-100 hidden sm:block" />
                <div className="text-center">
                  <p className="text-xs font-bold text-surface-400 uppercase mb-1">Time Spent</p>
                  <p className="text-xl font-black text-primary-600">4.5 hrs</p>
                </div>
              </div>
            </Card>
          </motion.section>

          {/* RECENT ASSESSMENTS */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Trophy size={20} />
                </div>
                <h2 className="text-2xl font-black text-surface-900 tracking-tight">Recent Assessments</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/quizzes")}>View All</Button>
            </div>

            <div className="space-y-4">
              {recentQuizzes.length > 0 ? (
                recentQuizzes.slice(0, 3).map((quiz) => (
                  <Card key={quiz.id} interactive className="p-6 group cursor-pointer" onClick={() => navigate(`/dashboard/quizzes/result/${quiz.id}`)}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-surface-50 flex items-center justify-center text-surface-400 group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:scale-110">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-surface-900 text-lg tracking-tight uppercase">{quiz.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12} /> {quiz.date}</span>
                            <span className="w-px h-3 bg-surface-200" />
                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest flex items-center gap-1"><Clock size={12} /> {quiz.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between">
                        <div className="text-right">
                          <div className="text-3xl font-black text-surface-900 tracking-tighter">{quiz.score}%</div>
                          <Badge variant={quiz.status === 'Passed' ? 'success' : 'error'} size="sm" className="font-black tracking-widest text-[8px] uppercase">{quiz.status}</Badge>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-surface-100 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <EmptyState title="No Assessments Yet" description="Your quiz results and progress insights will appear here once you take a test." icon={Target} />
              )}
            </div>
          </motion.section>
        </div>

        {/* 4. ASIDE CONTENT (Right) */}
        <div className="space-y-10">
          {/* ACTIVE ROADMAP PREVIEW */}
          <motion.section variants={itemVariants}>
            <Card variant="surface" className="p-0 rounded-4xl overflow-hidden group">
              <div className="p-8 bg-slate-900 text-white relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Rocket size={80} />
                </div>
                <Badge variant="primary" className="bg-primary-500/20 text-primary-400 border-none mb-4 uppercase text-[9px] tracking-widest font-black">Active Path</Badge>
                <h3 className="text-2xl font-black mb-2 tracking-tight">{roadmap.title}</h3>
                <p className="text-slate-400 text-sm font-medium">{roadmap.subtitle}</p>
              </div>
              <div className="p-8">
                <div className="space-y-4 mb-8">
                  {roadmap.steps?.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className={`mt-1 w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : step.status === 'active' ? 'bg-primary-600 text-white' : 'bg-surface-100 text-surface-300'}`}>
                        {step.status === 'completed' ? <CheckCircle2 size={14} /> : <div className="text-[10px] font-black">{i + 1}</div>}
                      </div>
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-tight ${step.status === 'active' ? 'text-surface-900' : 'text-surface-400'}`}>{step.title}</p>
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{step.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button fullWidth variant="primary" className="py-5" onClick={() => navigate('/dashboard/roadmap')}>
                  Resume Chapter
                </Button>
              </div>
            </Card>
          </motion.section>

          {/* SMART RECOMMENDATIONS */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-black text-surface-900 tracking-tight">For You</h2>
            </div>
            <div className="space-y-4">
              <Card variant="glass" interactive className="p-5 flex flex-col gap-3">
                <Badge variant="secondary" className="w-fit text-[8px] tracking-widest font-black uppercase">Next Topic</Badge>
                <h4 className="font-black text-surface-900 uppercase text-sm leading-tight">Advanced React Hooks Patterns</h4>
                <p className="text-xs text-surface-500 font-medium">Deepen your mastery of state management and side effects.</p>
                <Button variant="ghost" size="sm" className="w-fit p-0 h-auto text-primary-600 text-[10px] font-black">START EXPLORING <ArrowRight size={12} className="ml-1" /></Button>
              </Card>

              <Card variant="glass" interactive className="p-5 flex flex-col gap-3">
                <Badge variant="accent" className="w-fit text-[8px] tracking-widest font-black uppercase">Skill Gap</Badge>
                <h4 className="font-black text-surface-900 uppercase text-sm leading-tight">Data Structures Practice</h4>
                <p className="text-xs text-surface-500 font-medium">Taking a quick practice test could improve your accuracy by 15%.</p>
                <Button variant="ghost" size="sm" className="w-fit p-0 h-auto text-primary-600 text-[10px] font-black">TAKE PRACTICE <ArrowRight size={12} className="ml-1" /></Button>
              </Card>
            </div>
          </motion.section>

          {/* AI ADVISOR COMPACT */}
          <motion.div variants={itemVariants}>
            <LearningAdvisor compact />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

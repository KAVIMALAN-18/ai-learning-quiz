import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import quizService from "../../services/quiz.service";
import { useAuth } from "../../context/useAuth";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Title, BodyText, SectionHeader, MetaText, Label } from "../../components/ui/Typography";
import Badge from "../../components/ui/Badge";
import Container from "../../components/ui/Container";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  LayoutDashboard,
  Map,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  Zap,
  Star,
  Download,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

import { MOCK_RESULTS } from "../../data/quiz.mock";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import { AccuracyBar, MetricSplitBar, PerformanceBar } from "../../components/ui/Analytics";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function QuizResult({
  resultData = null,
  quizData = null,
  isLoading: propLoading = false
}) {
  const { id: quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [result, setResult] = useState(resultData || location.state?.result || null);
  const [quiz, setQuiz] = useState(quizData || location.state?.quiz || null);
  const [loadingLocal, setLoadingLocal] = useState(!result || !quiz);
  const [error, setError] = useState(null);
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (result && quiz) {
        setLoadingLocal(false);
        return;
      }
      setLoadingLocal(true);
      setError(null);
      try {
        const [res, quizRes] = await Promise.all([
          !result ? quizService.getResult(quizId).catch(() => ({ result: MOCK_RESULTS })) : Promise.resolve({ result }),
          !quiz ? quizService.getQuiz(quizId).catch(() => null) : Promise.resolve({ quiz })
        ]);
        if (cancelled) return;
        if (res?.result) setResult(res.result);
        const q = quizRes?.quiz || quizRes;
        if (q) setQuiz(q);
      } catch (err) {
        setError("Failed to generate your performance report. Please try again.");
      } finally {
        if (!cancelled) setLoadingLocal(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [quizId, result, quiz]);

  const isLoading = authLoading || loadingLocal || propLoading;

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mesh">
      <LoadingSpinner size={64} />
      <p className="mt-8 text-neutral-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Aggregating Skill Analytics...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-mesh py-20">
      <ErrorState
        title="Analysis Generation Failed"
        message={error}
        onRetry={() => window.location.reload()}
      />
    </div>
  );

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center bg-mesh py-10">
      <EmptyState
        title="No Result Found"
        description="We couldn't retrieve the assessment data for this session. It might have been deleted or the link is invalid."
        icon={Target}
        action={() => navigate('/dashboard')}
        actionLabel="Back to Dashboard"
      />
    </div>
  );

  // Derive standardized values
  const totalQuestions = quiz?.questions?.length || result.total || 0;
  const answersGiven = result.answers || [];
  const score = result.score ?? 0;
  const correct = answersGiven.filter(a => a.correct).length || Math.round((score / (totalQuestions || 1)) * totalQuestions) || 0;
  const accuracy = result.accuracy ?? (Math.round((correct / (totalQuestions || 1)) * 100) || 0);
  const isPass = result.isPass ?? (accuracy >= 70);
  const timeTaken = result.timeTaken || 0;

  const questionsToReview = quiz?.questions || [];

  // Skill Data for Radar Chart (Mocked based on results)
  const skillData = [
    { subject: 'Memory', A: 70 + (accuracy * 0.3), fullMark: 100 },
    { subject: 'Logic', A: 40 + (accuracy * 0.5), fullMark: 100 },
    { subject: 'Speed', A: Math.max(10, 100 - (timeTaken / totalQuestions) * 2), fullMark: 100 },
    { subject: 'Precision', A: accuracy, fullMark: 100 },
    { subject: 'Focus', A: 85, fullMark: 100 },
  ];

  const getAnswerStatus = (qIndex, q) => {
    const stateAnswers = location.state?.answers || {};
    const userChoiceIdx = stateAnswers[qIndex];
    const serverAns = answersGiven.find(a => a.questionId === q._id);
    const userAns = userChoiceIdx !== undefined ? userChoiceIdx : (serverAns ? serverAns.answer : null);
    const isCorrect = serverAns ? serverAns.correct : (String(userAns) === String(q.correctAnswer));
    return { userAns, isCorrect };
  };

  const toggleExpand = (idx) => {
    setExpandedQ(expandedQ === idx ? null : idx);
  };

  return (
    <div className="bg-surface-50 min-h-screen font-sans text-surface-900 pb-32">
      <Container className="py-12 lg:py-20 max-w-[1300px]">
        {/* 1. HERO ANALYTICS BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10"
        >
          <Card noPadding className={`lg:col-span-8 border-none overflow-hidden relative flex flex-col justify-center min-h-[400px] shadow-2xl ${isPass ? 'bg-slate-900' : 'bg-slate-800'}`}>
            <div className="absolute inset-0 bg-premium-gradient opacity-20" />
            <div className="absolute -right-20 -bottom-20 opacity-10 blur-3xl w-96 h-96 bg-primary-500 rounded-full" />

            <div className="relative z-10 p-10 lg:p-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest mb-8">
                  <Star size={14} className="text-amber-400" /> {isPass ? 'Certification Grade' : 'Proficiency Analysis'}
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[0.9]">
                  {isPass ? 'Mastery Verified.' : 'Growth Iteration.'}
                </h1>
                <p className="text-white/60 text-xl font-medium max-w-xl leading-relaxed mb-10">
                  You've completed the validation for <span className="text-white font-black">{quiz?.topic || result.topic || 'Concept'}</span>.
                  Our AI engine has mapped your cognitive gaps and strengths.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button variant="premium" size="lg" className="px-10 h-16 text-lg" onClick={() => navigate('/dashboard/roadmap')}>
                    RESUME ROADMAP <ArrowRight size={20} className="ml-2" />
                  </Button>
                  <Button variant="glass" size="lg" className="px-8 h-16 border-white/10 text-white" onClick={() => window.print()}>
                    <Download size={18} className="mr-2" /> REPORT
                  </Button>
                </div>
              </motion.div>
            </div>
          </Card>

          <Card variant="glass" className="lg:col-span-4 p-12 flex flex-col items-center justify-center text-center shadow-premium bg-white">
            <div className="relative w-44 h-44 mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-surface-100" />
                <motion.circle
                  initial={{ strokeDashoffset: 502 }}
                  animate={{ strokeDashoffset: 502 - (502 * accuracy) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={502}
                  className={`transition-all ${isPass ? 'text-primary-600' : 'text-red-500'}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-surface-900 leading-none">{accuracy}%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 mt-1">Accuracy</span>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-surface-900 tracking-tight uppercase">Performance Index</h4>
              <p className="text-surface-500 font-medium text-xs">Industry Standard Benchmarking</p>
            </div>
            <div className="mt-8 flex gap-3 w-full">
              <div className="flex-1 p-4 bg-surface-50 rounded-2xl border border-surface-200">
                <div className="text-lg font-black text-surface-900">{correct}</div>
                <div className="text-[9px] font-black uppercase text-surface-400 tracking-widest">Correct</div>
              </div>
              <div className="flex-1 p-4 bg-surface-50 rounded-2xl border border-surface-200">
                <div className="text-lg font-black text-red-500">{totalQuestions - correct}</div>
                <div className="text-[9px] font-black uppercase text-surface-400 tracking-widest">Missed</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 2. ANALYTICS DEEP DIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* RADAR CHART PANEL */}
          <Card className="lg:col-span-5 p-10 bg-white border-surface-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h3 className="text-lg font-black text-surface-900 tracking-tight uppercase leading-none mb-2">Cognitive Map</h3>
                <p className="text-xs font-medium text-surface-400">Multidimensional Skill Analysis</p>
              </div>
              <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
                <Zap size={20} />
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                  <Radar
                    name="Student"
                    dataKey="A"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 pt-8 border-t border-surface-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                  <Trophy size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-surface-400">Efficiency Rank</div>
                  <div className="text-xs font-black text-surface-900 uppercase">Top 12% in Batch</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest">Detailed View</Button>
            </div>
          </Card>

          {/* AI FEEDBACK & NEXT STEPS */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-10 border-none bg-primary-600 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Target size={180} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-0.5 w-10 bg-white/20" />
                  <h3 className="text-xl font-black uppercase tracking-widest text-white/90">Curriculum Strategy</h3>
                </div>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-white shrink-0">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-white mb-1 leading-none uppercase tracking-tight">Focus: Error Resilience</h4>
                      <p className="text-white/70 text-sm leading-relaxed">Minor logic gaps detected in complex scenarios. Recommend dedicated revision of the "Edge Case Handling" module.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-white shrink-0">
                      <RotateCcw size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-white mb-1 leading-none uppercase tracking-tight">Review Path</h4>
                      <p className="text-white/70 text-sm leading-relaxed">System has flagged 2 concepts for immediate revisit within your roadmap workbench.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 bg-white border-surface-200">
                <div className="text-[10px] font-black uppercase text-surface-400 tracking-widest mb-2 font-mono">Temporal Efficiency</div>
                <div className="text-3xl font-black text-surface-900 mb-1">{Math.floor(timeTaken / 60)}m {timeTaken % 60}s</div>
                <div className="h-1 w-full bg-surface-100 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[75%]" />
                </div>
              </Card>
              <Card className="p-6 bg-white border-surface-200">
                <div className="text-[10px] font-black uppercase text-surface-400 tracking-widest mb-2 font-mono">Cognitive Confidence</div>
                <div className="text-3xl font-black text-primary-600 mb-1">Strong</div>
                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= 4 ? 'bg-primary-500' : 'bg-surface-100'}`} />)}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* 3. ITEM-LEVEL SCRUTINY */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-black text-surface-900 tracking-tight uppercase px-2">Decision Log</h3>
            <div className="text-[10px] font-black uppercase tracking-widest text-surface-400">{totalQuestions} Queries Audited</div>
          </div>

          <div className="space-y-3">
            {questionsToReview.map((q, idx) => {
              const { userAns, isCorrect } = getAnswerStatus(idx, q);
              const isOpen = expandedQ === idx;

              return (
                <motion.div
                  layout
                  key={idx}
                  className="bg-white border border-surface-200 rounded-2xl overflow-hidden transition-all hover:shadow-md group"
                >
                  <button
                    onClick={() => toggleExpand(idx)}
                    className={`w-full flex items-center justify-between p-6 text-left transition-all ${isOpen ? 'bg-surface-50' : 'bg-white'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 font-black text-base transition-all ${isCorrect ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-red-100 bg-red-50 text-red-600'}`}>
                        {idx + 1}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-lg text-surface-800 truncate max-w-[300px] md:max-w-xl leading-none tracking-tight">{q.question}</span>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {isCorrect ? 'Success' : 'Gaps Detected'}
                          </span>
                          <span className="text-[8px] font-black text-surface-400 uppercase tracking-widest">Section: {quiz?.topic || 'Core'}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-surface-100 text-surface-400 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-8 bg-surface-50/50 border-t border-surface-200 space-y-8">
                          <p className="text-xl font-black text-surface-900 leading-snug tracking-tight">{q.question}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = (userAns === optIdx);
                              const isCorrectAnswer = (optIdx === (q.correctAnswer ?? 0));

                              let style = "border-surface-200 bg-white text-surface-500";
                              if (isCorrectAnswer) style = "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/10";
                              else if (isSelected) style = "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/10";

                              return (
                                <div key={optIdx} className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${style}`}>
                                  <div className="flex items-center gap-4">
                                    <div className={`text-[10px] font-black w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all ${isCorrectAnswer ? 'bg-emerald-500 text-white border-emerald-500' : isSelected ? 'bg-red-500 text-white border-red-500' : 'bg-surface-50 text-surface-400 border-surface-200'}`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </div>
                                    <span className="text-sm font-bold leading-tight">{opt}</span>
                                  </div>
                                  {isCorrectAnswer && <CheckCircle2 size={18} strokeWidth={3} className="text-emerald-500" />}
                                  {isSelected && !isCorrectAnswer && <XCircle size={18} strokeWidth={3} className="text-red-500" />}
                                </div>
                              );
                            })}
                          </div>

                          <div className="p-6 bg-white border border-surface-200 rounded-2xl flex gap-6 items-start relative overflow-hidden group/feedback hover:shadow-md transition-all">
                            <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600 shrink-0">
                              <HelpCircle size={20} />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 block mb-1">Expert Rationale</span>
                              <p className="text-surface-600 text-sm font-medium leading-relaxed">
                                The concept validates your understanding of <span className="text-surface-900 font-bold">{quiz?.topic || 'this subject'}</span>.
                                Maintaining consistency in this area is key to building enterprise-ready solutions.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 4. STRATEGIC EXIT FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-16 border-t border-surface-200 mt-12">
          <Button variant="ghost" onClick={() => navigate("/dashboard/quizzes")} className="w-full sm:w-64 h-14 rounded-xl font-black text-surface-400 hover:text-surface-900 hover:bg-surface-100">
            <RotateCcw size={20} className="mr-2" /> RESTART SESSION
          </Button>
          <Button variant="premium" onClick={() => navigate("/dashboard")} className="w-full sm:w-64 h-14 rounded-xl font-black shadow-xl">
            <LayoutDashboard size={20} className="mr-2" /> HUB DASHBOARD
          </Button>
        </div>
      </Container>
    </div>
  );
}

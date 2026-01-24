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
  ArrowRight
} from "lucide-react";

import { MOCK_RESULTS } from "../../data/quiz.mock";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import { AccuracyBar, MetricSplitBar, PerformanceBar } from "../../components/ui/Analytics";

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
    <Container className="py-10 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Banner Skeleton */}
        <Skeleton className="h-56 rounded-xl" />

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-8 flex flex-col items-center gap-3">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 p-8 h-80">
            <Skeleton className="h-6 w-32 mb-8" />
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-10 h-10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-40 mb-6" />
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );

  if (error) return (
    <Container className="py-20">
      <ErrorState
        title="Result Fetching Failed"
        message={error}
        onRetry={() => window.location.reload()}
      />
    </Container>
  );

  if (!result) return (
    <Container className="py-10">
      <EmptyState
        title="No Result Found"
        description="We couldn't retrieve the assessment data for this session. It might have been deleted or the link is invalid."
        icon={Target}
        action={() => navigate('/dashboard')}
        actionLabel="Back to Dashboard"
      />
    </Container>
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

  // Difficulty specific intensity settings
  const difficultyIntensity = {
    Beginner: { opacity: 'opacity-70', color: 'emerald' },
    Intermediate: { opacity: 'opacity-85', color: 'primary' },
    Advanced: { opacity: 'opacity-100', color: 'rose' }
  };
  const diffSettings = difficultyIntensity[quiz?.difficulty || result.difficulty] || difficultyIntensity.Intermediate;

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
    <Container className="py-10 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Success / Failure Banner */}
        <Card className={`mb-8 overflow-hidden border-none shadow-2xl relative ${isPass ? 'bg-primary-600' : 'bg-neutral-900'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <Label className="text-white/60 mb-4 block">
                  Assessment Result
                </Label>
                <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                  {isPass ? 'Great Job, ' + (user?.name?.split(' ')[0] || 'Learner') + '!' : 'Keep Practicing!'}
                </h1>
                <BodyText className="text-white/80 text-lg">
                  You completed the <span className="text-white font-bold">{quiz?.topic || result.topic || 'Quiz'}</span> assessment.
                </BodyText>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-2xl">
                    <div className="text-center">
                      <span className="block text-3xl font-black">{accuracy}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Accuracy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`h-1.5 w-full ${isPass ? 'bg-success' : 'bg-primary-400'}`} />
        </Card>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="p-8 border-neutral-100 flex flex-col justify-between">
            <div className="mb-6">
              <Label className="block mb-1">Success Metric</Label>
              <div className="text-3xl font-black text-neutral-900">{score}/{totalQuestions}</div>
            </div>
            <AccuracyBar percentage={accuracy} label="Accuracy" color={isPass ? 'primary' : 'warning'} />
          </Card>

          <Card className="p-8 border-neutral-100 md:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Label className="block mb-1">Performance Split</Label>
                <div className="text-xl font-black text-neutral-900">Summary</div>
              </div>
              <Badge variant={isPass ? 'success' : 'primary'} size="sm">
                {isPass ? 'Qualified' : 'Requires Review'}
              </Badge>
            </div>
            <MetricSplitBar
              segments={[
                { label: 'Correct', value: correct, percentage: (correct / totalQuestions) * 100, color: 'bg-emerald-500' },
                { label: 'Incorrect', value: totalQuestions - correct, percentage: ((totalQuestions - correct) / totalQuestions) * 100, color: 'bg-rose-500' },
              ]}
            />
          </Card>

          <Card className="p-8 border-neutral-100 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 mb-4">
              <Clock size={24} />
            </div>
            <div className="text-2xl font-black text-neutral-900">{Math.floor(timeTaken / 60)}m {timeTaken % 60}s</div>
            <Label className="mt-1">Total Duration</Label>
            <div className="mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 px-3 py-1 rounded-full">
              Level: {quiz?.difficulty || result.difficulty || 'Medium'}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Detailed Info Card */}
          <div className="lg:col-span-1">
            <Card className="p-8 h-full bg-neutral-50 border-neutral-200">
              <SectionHeader className="mt-0 mb-6">Learning Insight</SectionHeader>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-md shadow-sm text-primary-600">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm">Performance</h4>
                    <p className="text-sm text-neutral-600 mt-1">
                      {accuracy >= 90 ? 'Exceptional! You have a solid grasp of this topic.' : accuracy >= 70 ? 'Well done! You have a good understanding, keep going.' : 'This topic needs more focus. Try revisiting the basics.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-md shadow-sm text-success">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm">Time Efficiency</h4>
                    <p className="text-sm text-neutral-600 mt-1">
                      Average of {totalQuestions > 0 ? Math.round(timeTaken / totalQuestions) : 0}s per question.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200">
                  <Button variant="outline" fullWidth onClick={() => navigate('/dashboard/roadmap')} className="bg-white">
                    Continue Learning <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Question Review List */}
          <div className="lg:col-span-2">
            <SectionHeader className="mt-0 mb-4 flex items-center gap-2">
              <CheckCircle2 size={24} className="text-primary-600" /> Review Questions
            </SectionHeader>
            {questionsToReview.length > 0 ? (
              <div className="space-y-3">
                {questionsToReview.map((q, idx) => {
                  const { userAns, isCorrect } = getAnswerStatus(idx, q);
                  const isOpen = expandedQ === idx;

                  return (
                    <div key={idx} className="bg-white border border-neutral-200 rounded-md overflow-hidden transition-all hover:border-neutral-300">
                      <button
                        onClick={() => toggleExpand(idx)}
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-neutral-50' : 'bg-white'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center border font-bold text-sm transition-opacity ${diffSettings.opacity} ${isCorrect ? 'border-success/20 bg-success/10 text-success' : 'border-error/20 bg-error/10 text-error'}`}>
                            {idx + 1}
                          </div>
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="font-semibold text-neutral-800 truncate max-w-[200px] sm:max-w-md">{q.question}</span>
                            <div className="w-32">
                              <PerformanceBar
                                value={answersGiven[idx]?.timeSpent || 0}
                                max={Math.max(...answersGiven.map(a => a.timeSpent || 0), 60)}
                                label={`${answersGiven[idx]?.timeSpent || 0}s`}
                                color={isCorrect ? 'success' : 'error'}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isOpen ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="p-6 bg-neutral-50/50 border-t border-neutral-200 animate-slide-up">
                          <p className="text-lg font-bold text-neutral-900 mb-6 leading-tight">{q.question}</p>
                          <div className="grid gap-3">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = (userAns === optIdx);
                              const isCorrectAnswer = (optIdx === (q.correctAnswer ?? 0));

                              let style = "border-neutral-200 bg-white";
                              if (isCorrectAnswer) style = "border-success bg-success/5 text-success font-bold ring-1 ring-success/20";
                              else if (isSelected) style = "border-error bg-error/5 text-error font-bold ring-1 ring-error/20";

                              return (
                                <div key={optIdx} className={`p-4 rounded-md border flex items-center justify-between ${style}`}>
                                  <div className="flex items-center gap-4">
                                    <div className="text-xs font-black w-6 h-6 rounded bg-neutral-100 flex items-center justify-center border border-neutral-200 text-neutral-500">
                                      {String.fromCharCode(65 + optIdx)}
                                    </div>
                                    <span className="text-sm">{opt}</span>
                                  </div>
                                  {isCorrectAnswer && <CheckCircle2 size={18} />}
                                  {isSelected && !isCorrectAnswer && <XCircle size={18} />}
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-6 flex gap-3 p-4 bg-primary-50 rounded-md border border-primary-100">
                            <HelpCircle size={20} className="text-primary-600 shrink-0" />
                            <p className="text-sm text-primary-900">
                              <strong>Explanation:</strong> Check your learning resources on {quiz?.topic || result.topic} to understand the reasoning behind this answer.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="Review Not Available"
                description="Question details could not be loaded for this review session."
              />
            )}
          </div>
        </div>

        {/* Global Footer Actions */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-10 border-t border-neutral-200">
          <Button onClick={() => navigate("/dashboard/quizzes")} size="lg" className="w-full md:w-64">
            <RotateCcw size={18} className="mr-2" /> Take Another Quiz
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")} size="lg" className="w-full md:w-64">
            <LayoutDashboard size={18} className="mr-2" /> Go to Dashboard
          </Button>
        </div>
      </div>
    </Container>
  );
}

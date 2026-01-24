import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import { useAuth } from '../../context/useAuth';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Title, MetaText } from '../../components/ui/Typography';
import Container from '../../components/ui/Container';
import { Clock, AlertCircle, X, LayoutGrid, CheckCircle2, ChevronLeft, ChevronRight, Rocket } from 'lucide-react';

// Imported Components
import SubmitConfirmationModal from '../../components/quiz-attempt/SubmitConfirmationModal';
import QuizNavigation from '../../components/quiz-attempt/QuizNavigation';
import UnansweredWarningBanner from '../../components/quiz-attempt/UnansweredWarningBanner';

const AUTOSAVE_KEY = (quizId) => `quiz_autosave_${quizId}`;

export default function QuizAttempt() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const topRef = useRef(null);

  // --- STATE MANAGEMENT ---
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quiz State
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // Object { questionIndex: answerIndex }
  const [timeLeft, setTimeLeft] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Refs for timing
  const startedAtRef = useRef(null);
  const timerRef = useRef(null);

  const total = quiz?.questions?.length || 0;

  // Create Mock Quiz if none found
  const mockQuiz = useMemo(() => ({
    _id: 'mock-1',
    title: 'Frontend Interview Mock',
    topic: 'React',
    timeLimit: 1200,
    questions: Array.from({ length: 10 }).map((_, i) => ({
      _id: `q${i}`,
      question: `Question ${i + 1}: What is the primary purpose of the useEffect hook in React?`,
      options: [
        'To perform side effects in functional components',
        'To manage global state across the application',
        'To style components using inline CSS',
        'To increment performance of list rendering'
      ],
      type: 'mcq',
      marks: 1
    }))
  }), []);

  // --- EFFECTS ---

  // 1. Load Quiz
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        let q;
        if (quizId === 'mock-1' || quizId === 'demo') {
          await new Promise(r => setTimeout(r, 800));
          q = mockQuiz;
        } else {
          try {
            const res = await quizService.getQuiz(quizId);
            q = res?.quiz || res;
          } catch (e) {
            console.warn("Backend failed, falling back to mock data");
            q = mockQuiz;
          }
        }

        if (cancelled) return;
        setQuiz(q);

        const baseTime = q?.timeLimit || (q?.questions?.length || 10) * 60;
        const saved = localStorage.getItem(AUTOSAVE_KEY(quizId));
        if (saved) {
          try {
            const obj = JSON.parse(saved);
            setAnswers(obj.answers || {});
            setCurrent(obj.current || 0);
            if (typeof obj.timeLeft === 'number') setTimeLeft(obj.timeLeft);
            else setTimeLeft(baseTime);
          } catch {
            setTimeLeft(baseTime);
          }
        } else {
          setTimeLeft(baseTime);
        }
        startedAtRef.current = Date.now();
      } catch (err) {
        if (cancelled) return;
        setError('Failed to load quiz content.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (quizId) load();
    return () => { cancelled = true; };
  }, [quizId, mockQuiz]);

  // 2. Timer Logic
  useEffect(() => {
    if (timeLeft == null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit({ auto: true });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft != null]);

  // 3. Autosave
  useEffect(() => {
    const iv = setInterval(() => {
      if (!quizId) return;
      const payload = { answers, current, timeLeft };
      try { localStorage.setItem(AUTOSAVE_KEY(quizId), JSON.stringify(payload)); } catch { };
    }, 5000);
    return () => clearInterval(iv);
  }, [answers, current, timeLeft, quizId]);

  // 4. Before Unload Warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (quiz && !loading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [quiz, loading]);

  // 5. Auto Scroll on Question Change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [current]);

  // --- HANDLERS ---
  const selectAnswer = useCallback((idx) => {
    setAnswers((a) => ({ ...a, [current]: idx }));
  }, [current]);

  const goto = (idx) => {
    if (idx < 0 || idx >= total) return;
    setCurrent(idx);
  };

  const handleSubmit = async ({ auto = false } = {}) => {
    if (!quiz) return;
    setLoading(true);
    setShowConfirmModal(false);
    try {
      const timeTaken = Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000));
      if (quiz._id === 'mock-1') {
        navigate('/dashboard/quiz');
        return;
      }
      const res = await quizService.submitQuiz(quizId, { answers, timeTaken, auto });
      try { localStorage.removeItem(AUTOSAVE_KEY(quizId)); } catch { }
      navigate(`/dashboard/quizzes/result/${quizId}`, { state: { result: res?.result || res, quiz, answers } });
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      setLoading(false);
    }
  };

  // --- DERIVED STATE ---
  const currentQuestion = useMemo(() => quiz?.questions?.[current] || null, [quiz, current]);
  const answeredCount = Object.keys(answers).length;
  const timerWarning = timeLeft <= 300; // 5 minutes
  const isLast = current === total - 1;
  const isAnswered = answers[current] !== undefined;
  const unansweredCount = total - answeredCount;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="max-w-md p-8 text-center animate-scale-in">
          <AlertCircle size={48} className="mx-auto text-error mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-neutral-500 mb-6">{error || 'Quiz session not found'}</p>
          <Button onClick={() => navigate('/dashboard/quizzes')} fullWidth>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900" ref={topRef}>
      {/* HEADER: Production Grade Distraction Free */}
      <header className="bg-white border-b border-neutral-200 fixed top-0 inset-x-0 z-40 h-16 flex items-center shadow-sm">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { if (window.confirm('Quit exam? Progress will be lost.')) navigate('/dashboard/quizzes'); }}
              className="text-neutral-500 hover:text-error font-medium"
            >
              <X size={18} className="mr-2" /> <span className="hidden md:inline">Exit Exam</span>
            </Button>
            <div className="hidden lg:block h-6 w-px bg-neutral-200 mx-2" />
            <span className="hidden lg:block font-bold text-neutral-800 truncate max-w-[240px]">
              {quiz.title}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center flex-1">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-mono font-bold text-base tabular-nums border transition-all ${timerWarning
                ? 'bg-error/10 text-error border-error/20 animate-pulse ring-2 ring-error/5'
                : 'bg-neutral-100 text-neutral-700 border-neutral-200'
              }`}>
              <Clock size={16} />
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 flex-1">
            <div className="text-right hidden sm:block">
              <MetaText className="uppercase font-bold tracking-wider">Overall Progress</MetaText>
              <div className="text-sm font-bold text-primary-600">
                Question {current + 1} <span className="text-neutral-300">/</span> {total}
              </div>
            </div>
          </div>
        </Container>
        {/* Progress Bar Top */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-100">
          <div
            className="h-full bg-primary-600 transition-all duration-300 ease-out shadow-[0_0_8px_rgba(79,70,229,0.4)]"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </header>

      {/* WARNING BANNER */}
      <UnansweredWarningBanner count={unansweredCount} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 pt-24 pb-28">
        <Container className="flex flex-col md:flex-row gap-8">

          {/* LEFT: Question Content */}
          <div className="flex-1 min-w-0">
            <Card className="p-8 md:p-12 border-none shadow-premium min-h-[520px] flex flex-col relative animate-slide-up">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-600 text-[11px] font-bold uppercase tracking-widest border border-neutral-200">
                  Question {current + 1}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 leading-tight mb-12">
                {currentQuestion.question}
              </h2>

              <div className="space-y-4">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = answers[current] === idx;
                  const letter = String.fromCharCode(65 + idx);

                  return (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(idx)}
                      className={`w-full group text-left cursor-pointer p-5 rounded-md border-2 transition-all duration-200 flex items-center gap-5 ${isSelected
                          ? 'border-primary-600 bg-primary-50/50 shadow-md ring-4 ring-primary-500/5'
                          : 'border-neutral-100 bg-white hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.99]'
                        }`}
                    >
                      <div className={`w-9 h-9 rounded-md border flex items-center justify-center flex-shrink-0 transition-all font-bold text-sm ${isSelected
                          ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                          : 'border-neutral-200 text-neutral-400 group-hover:border-neutral-400 group-hover:text-neutral-600'
                        }`}>
                        {letter}
                      </div>
                      <span className={`text-lg font-medium ${isSelected ? 'text-primary-900' : 'text-neutral-700'}`}>
                        {opt}
                      </span>
                      {isSelected && <CheckCircle2 size={24} className="ml-auto text-primary-600 animate-fade-in" />}
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* RIGHT SIDEBAR: Palette & Info */}
          <div className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <Card className="p-6 border-none shadow-premium">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-neutral-800 flex items-center gap-2">
                    <LayoutGrid size={18} className="text-neutral-400" /> Question Map
                  </h3>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-6">
                  {Array.from({ length: total }).map((_, i) => {
                    const isCurrent = i === current;
                    const isAns = answers[i] !== undefined;

                    let btnClass = "bg-neutral-100 text-neutral-400 hover:bg-neutral-200 border-transparent";
                    if (isAns) btnClass = "bg-primary-50 text-primary-600 font-bold border-primary-100";
                    if (isCurrent) btnClass = "bg-primary-600 text-white font-bold ring-4 ring-primary-500/20 shadow-md transform scale-110 border-transparent pointer-events-none";

                    return (
                      <button
                        key={i}
                        onClick={() => goto(i)}
                        className={`h-10 w-10 rounded-md text-xs flex items-center justify-center transition-all border ${btnClass}`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>Answered:</span>
                    <span className="font-bold text-neutral-900">{answeredCount}/{total}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-success transition-all duration-300" style={{ width: `${(answeredCount / total) * 100}%` }} />
                  </div>
                </div>
              </Card>

              {/* Tips Card */}
              <div className="p-5 bg-neutral-900 rounded-md text-white shadow-xl">
                <p className="text-xs font-bold text-neutral-500 uppercase mb-3">Quick Shortcut</p>
                <p className="text-sm leading-relaxed text-neutral-300">
                  Use <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700 text-white inline-block mx-0.5">←</kbd> and
                  <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700 text-white inline-block mx-0.5">→</kbd> keys for fast navigation between questions.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* FIXED FOOTER NAVIGATION: Consistent & Bold */}
      <QuizNavigation
        current={current}
        total={total}
        onNext={() => goto(current + 1)}
        onPrev={() => goto(current - 1)}
        onSubmit={() => setShowConfirmModal(true)}
        isAnswered={isAnswered}
        isLast={isLast}
      />

      {/* CONFIRM MODAL */}
      <SubmitConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => handleSubmit()}
        unansweredCount={unansweredCount}
        title={quiz.title}
      />
    </div>
  );
}

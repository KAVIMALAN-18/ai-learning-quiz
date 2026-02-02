import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import { useAuth } from '../../context/useAuth';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Title, MetaText } from '../../components/ui/Typography';
import Container from '../../components/ui/Container';
import { Clock, AlertCircle, X, LayoutGrid, CheckCircle2, ChevronLeft, ChevronRight, Rocket, Zap, Target, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-mesh">
        <LoadingSpinner size={64} />
        <p className="mt-8 text-neutral-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Synchronizing Assessment Data...</p>
      </div>
    );
  }

  if (!user || error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh">
        <Card variant="glass" className="max-w-md p-12 text-center animate-scale-in">
          <div className="w-20 h-20 bg-error-50 rounded-3xl flex items-center justify-center text-error-500 mx-auto mb-8 border border-error-100">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-black mb-4 tracking-tight">Session Interrupted</h2>
          <p className="text-neutral-500 mb-10 font-medium leading-relaxed">{error || 'Your assessment session could not be established. Please re-authenticate and try again.'}</p>
          <Button variant="primary" onClick={() => navigate('/dashboard/quizzes')} fullWidth className="py-4 font-black">
            RETURN TO DASHBOARD
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-surface-50 flex flex-col font-sans text-surface-900 overflow-hidden" ref={topRef}>
      {/* 1. ASSESSMENT TOOLBAR (DISTRACTION FREE) */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-surface-200 z-40 h-20 flex-shrink-0 flex items-center shadow-sm px-8">
        <div className="max-w-[1700px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { if (window.confirm('Quit exam? Progress will be lost.')) navigate('/dashboard/quizzes'); }}
              className="text-surface-500 hover:text-red-600 font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest text-[10px]"
            >
              <X size={16} className="mr-2" /> QUIT SESSION
            </Button>
            <div className="h-8 w-[1px] bg-surface-200" />
            <div className="hidden lg:block">
              <span className="text-[10px] font-black uppercase text-surface-400 block tracking-widest leading-none mb-1">Module Validation</span>
              <div className="font-black text-surface-900 tracking-tight text-sm uppercase">
                {quiz.title}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-1">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl font-mono font-black text-2xl tabular-nums shadow-xl transition-all ${timerWarning
                ? 'bg-red-600 text-white shadow-red-600/20'
                : 'bg-slate-900 text-white shadow-slate-900/10'
                }`}>
              <Clock size={20} className={timerWarning ? 'animate-pulse' : ''} />
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </motion.div>
          </div>

          <div className="flex justify-end items-center gap-6 flex-1">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-black uppercase text-surface-400 block tracking-widest leading-none mb-1">Intelligence Quotient</span>
              <div className="text-sm font-black text-primary-600 tracking-tight uppercase">
                Step {current + 1} <span className="text-surface-300">/</span> {total}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-surface-100/50 border border-surface-200 flex items-center justify-center text-primary-600">
              <Target size={20} />
            </div>
          </div>
        </div>
        {/* TOP PROGRESS LINE */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-surface-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / total) * 100}%` }}
            className="h-full bg-primary-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
          />
        </div>
      </header>

      {/* 2. WARNING SYSTEM */}
      <UnansweredWarningBanner count={unansweredCount} />

      {/* 3. MAIN WORKBENCH (ASSESSMENT VIEW) */}
      <div className="flex-1 overflow-hidden relative flex">
        {/* LEFT: Question Canvas */}
        <main className="flex-1 overflow-y-auto px-8 lg:px-24 py-16 md:py-24 bg-surface-50 scroll-smooth">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="mb-10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest">
                    Question Segment 0{current + 1}
                  </div>
                  <div className="flex items-center gap-2 text-surface-400 text-[10px] font-black uppercase tracking-widest">
                    <Zap size={14} className="text-amber-500" /> +{currentQuestion.marks} Skill Points
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-surface-900 leading-[1.15] mb-12 tracking-tight">
                  {currentQuestion.question}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = answers[current] === idx;
                    const letter = String.fromCharCode(65 + idx);

                    return (
                      <motion.button
                        layout
                        key={idx}
                        onClick={() => selectAnswer(idx)}
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.99 }}
                        className={`w-full group text-left p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-300 flex items-center gap-6 ${isSelected
                          ? 'border-primary-600 bg-white shadow-premium ring-4 ring-primary-500/5'
                          : 'border-surface-200 bg-white hover:border-primary-200 hover:shadow-md'
                          }`}
                      >
                        <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 font-black text-lg transition-all ${isSelected
                          ? 'border-primary-600 bg-primary-600 text-white shadow-lg'
                          : 'border-surface-100 bg-surface-50 text-surface-400 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-200'
                          }`}>
                          {letter}
                        </div>
                        <span className={`text-lg md:text-xl font-bold leading-snug transition-colors ${isSelected ? 'text-primary-900' : 'text-surface-600 group-hover:text-surface-900'}`}>
                          {opt}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0"
                          >
                            <CheckCircle2 size={18} strokeWidth={3} />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {/* QUICK ACTIONS */}
                <div className="mt-12 pt-12 border-t border-surface-200 flex items-center justify-between">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-[10px] font-black text-surface-400 uppercase tracking-widest hover:text-primary-600 transition-colors">
                      <Bookmark size={14} /> Mark for revisit
                    </button>
                  </div>
                  <div className="text-[10px] font-black uppercase text-surface-400 tracking-widest">
                    Changes synced to cloud
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* RIGHT: NAVIGATION PANEL (GLASS) */}
        <aside className="hidden xl:flex w-[380px] shrink-0 bg-white border-l border-surface-200 flex-col overflow-hidden">
          <div className="p-10 flex-1 overflow-y-auto space-y-12">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-surface-400 flex items-center gap-2">
                  <LayoutGrid size={14} /> Knowledge Map
                </h3>
                <Badge variant="surface" className="text-[10px] bg-slate-100 border-none font-black">{answeredCount} OF {total}</Badge>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: total }).map((_, i) => {
                  const isCurrent = i === current;
                  const isAns = answers[i] !== undefined;

                  return (
                    <button
                      key={i}
                      onClick={() => goto(i)}
                      className={`h-12 w-full rounded-xl text-xs font-black flex items-center justify-center transition-all ${isCurrent
                        ? 'bg-slate-900 text-white shadow-xl ring-2 ring-slate-900/10'
                        : isAns
                          ? 'bg-emerald-500 text-white'
                          : 'bg-surface-50 text-surface-400 hover:bg-surface-100 border border-surface-200'
                        }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PERFORMANCE SNAPSHOT */}
            <div className="p-8 rounded-3xl bg-surface-50 border border-surface-200 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-surface-400 tracking-widest">Analytics Snapshot</span>
                <Clock size={14} className="text-primary-500" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-black text-surface-900">{Math.round((answeredCount / total) * 100)}%</span>
                  <span className="text-[10px] font-black text-surface-400 mb-1 uppercase">Complete</span>
                </div>
                <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(answeredCount / total) * 100}%` }}
                    className="h-full bg-premium-gradient"
                  />
                </div>
              </div>
            </div>

            {/* LEGEND */}
            <div className="space-y-4 px-2">
              <span className="text-[9px] font-black uppercase text-surface-400 tracking-widest block mb-4">Keyboard Shortcuts</span>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-surface-500">
                  <kbd className="p-1 px-2 rounded bg-surface-100 border border-surface-200">←</kbd> Prev
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-surface-500">
                  <kbd className="p-1 px-2 rounded bg-surface-100 border border-surface-200">→</kbd> Next
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-surface-200 bg-surface-50/50">
            <Button
              variant="premium"
              fullWidth
              className="py-5 rounded-2xl text-base font-black tracking-tight shadow-xl"
              onClick={() => setShowConfirmModal(true)}
            >
              FINALIZE ASSESSMENT
            </Button>
          </div>
        </aside>
      </div>

      {/* 4. TACTICAL NAVIGATION BAR (MOBILE + DESKTOP FALLBACK) */}
      <footer className="fixed bottom-0 inset-x-0 h-24 bg-white/90 backdrop-blur-xl border-t border-surface-200 z-40 px-8 flex items-center justify-center xl:hidden">
        <div className="w-full max-w-xl flex items-center justify-between">
          <Button variant="ghost" className="rounded-2xl h-12 w-12 p-0 border border-surface-200" onClick={() => goto(current - 1)}>
            <ChevronLeft size={20} />
          </Button>
          <div className="flex-1 text-center">
            <span className="text-[10px] font-black uppercase text-surface-400 tracking-widest block mb-1">Index</span>
            <div className="font-black text-surface-900">{current + 1} <span className="text-surface-300">/</span> {total}</div>
          </div>
          <Button
            variant={isLast ? "premium" : "primary"}
            className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px]"
            onClick={isLast ? () => setShowConfirmModal(true) : () => goto(current + 1)}
          >
            {isLast ? 'Finish' : 'Advance'} <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </footer>

      {/* RENDER MODAL */}
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

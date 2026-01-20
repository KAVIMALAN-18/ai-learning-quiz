import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import { useAuth } from '../../context/useAuth';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import QuestionNavigator from '../../components/quiz/QuestionNavigator';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const AUTOSAVE_KEY = (quizId) => `quiz_autosave_${quizId}`;

export default function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [warnUnanswered, setWarnUnanswered] = useState(false);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(null);
  const startedAtRef = useRef(null);
  const timerRef = useRef(null);
  const warningShownRef = useRef(false);

  const total = quiz?.questions?.length || 0;

  // load quiz
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await quizService.getQuiz(quizId);
        if (cancelled) return;
        const q = res?.quiz || res;
        setQuiz(q);

        // start timer
        const baseTime = q?.timeLimit || (q?.questions?.length || 10) * 30;
        // if there is saved progress, try to restore
        const saved = localStorage.getItem(AUTOSAVE_KEY(quizId));
        if (saved) {
          try {
            const obj = JSON.parse(saved);
            setAnswers(obj.answers || {});
            setCurrent(obj.current || 0);
            // if saved timeLeft provided, use it
            if (typeof obj.timeLeft === 'number') setTimeLeft(obj.timeLeft);
            else setTimeLeft(baseTime);
          } catch (e) {
            setTimeLeft(baseTime);
          }
        } else {
          setTimeLeft(baseTime);
        }
        startedAtRef.current = Date.now();
      } catch (err) {
        if (cancelled) return;
        setError('Failed to load quiz.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (quizId) load();
    return () => { cancelled = true; };
  }, [quizId]);

  // timer
  useEffect(() => {
    if (timeLeft == null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft != null]);

  // warning when time almost out
  useEffect(() => {
    if (timeLeft != null && timeLeft <= 30 && !warningShownRef.current) {
      warningShownRef.current = true;
      // subtle UI cue - we could show a toast or banner; for now the timer bar will change color
    }
  }, [timeLeft]);

  // Autosave to localStorage every 5 seconds
  useEffect(() => {
    const iv = setInterval(() => {
      if (!quizId) return;
      const payload = { answers, current, timeLeft };
      try { localStorage.setItem(AUTOSAVE_KEY(quizId), JSON.stringify(payload)); } catch {};
    }, 5000);
    return () => clearInterval(iv);
  }, [answers, current, timeLeft, quizId]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (!quiz) return;
      if (e.key === 'ArrowRight') setCurrent((c) => Math.min(c + 1, total - 1));
      if (e.key === 'ArrowLeft') setCurrent((c) => Math.max(c - 1, 0));
      // number keys 1..9 for option selection
      if (/^[1-9]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        const opts = quiz.questions?.[current]?.options || [];
        if (idx < opts.length) setAnswers((a) => ({ ...a, [current]: idx }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [quiz, current, total]);

  const currentQuestion = useMemo(() => quiz?.questions?.[current] || null, [quiz, current]);

  const selectAnswer = useCallback((idx) => {
    setAnswers((a) => ({ ...a, [current]: idx }));
  }, [current]);

  const goto = (idx) => {
    if (idx < 0 || idx >= total) return;
    setCurrent(idx);
  };

  const handleAutoSubmit = async () => {
    // call same submit flow but indicate auto-submission
    await submitQuiz({ auto: true });
  };

  const submitQuiz = async ({ auto = false } = {}) => {
    if (!quiz) return;
    setLoading(true);
    try {
      const timeTaken = Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000));
      const payload = { answers, timeTaken, auto };
      const res = await quizService.submitQuiz(quizId, payload);
      // clear autosave
      try { localStorage.removeItem(AUTOSAVE_KEY(quizId)); } catch {}
      navigate(`/dashboard/quiz/result/${quizId}`, { state: { result: res?.result || res } });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <div className="p-8"><LoadingSpinner /></div>;
  if (!user) return <div className="p-8 text-center">Please login to take the quiz.</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!quiz) return <div className="p-8 text-center">Quiz not found.</div>;

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left navigator */}
      <div className="col-span-12 lg:col-span-3">
        <div className="sticky top-20 bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-2">Questions</div>
          <QuestionNavigator total={total} current={current} answers={answers} onJump={goto} />
          <div className="mt-4 text-xs text-gray-500">Answered: {Object.keys(answers).length} / {total}</div>
        </div>
      </div>

      {/* Main panel */}
      <div className="col-span-12 lg:col-span-6">
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{quiz.title || 'AI Quiz'}</div>
              <div className="text-xs text-gray-400">{quiz.topic} • {quiz.difficulty}</div>
            </div>
            <div className="text-sm font-medium">{current + 1} / {total}</div>
          </div>

          <div className="transition space-y-4">
            <div className="text-lg font-semibold">{currentQuestion.question}</div>
            <div className="grid gap-3">
              {currentQuestion.options.map((opt, i) => (
                <button key={i} onClick={() => selectAnswer(i)} className={`text-left p-3 border rounded text-sm ${answers[current] === i ? 'bg-indigo-50 border-indigo-300' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center text-sm">{String.fromCharCode(65 + i)}</div>
                    <div>{opt}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button onClick={() => goto(current - 1)} disabled={current === 0} className="px-3 py-2 bg-gray-100 rounded">Previous</button>
              <button onClick={() => goto(current + 1)} disabled={current + 1 >= total} className="px-3 py-2 bg-gray-100 rounded">Next</button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { try { localStorage.setItem(AUTOSAVE_KEY(quizId), JSON.stringify({ answers, current, timeLeft })); } catch {} }} className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded">Save</button>
              <button onClick={() => submitQuiz()} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: timer & metadata */}
      <div className="col-span-12 lg:col-span-3">
        <div className="sticky top-20 space-y-4">
          <div className={`bg-white border rounded-lg p-4 ${timeLeft <= 30 ? 'ring-2 ring-red-100' : ''}`}>
            <div className="text-sm text-gray-500">Time Remaining</div>
            <div className={`text-2xl font-mono mt-2 ${timeLeft <= 30 ? 'text-red-600' : 'text-gray-900'}`}>{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div>
            <div className="mt-3 text-xs text-gray-500">Auto-submit when time ends</div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="text-sm text-gray-500">Quiz Summary</div>
            <div className="mt-2 text-sm">{total} questions • {quiz.timeLimit ? `${Math.floor(quiz.timeLimit/60)}m` : 'Auto time'}</div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-2">Actions</div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { localStorage.removeItem(AUTOSAVE_KEY(quizId)); navigate('/dashboard/quiz'); }} className="px-3 py-2 bg-gray-100 rounded">Exit</button>
              <button onClick={() => submitQuiz({ auto: false })} className="px-3 py-2 bg-indigo-600 text-white rounded">Submit & Grade</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

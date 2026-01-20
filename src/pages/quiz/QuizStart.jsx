import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import { useAuth } from '../../context/useAuth';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function QuizStart() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const topics = useMemo(() => (user?.goals?.length ? user.goals : ['Algorithms', 'Data Structures', 'System Design', 'Machine Learning']), [user]);

  const [topic, setTopic] = useState(topics[0]);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [count, setCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(600); // seconds
  const [timeMode, setTimeMode] = useState('auto'); // auto/manual
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (topics && topics.length && !topic) setTopic(topics[0]);
  }, [topics]);

  const canStart = !!topic && !!difficulty && count > 0 && (timeMode === 'auto' || timeLimit > 30);

  const handleStart = async () => {
    if (!canStart) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        topic,
        difficulty,
        count,
        timeLimit: timeMode === 'auto' ? null : timeLimit,
        options: { aiMode: 'gemini' },
      };
      const res = await quizService.generateQuiz(payload);
      const quizId = res?.quizId || res?.id || res?._id;
      if (!quizId) throw new Error('Server did not return quiz id');
      navigate(`/dashboard/quiz/attempt/${quizId}`);
    } catch (err) {
      setError(err?.message || 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="p-6"><LoadingSpinner /></div>;
  if (!user) return <div className="p-6 text-center">Please login to configure a quiz.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Configure Quiz</h1>
        <div className="text-sm text-gray-500">AI Mode: <span className="text-indigo-600 font-medium">Gemini</span></div>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Topic</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-2 w-full border rounded px-3 py-2">
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Difficulty</label>
          <div className="mt-2 flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button key={d} onClick={() => setDifficulty(d)} className={`px-3 py-1 rounded border ${difficulty === d ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Number of Questions: <span className="font-medium">{count}</span></label>
          <input type="range" min="5" max="30" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full mt-2" />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Time Limit</label>
          <div className="mt-2 flex items-center gap-3">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="timemode" checked={timeMode === 'auto'} onChange={() => setTimeMode('auto')} />
              <span className="text-sm">Auto (recommended)</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="timemode" checked={timeMode === 'manual'} onChange={() => setTimeMode('manual')} />
              <span className="text-sm">Manual</span>
            </label>
          </div>
          {timeMode === 'manual' && (
            <div className="mt-2 flex items-center gap-2">
              <input type="number" min={30} value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="w-32 border rounded px-2 py-1" />
              <span className="text-sm text-gray-600">seconds</span>
            </div>
          )}
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Tip: Use AI-generated quizzes for quick practice.</div>
          <div>
            <button onClick={() => navigate('/dashboard/quiz')} className="px-3 py-2 mr-2 bg-gray-100 rounded">Cancel</button>
            <button disabled={!canStart || loading} onClick={handleStart} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">
              {loading ? 'Starting…' : 'Start Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

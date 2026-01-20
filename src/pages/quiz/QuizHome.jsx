import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import quizService from '../../services/quiz.service';

export default function QuizHome() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [count, setCount] = useState(5);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState('');

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!user) return <div className="p-8 text-center">Please login to use quizzes.</div>;

  const goals = [
    ...(Array.isArray(user.learningGoals) ? user.learningGoals : []),
    ...(Array.isArray(user.customGoals) ? user.customGoals : []),
  ];

  const startQuiz = async () => {
    if (!topic) {
      setError('Please select a topic');
      return;
    }
    setError('');
    setLoadingCreate(true);
    try {
      const { quizId } = await quizService.generateQuiz({ topic, difficulty, count });
      navigate(`/dashboard/quiz/${quizId}`);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to start quiz');
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Start a Quiz</h2>
      <p className="text-sm text-gray-600 mb-6">Create a short AI-generated quiz based on your learning goals.</p>

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Topic</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-2 w-full border rounded px-3 py-2">
            <option value="">Select a topic</option>
            {goals.length === 0 && <option value="general">General Programming</option>}
            {goals.map((g, i) => (
              <option key={i} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium">Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mt-2 w-full border rounded px-3 py-2">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Questions</label>
            <input type="number" value={count} min={3} max={20} onChange={(e) => setCount(Number(e.target.value))} className="mt-2 w-full border rounded px-3 py-2" />
          </div>

          <div className="flex items-end">
            <button onClick={startQuiz} disabled={loadingCreate} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md">
              {loadingCreate ? 'Starting…' : 'Start Quiz'}
            </button>
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    </div>
  );
}

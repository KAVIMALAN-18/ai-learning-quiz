import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import { useAuth } from '../../context/useAuth';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
export default function QuizOverview() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [ongoing, setOngoing] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [ongoingRes, recentRes] = await Promise.all([
          quizService.getOngoing().catch(() => null),
          quizService.listRecent(6).catch(() => []),
        ]);
        if (cancelled) return;
        setOngoing(ongoingRes?.quiz || ongoingRes || null);
        setRecent(Array.isArray(recentRes) ? recentRes : recentRes?.quizzes || []);
      } catch (err) {
        if (cancelled) return;
        setError('Failed to load quizzes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (authLoading || loading) return <div className="p-8"><LoadingSpinner /></div>;
  if (!user) return <div className="p-8 text-center">Please login to view quizzes.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quizzes</h1>
        <div>
          <Button onClick={() => navigate('/dashboard/quiz/start')}>Start New Quiz</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-1">
          <Card>
            <h3 className="text-sm text-gray-500">Continue</h3>
            {ongoing ? (
              <div className="mt-3">
                <div className="font-medium">{ongoing.title || 'Ongoing Quiz'}</div>
                <div className="text-sm text-gray-600 mt-1">{ongoing.questions?.length || 0} questions</div>
                <div className="mt-3 flex gap-2">
                  <Button variant="ghost" onClick={() => navigate(`/dashboard/quiz/attempt/${ongoing._id || ongoing.id}`)}>Continue</Button>
                  <Button variant="ghost" onClick={() => navigate('/dashboard/quiz/start')}>Start New</Button>
                </div>
                <div className="mt-3 text-sm text-gray-500">Last attempt: {ongoing.lastAttempt ? new Date(ongoing.lastAttempt).toLocaleString() : '—'}</div>
                <div className="text-sm text-gray-500">Status: {ongoing.status || 'In Progress'}</div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-gray-600">No ongoing quizzes. Start a new one.</div>
            )}
          </Card>
        </div>

        <div className="col-span-2">
          <Card>
            <h3 className="text-sm text-gray-500">Recent Activity</h3>
            <div className="mt-3 space-y-3">
              {recent.length === 0 && <div className="text-sm text-gray-600">No recent attempts. Your completed quizzes will appear here.</div>}
              {recent.map((r) => (
                <div key={r._id || r.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition">
                  <div>
                    <div className="font-medium">{r.title || 'Quiz'}</div>
                    <div className="text-sm text-gray-500">{r.score} / {r.total} • {r.difficulty}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{r.scorePercent ? `${r.scorePercent}%` : r.total ? `${Math.round((r.score/r.total)*100)}%` : '—'}</div>
                    <div className="text-xs text-gray-500">{new Date(r.takenAt || r.updatedAt || r.createdAt || Date.now()).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="text-sm text-gray-500">Start New</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="col-span-2">
            <div className="font-medium">Create a custom quiz</div>
            <div className="text-sm text-gray-600">Pick a topic, difficulty and time limit for an AI-generated quiz.</div>
          </div>
          <div className="flex items-center justify-end">
            <Button onClick={() => navigate('/dashboard/quiz/start')}>Configure</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

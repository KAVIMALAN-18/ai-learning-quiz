import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import quizService from '../../services/quiz.service';
import { Card } from '../../components/ui/Card';
import { Title, BodyText, Label } from '../../components/ui/Typography';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { Calendar, Target, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardQuiz() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await quizService.getHistory(20);
        setHistory(res.attempts || []);
      } catch (err) {
        console.error("Failed to load quiz history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card className="p-8 space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </Card>
      </div>
    );
  }

  if (!user) return (
    <div className="p-8 text-center bg-white border rounded-xl shadow-sm">
      <Title className="text-neutral-400">Session Expired</Title>
      <BodyText className="mt-2">Please login to view your quiz history.</BodyText>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <div>
        <Label className="text-primary-600 block mb-2 uppercase tracking-widest font-bold">Assessments</Label>
        <Title className="text-4xl">Quiz History</Title>
        <BodyText className="mt-2 text-neutral-500">Track your performance across all AI-generated technical quizzes.</BodyText>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.length > 0 ? (
          history.map((attempt) => (
            <Card
              key={attempt.attemptId}
              className="p-6 hover:shadow-xl transition-all cursor-pointer group border-neutral-100"
              onClick={() => navigate(`/dashboard/quizzes/result/${attempt.attemptId}`)}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                      {attempt.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(attempt.submittedAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {new Date(attempt.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 self-end md:self-auto">
                  <div className="text-right">
                    <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">Score</div>
                    <div className={`text-2xl font-black ${attempt.score >= 80 ? 'text-success' : attempt.score >= 60 ? 'text-warning' : 'text-error'}`}>
                      {attempt.score}%
                    </div>
                  </div>
                  <Badge variant={attempt.score >= 60 ? 'success' : 'error'} className="h-fit">
                    {attempt.score >= 60 ? <Award size={12} className="mr-1" /> : null}
                    {attempt.score >= 60 ? 'Passed' : 'Failed'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center bg-white border border-dashed rounded-2xl border-neutral-200">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-300">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">No quizzes attempted yet</h3>
            <p className="text-neutral-500 mt-2 max-w-sm mx-auto">Complete your first AI-generated quiz to see your performance metrics here.</p>
            <button
              onClick={() => navigate('/dashboard/quizzes/new')}
              className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors"
            >
              Take a Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import quizService from '../../services/quiz.service';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Title, BodyText, SectionHeader } from '../../components/ui/Typography';
import Container from '../../components/ui/Container';
import { BrainCircuit, Loader2, Target, AlertCircle } from 'lucide-react';

export default function QuizHome() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [count, setCount] = useState(5);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!user) return (
    <Container className="py-20 text-center">
      <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
      <Title>Access Denied</Title>
      <BodyText className="mt-2">Please login to access personalized quizzes.</BodyText>
      <Button onClick={() => navigate('/login')} className="mt-6">Login Now</Button>
    </Container>
  );

  const goals = [
    ...(Array.isArray(user.learningGoals) ? user.learningGoals : []),
    ...(Array.isArray(user.customGoals) ? user.customGoals : []),
  ];

  const startQuiz = async () => {
    if (!topic) {
      setError('Please select a topic to begin.');
      return;
    }
    setError('');
    setLoadingCreate(true);
    try {
      const { quizId } = await quizService.generateQuiz({ topic, difficulty, count });
      navigate(`/dashboard/quiz/${quizId}`);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <Container className="py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
            <BrainCircuit size={24} />
          </div>
          <Title>Practice Quizzes</Title>
        </div>
        <BodyText className="mb-8">
          Hone your skills with AI-generated assessments tailored to your learning goals and progress.
        </BodyText>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Config Card */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <SectionHeader className="mt-0 mb-6">Quiz Configuration</SectionHeader>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Learning Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select a topic from your roadmap</option>
                    {goals.length === 0 && <option value="general">General Programming</option>}
                    {goals.map((g, i) => (
                      <option key={i} value={g}>{g}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-neutral-500">
                    You can add more topics in your Learning Roadmap.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      value={count}
                      min={3}
                      max={20}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-error/10 text-error rounded-md text-sm font-medium">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    onClick={startQuiz}
                    disabled={loadingCreate}
                    fullWidth
                    size="lg"
                    className="py-6 text-lg"
                  >
                    {loadingCreate ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Generating Assessment...
                      </span>
                    ) : (
                      'Generate & Start Quiz'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Info / Tips */}
          <div className="space-y-6">
            <Card className="p-6 bg-primary-50 border-none">
              <div className="flex items-center gap-2 mb-4 text-primary-700">
                <Target size={20} />
                <h3 className="font-bold">Exam Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-primary-900/80">
                <li className="flex gap-2">• <span>Quizzes are timed based on complexity.</span></li>
                <li className="flex gap-2">• <span>Ensure a stable connection before starting.</span></li>
                <li className="flex gap-2">• <span>Submit only after reviewing all questions.</span></li>
                <li className="flex gap-2">• <span>Results are added to your performance analytics.</span></li>
              </ul>
            </Card>

            <div className="p-6 bg-neutral-900 rounded-md text-white">
              <h4 className="font-bold mb-2">Need Help?</h4>
              <p className="text-sm text-neutral-400 mb-4">
                Chat with our AI Tutor to clarify any concepts before the quiz.
              </p>
              <Button variant="outline" fullWidth onClick={() => navigate('/dashboard/chat')} className="border-neutral-700 text-white hover:bg-neutral-800">
                Open AI Tutor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

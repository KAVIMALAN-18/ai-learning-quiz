import React from 'react';
import Container from '../../components/ui/Container';
import { Title, BodyText } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { BookOpen, Target, TrendingUp, Clock } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import AccuracyChart from '../../components/analytics/AccuracyChart';
import ScoreChart from '../../components/analytics/ScoreChart';
import EmptyState from '../../components/ui/EmptyState';

export default function DashboardAnalytics() {
  const {
    progress,
    getAverageScore,
    getAverageAccuracy,
    getAccuracyTrend,
    getScoresByCourse
  } = useProgress();

  const avgScore = getAverageScore();
  const avgAccuracy = getAverageAccuracy();
  const accuracyTrend = getAccuracyTrend();
  const scoresByCourse = getScoresByCourse();
  const hasData = progress.quizScores.length > 0;

  // Format time spent
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Container className="py-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-8">
            <Title className="text-3xl font-bold text-slate-900 mb-2">
              Learning Analytics
            </Title>
            <BodyText className="text-slate-600">
              Track your progress and performance across all courses
            </BodyText>
          </div>

          {hasData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 border border-blue-100 bg-blue-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {progress.completedCourses.length}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">Courses Completed</p>
                </Card>

                <Card className="p-6 border border-green-100 bg-green-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {avgScore}%
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">Average Score</p>
                </Card>

                <Card className="p-6 border border-purple-100 bg-purple-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {avgAccuracy}%
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">Accuracy Rate</p>
                </Card>

                <Card className="p-6 border border-orange-100 bg-orange-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {formatTime(progress.timeSpent)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">Study Time</p>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {accuracyTrend.length > 0 && (
                  <AccuracyChart data={accuracyTrend} />
                )}
                {scoresByCourse.length > 0 && (
                  <ScoreChart data={scoresByCourse} />
                )}
              </div>

              {/* AI-Powered Insights Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  AI-Powered Learning Insights
                </h3>

                {(() => {
                  const { getRecommendations } = useProgress();
                  const analysis = getRecommendations();

                  if (!analysis) return null;

                  const { weakAreas, strongAreas, recommendations, readiness } = analysis;

                  return (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {weakAreas.length > 0 && (
                          <div>
                            {React.createElement(require('../../components/ai/WeakAreas').default, { weakAreas })}
                          </div>
                        )}
                        {strongAreas.length > 0 && (
                          <div>
                            {React.createElement(require('../../components/ai/StrengthAreas').default, { strongAreas })}
                          </div>
                        )}
                      </div>

                      {recommendations.length > 0 && (
                        <div>
                          {React.createElement(require('../../components/ai/NextSteps').default, { recommendations })}
                        </div>
                      )}

                      {readiness && readiness.length > 0 && (
                        <div>
                          {React.createElement(require('../../components/ai/ReadinessScore').default, { readinessData: readiness })}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Recent Activity */}
              <Card className="p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Recent Quiz Activity
                </h3>
                <div className="space-y-3">
                  {progress.quizScores.slice(-5).reverse().map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{quiz.courseName}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(quiz.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">{quiz.score}%</p>
                        <p className="text-sm text-slate-500">
                          {quiz.correctAnswers}/{quiz.totalQuestions} correct
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <EmptyState
              icon={TrendingUp}
              title="No Analytics Data Yet"
              description="Complete quizzes and courses to see your learning analytics and progress"
            />
          )}
        </div>
      </Container>
    </div>
  );
}

import React from 'react';
import { Card } from '../ui/Card';
import { Sparkles, TrendingUp, Target, Clock, Brain } from 'lucide-react';
import WeakAreas from './WeakAreas';
import StrengthAreas from './StrengthAreas';
import NextSteps from './NextSteps';
import { useProgress } from '../../context/ProgressContext';
import RecommendationEngine from '../../services/recommendation.service';

export default function LearningAdvisor({ compact = false }) {
    const { progress } = useProgress();

    // Generate recommendations from user data
    const userData = {
        quizResults: progress.quizScores || [],
        courseProgress: {},
        timeSpent: { total: progress.timeSpent || 0 },
        accuracyTrends: progress.accuracyHistory || []
    };

    const analysis = RecommendationEngine.analyzePerformance(userData);
    const {
        weakAreas,
        strongAreas,
        recommendations,
        learningVelocity,
        consistencyScore,
        readiness
    } = analysis;

    const hasData = progress.quizScores?.length > 0;

    if (!hasData) {
        return (
            <Card className="p-8 border-2 border-primary-100 bg-gradient-to-br from-primary-50 to-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                        <Brain className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Your Learning Insights Await
                    </h3>
                    <p className="text-slate-600 mb-6">
                        Complete quizzes to unlock personalized AI-powered recommendations and insights
                    </p>
                </div>
            </Card>
        );
    }

    if (compact) {
        return (
            <Card className="p-6 border-2 border-primary-200 bg-gradient-to-br from-primary-50/50 to-blue-50/30">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">AI Learning Insights</h3>
                        <p className="text-sm text-slate-600">Personalized recommendations for you</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-primary-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase">Velocity</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                            {learningVelocity.velocity >= 0 ? '+' : ''}{learningVelocity.velocity}%
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{learningVelocity.message}</p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase">Consistency</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                            {consistencyScore.score}%
                        </div>
                        <p className="text-xs text-slate-600 mt-1 capitalize">{consistencyScore.level}</p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase">Focus Areas</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                            {weakAreas.length}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">Topics to improve</p>
                    </div>
                </div>

                {recommendations.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-slate-700">Top Recommendations</h4>
                        {recommendations.slice(0, 2).map((rec, idx) => (
                            <div
                                key={idx}
                                className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3"
                            >
                                <div className={`mt-0.5 w-2 h-2 rounded-full ${rec.priority === 'high' ? 'bg-red-500' :
                                        rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 line-clamp-1">{rec.title}</p>
                                    <p className="text-xs text-slate-600 line-clamp-2">{rec.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        );
    }

    // Full view
    return (
        <div className="space-y-6">
            <Card className="p-8 border-2 border-primary-200 bg-gradient-to-br from-primary-50/50 to-blue-50/30">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary-100 rounded-xl">
                            <Sparkles className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Personalized Insights</h2>
                            <p className="text-slate-600">AI-powered learning recommendations</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-primary-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Velocity</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">
                            {learningVelocity.velocity >= 0 ? '+' : ''}{learningVelocity.velocity}%
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                            <div
                                className={`h-full transition-all duration-500 ${learningVelocity.trend === 'accelerating' ? 'bg-green-500' :
                                        learningVelocity.trend === 'improving' ? 'bg-blue-500' :
                                            learningVelocity.trend === 'declining' ? 'bg-red-500' : 'bg-gray-500'
                                    }`}
                                style={{ width: `${Math.min(Math.abs(learningVelocity.velocity) * 3, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-600 leading-tight">{learningVelocity.message}</p>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consistency Score</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">
                            {consistencyScore.score}%
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${consistencyScore.score}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-600 leading-tight capitalize">{consistencyScore.level}</p>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-orange-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Focus Areas</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">
                            {weakAreas.length}
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-orange-500 transition-all duration-500"
                                style={{ width: `${Math.min(weakAreas.length * 20, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-600 leading-tight">Topics needing attention</p>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <Brain className="w-5 h-5 text-green-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mastery Level</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">
                            {strongAreas.length}
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${Math.min(strongAreas.length * 25, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-600 leading-tight">Topics mastered</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {weakAreas.length > 0 && <WeakAreas weakAreas={weakAreas} />}
                {strongAreas.length > 0 && <StrengthAreas strongAreas={strongAreas} />}
            </div>

            {recommendations.length > 0 && <NextSteps recommendations={recommendations} />}
        </div>
    );
}

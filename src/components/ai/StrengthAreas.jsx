import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, Award, Star, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

export default function StrengthAreas({ strongAreas }) {
    if (!strongAreas || strongAreas.length === 0) {
        return null;
    }

    const getLevelColor = (level) => {
        switch (level) {
            case 'expert':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'advanced':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    const getLevelProgress = (level) => {
        switch (level) {
            case 'expert':
                return 100;
            case 'advanced':
                return 75;
            default:
                return 50;
        }
    };

    const getNextLevel = (level) => {
        switch (level) {
            case 'proficient':
                return 'Advanced';
            case 'advanced':
                return 'Expert';
            case 'expert':
                return 'Master';
            default:
                return 'Next Level';
        }
    };

    return (
        <Card className="p-6 border-2 border-green-200 bg-green-50/50">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Your Strengths</h3>
                    <p className="text-sm text-slate-600">Topics where you excel</p>
                </div>
            </div>

            <div className="space-y-3">
                {strongAreas.map((area, index) => (
                    <div
                        key={index}
                        className="p-4 bg-white rounded-xl border border-slate-200 group hover:shadow-md transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-900">{area.topic}</h4>
                                    {area.level === 'expert' && (
                                        <div className="relative">
                                            <Award className="w-5 h-5 text-purple-600 animate-pulse" />
                                            <Star className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500">
                                    {area.attempts} attempt{area.attempts > 1 ? 's' : ''} • Next: {getNextLevel(area.level)}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">
                                    {area.avgScore}%
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-md border capitalize ${getLevelColor(area.level)}`}>
                                    {area.level}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-600">Mastery Level</span>
                                <span className="text-xs font-bold text-slate-700">{getLevelProgress(area.level)}%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                    style={{ width: `${area.avgScore}%` }}
                                />
                            </div>
                        </div>

                        {/* Level Progression */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`flex-1 h-2 rounded-full ${area.level === 'proficient' || area.level === 'advanced' || area.level === 'expert'
                                    ? 'bg-green-500' : 'bg-slate-200'
                                }`} />
                            <div className={`flex-1 h-2 rounded-full ${area.level === 'advanced' || area.level === 'expert'
                                    ? 'bg-blue-500' : 'bg-slate-200'
                                }`} />
                            <div className={`flex-1 h-2 rounded-full ${area.level === 'expert'
                                    ? 'bg-purple-500' : 'bg-slate-200'
                                }`} />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                            <span>Proficient</span>
                            <span>Advanced</span>
                            <span>Expert</span>
                        </div>

                        {/* Next Challenge */}
                        {area.level === 'expert' ? (
                            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                                <p className="text-xs font-bold text-purple-900 mb-1">Achievement Unlocked!</p>
                                <p className="text-xs text-purple-700">
                                    You've mastered {area.topic}. Consider mentoring others or exploring advanced applications!
                                </p>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-between group-hover:bg-green-50 group-hover:border-green-300 transition-colors"
                            >
                                <span>Take Advanced Challenge</span>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {strongAreas.some(a => a.level === 'expert') && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        <h4 className="font-bold text-purple-900">Expert Status Achieved!</h4>
                    </div>
                    <p className="text-sm text-purple-800">
                        Congratulations! You have {strongAreas.filter(a => a.level === 'expert').length} expert-level topic{strongAreas.filter(a => a.level === 'expert').length > 1 ? 's' : ''}. Keep pushing boundaries!
                    </p>
                </div>
            )}
        </Card>
    );
}

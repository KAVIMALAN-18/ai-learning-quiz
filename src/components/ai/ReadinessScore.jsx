import React from 'react';
import { Card } from '../ui/Card';
import { Target, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReadinessScore({ readinessData }) {
    if (!readinessData || readinessData.length === 0) {
        return null;
    }

    const getReadinessColor = (level) => {
        switch (level) {
            case 'expert':
                return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'ready':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'almost':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getReadinessIcon = (level) => {
        switch (level) {
            case 'expert':
            case 'ready':
                return CheckCircle;
            case 'almost':
                return AlertCircle;
            default:
                return Target;
        }
    };

    return (
        <Card className="p-6 border-2 border-blue-200 bg-blue-50/50">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Topic Readiness</h3>
                    <p className="text-sm text-slate-600">Your mastery level per topic</p>
                </div>
            </div>

            <div className="space-y-4">
                {readinessData.map((item, index) => {
                    const Icon = getReadinessIcon(item.level);
                    const colorClass = getReadinessColor(item.level);

                    return (
                        <div
                            key={index}
                            className="p-5 bg-white rounded-xl border border-slate-200"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 mb-1">{item.topic}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-md border font-bold capitalize ${colorClass}`}>
                                            {item.level}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {item.attempts} attempts
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Icon className={`w-4 h-4 ${item.level === 'expert' || item.level === 'ready' ? 'text-green-600' :
                                                item.level === 'almost' ? 'text-yellow-600' : 'text-slate-400'
                                            }`} />
                                        <span className="text-2xl font-bold text-slate-900">
                                            {item.readinessScore}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-500">Readiness</span>
                                </div>
                            </div>

                            {/* Progress Ring */}
                            <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden mb-3">
                                <div
                                    className={`h-full transition-all duration-700 ${item.level === 'expert' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                                            item.level === 'ready' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                                item.level === 'almost' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                                    'bg-gradient-to-r from-slate-400 to-slate-500'
                                        }`}
                                    style={{ width: `${item.readinessScore}%` }}
                                />
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Average Score</p>
                                    <p className="text-lg font-bold text-slate-900">{item.avgScore}%</p>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Consistency</p>
                                    <p className="text-lg font-bold text-slate-900">{item.consistency}%</p>
                                </div>
                            </div>

                            {/* Requirements */}
                            {item.requirements && item.requirements.length > 0 && (
                                <div className="pt-3 border-t border-slate-200">
                                    <p className="text-xs font-bold text-slate-700 mb-2">Next Steps</p>
                                    <ul className="space-y-1">
                                        {item.requirements.map((req, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${item.level === 'expert' ? 'bg-purple-500' :
                                                        item.level === 'ready' ? 'bg-green-500' :
                                                            item.level === 'almost' ? 'bg-yellow-500' : 'bg-slate-400'
                                                    }`} />
                                                <span className="text-xs text-slate-600 leading-tight">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

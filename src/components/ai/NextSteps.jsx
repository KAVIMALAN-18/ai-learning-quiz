import React from 'react';
import { Card } from '../ui/Card';
import { Lightbulb, ArrowRight, AlertCircle, CheckCircle, Target } from 'lucide-react';

export default function NextSteps({ recommendations }) {
    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    const getIcon = (type) => {
        switch (type) {
            case 'revise':
                return AlertCircle;
            case 'advance':
                return CheckCircle;
            case 'complete':
                return Target;
            default:
                return Lightbulb;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'border-red-300 bg-red-50';
            case 'medium':
                return 'border-yellow-300 bg-yellow-50';
            default:
                return 'border-blue-300 bg-blue-50';
        }
    };

    const getIconColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'text-red-600 bg-red-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-blue-600 bg-blue-100';
        }
    };

    return (
        <Card className="p-6 border-2 border-primary-200 bg-primary-50/30">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Personalized Recommendations</h3>
                    <p className="text-sm text-slate-600">Your next steps to improve</p>
                </div>
            </div>

            <div className="space-y-4">
                {recommendations.map((rec, index) => {
                    const Icon = getIcon(rec.type);
                    return (
                        <div
                            key={index}
                            className={`p-5 rounded-xl border-2 ${getPriorityColor(rec.priority)}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg ${getIconColor(rec.priority)}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 mb-1">{rec.title}</h4>
                                    <p className="text-sm text-slate-600 mb-3">{rec.description}</p>

                                    {rec.topics && rec.topics.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {rec.topics.slice(0, 3).map((topic, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-700"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                            {rec.topics.length > 3 && (
                                                <span className="text-xs px-2 py-1 text-slate-500">
                                                    +{rec.topics.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <ArrowRight className="w-4 h-4" />
                                        <span className="font-medium">{rec.action}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { TrendingDown, ChevronDown, ChevronUp, AlertTriangle, Clock } from 'lucide-react';
import Button from '../ui/Button';

export default function WeakAreas({ weakAreas }) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    if (!weakAreas || weakAreas.length === 0) {
        return null;
    }

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'medium':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            default:
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getEstimatedTime = (severity, avgScore) => {
        if (severity === 'high') return '2-3 weeks';
        if (severity === 'medium') return '1-2 weeks';
        return '3-5 days';
    };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <Card className="p-6 border-2 border-orange-200 bg-orange-50/50">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Areas to Improve</h3>
                    <p className="text-sm text-slate-600">Topics that need more attention</p>
                </div>
            </div>

            <div className="space-y-3">
                {weakAreas.map((area, index) => {
                    const isExpanded = expandedIndex === index;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all hover:shadow-md"
                        >
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900">{area.topic}</h4>
                                        <p className="text-sm text-slate-500">
                                            {area.attempts} attempt{area.attempts > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {area.avgScore}%
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-md border ${getSeverityColor(area.severity)}`}>
                                            {area.severity}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange-500 transition-all duration-500"
                                        style={{ width: `${area.avgScore}%` }}
                                    />
                                </div>

                                {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-slide-down">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Clock className="w-4 h-4 text-slate-500" />
                                                    <span className="text-xs font-bold text-slate-600">Estimated Time</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {getEstimatedTime(area.severity, area.avgScore)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <AlertTriangle className="w-4 h-4 text-slate-500" />
                                                    <span className="text-xs font-bold text-slate-600">Priority</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 capitalize">
                                                    {area.severity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                                            <p className="text-xs font-bold text-orange-900 mb-1">Recommended Actions</p>
                                            <ul className="text-xs text-orange-800 space-y-1">
                                                <li>• Review fundamental concepts in {area.topic}</li>
                                                <li>• Practice with beginner-level exercises</li>
                                                <li>• Take a refresher quiz in 3-5 days</li>
                                            </ul>
                                        </div>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="w-full bg-orange-600 hover:bg-orange-700"
                                        >
                                            Start Practicing {area.topic}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => toggleExpand(index)}
                                className="w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-slate-600"
                            >
                                {isExpanded ? (
                                    <>
                                        <span>Show Less</span>
                                        <ChevronUp className="w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        <span>View Details</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

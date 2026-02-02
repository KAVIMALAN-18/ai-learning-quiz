import React from 'react';
import { Clock, Zap } from 'lucide-react';
import Badge from '../ui/Badge';

export default function DifficultySelector({ formData, onChange }) {
    const difficulties = [
        { id: 'easy', label: 'Easy', color: 'bg-green-100 text-green-700 border-green-200' },
        { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        { id: 'hard', label: 'Hard', color: 'bg-red-100 text-red-700 border-red-200' }
    ];

    const timeLimits = [
        { value: 15, label: '15 min' },
        { value: 30, label: '30 min' },
        { value: 45, label: '45 min' },
        { value: 60, label: '60 min' },
        { value: 90, label: '90 min' }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Difficulty & Time</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Set the challenge level and time constraints
                </p>
            </div>

            {/* Difficulty Level */}
            <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">
                    Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {difficulties.map((diff) => (
                        <button
                            key={diff.id}
                            onClick={() => onChange({ ...formData, difficulty: diff.id })}
                            className={`p-4 rounded-xl border-2 transition-all font-medium ${formData.difficulty === diff.id
                                    ? `${diff.color} border-current scale-105 shadow-lg`
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            {diff.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Limit */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <label className="text-sm font-medium text-slate-700">
                        Time Limit
                    </label>
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {timeLimits.map((time) => (
                        <button
                            key={time.value}
                            onClick={() => onChange({ ...formData, timeLimit: time.value })}
                            className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${formData.timeLimit === time.value
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            {time.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Adaptive Mode */}
            <div className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-100">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            <h4 className="font-bold text-slate-900">Adaptive Mode</h4>
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                                Beta
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                            Questions adapt to your performance level in real-time
                        </p>
                    </div>
                    <button
                        onClick={() => onChange({ ...formData, adaptiveMode: !formData.adaptiveMode })}
                        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${formData.adaptiveMode ? 'bg-purple-600' : 'bg-slate-300'
                            }`}
                    >
                        <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.adaptiveMode ? 'translate-x-6' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

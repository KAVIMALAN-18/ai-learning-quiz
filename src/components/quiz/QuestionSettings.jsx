import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function QuestionSettings({ formData, onChange }) {
    const questionTypes = [
        { id: 'mcq', label: 'Multiple Choice', icon: '◉' },
        { id: 'coding', label: 'Coding', icon: '</>' },
        { id: 'truefalse', label: 'True/False', icon: '✓/✗' }
    ];

    const toggleQuestionType = (type) => {
        const types = formData.questionTypes.includes(type)
            ? formData.questionTypes.filter(t => t !== type)
            : [...formData.questionTypes, type];
        onChange({ ...formData, questionTypes: types });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Question Settings</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Customize the types and behavior of questions
                </p>
            </div>

            {/* Number of Questions */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-slate-700">
                        Number of Questions
                    </label>
                    <span className="text-lg font-bold text-primary-600">
                        {formData.questionCount}
                    </span>
                </div>
                <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={formData.questionCount}
                    onChange={(e) => onChange({ ...formData, questionCount: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>5</span>
                    <span>25</span>
                    <span>50</span>
                </div>
            </div>

            {/* Question Types */}
            <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">
                    Question Types
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {questionTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => toggleQuestionType(type.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${formData.questionTypes.includes(type.id)
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            <div className="text-2xl mb-1">{type.icon}</div>
                            <div className="text-xs font-medium">{type.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4">
                {/* Negative Marking */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">
                            Negative Marking
                        </span>
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-xs rounded-lg z-10">
                                Deduct points for incorrect answers
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => onChange({ ...formData, negativeMarking: !formData.negativeMarking })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${formData.negativeMarking ? 'bg-primary-600' : 'bg-slate-300'
                            }`}
                    >
                        <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.negativeMarking ? 'translate-x-6' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>

                {/* Randomize Questions */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">
                            Randomize Questions
                        </span>
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-xs rounded-lg z-10">
                                Shuffle question order for each attempt
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => onChange({ ...formData, randomize: !formData.randomize })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${formData.randomize ? 'bg-primary-600' : 'bg-slate-300'
                            }`}
                    >
                        <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.randomize ? 'translate-x-6' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

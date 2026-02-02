import React from 'react';
import { Play, Eye, AlertCircle } from 'lucide-react';

export default function StartSection({ formData, onStart, onPreview, isValid }) {
    const getValidationMessage = () => {
        if (!formData.title) return 'Please enter a quiz title';
        if (!formData.topic) return 'Please select a topic';
        if (formData.questionTypes.length === 0) return 'Please select at least one question type';
        return null;
    };

    const validationMessage = getValidationMessage();

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4">Quiz Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-slate-500">Questions:</span>
                        <span className="ml-2 font-medium text-slate-900">{formData.questionCount}</span>
                    </div>
                    <div>
                        <span className="text-slate-500">Time Limit:</span>
                        <span className="ml-2 font-medium text-slate-900">{formData.timeLimit} min</span>
                    </div>
                    <div>
                        <span className="text-slate-500">Difficulty:</span>
                        <span className="ml-2 font-medium text-slate-900 capitalize">{formData.difficulty}</span>
                    </div>
                    <div>
                        <span className="text-slate-500">Question Types:</span>
                        <span className="ml-2 font-medium text-slate-900">{formData.questionTypes.length}</span>
                    </div>
                </div>
            </div>

            {/* Validation Message */}
            {!isValid && validationMessage && (
                <div className="flex items-center gap-3 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <p className="text-sm text-orange-700 font-medium">{validationMessage}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onStart}
                    disabled={!isValid}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                >
                    <Play className="w-5 h-5" />
                    Start Quiz
                </button>

                <button
                    onClick={onPreview}
                    disabled={!isValid}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <Eye className="w-5 h-5" />
                    Preview
                </button>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-center text-slate-500">
                You can save this configuration as a template for future quizzes
            </p>
        </div>
    );
}

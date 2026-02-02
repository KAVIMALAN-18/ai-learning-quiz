import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function SubmitModal({
    isOpen,
    onClose,
    onConfirm,
    answeredCount,
    totalQuestions,
    markedCount
}) {
    if (!isOpen) return null;

    const unansweredCount = totalQuestions - answeredCount;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Submit Quiz?</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-slate-600">
                        Are you sure you want to submit your quiz? This action cannot be undone.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{answeredCount}</div>
                            <div className="text-xs text-slate-500">Answered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{unansweredCount}</div>
                            <div className="text-xs text-slate-500">Unanswered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{markedCount}</div>
                            <div className="text-xs text-slate-500">Marked</div>
                        </div>
                    </div>

                    {unansweredCount > 0 && (
                        <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-orange-700">
                                You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}.
                                These will be marked as incorrect.
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-slate-200 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                        Review Answers
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                        Submit Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}

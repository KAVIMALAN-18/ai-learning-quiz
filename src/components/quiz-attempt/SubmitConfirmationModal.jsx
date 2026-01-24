import React from 'react';
import { AlertTriangle, HelpCircle, X } from 'lucide-react';
import Button from '../ui/Button';

export default function SubmitConfirmationModal({ isOpen, onClose, onConfirm, unansweredCount, title }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-scale-in"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                        <HelpCircle size={32} />
                    </div>
                    <h3 id="modal-title" className="text-xl font-bold text-slate-900 mb-2">Submit your exam?</h3>
                    <p className="text-slate-500 text-sm">
                        You are about to submit your answers for <strong>{title}</strong>.
                        You won't be able to change your answers after this.
                    </p>

                    {unansweredCount > 0 && (
                        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-left flex items-start gap-3">
                            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-800 font-bold text-sm">Unanswered Questions Alert</p>
                                <p className="text-amber-700 text-xs mt-1">
                                    You have <span className="font-bold">{unansweredCount}</span> questions left unanswered. Are you sure you want to proceed?
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                    >
                        Confirm Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}

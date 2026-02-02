import React from 'react';
import { AlertCircle, Target, CheckCircle2, X } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Label from '../ui/Typography';

export default function SubmitConfirmationModal({ isOpen, onClose, onConfirm, unansweredCount, title }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-neutral-900/80 backdrop-blur-md animate-fade-in">
            <div
                className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-xl p-12 relative animate-scale-in border border-white/20 overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Target size={240} />
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 hover:bg-neutral-50 rounded-2xl text-neutral-400 hover:text-neutral-900 transition-all"
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>

                <div className="text-center relative z-10">
                    <div className="w-24 h-24 bg-primary-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-primary-600 border border-primary-100 shadow-soft">
                        <CheckCircle2 size={40} strokeWidth={2.5} />
                    </div>

                    <Badge variant="primary" className="mb-6 px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.3em]">Final Checkout</Badge>
                    <h3 id="modal-title" className="text-4xl font-black text-neutral-900 mb-6 tracking-tighter">Submit assessment?</h3>
                    <p className="text-neutral-500 text-xl font-medium leading-relaxed mb-10 max-w-md mx-auto">
                        You're initiating the final evaluation for <span className="text-neutral-900 font-black uppercase tracking-tight">{title}</span>.
                        Records cannot be altered post-submission.
                    </p>

                    {unansweredCount > 0 && (
                        <div className="mb-12 bg-error-50/50 border-2 border-error-100 rounded-[2.5rem] p-8 text-left flex items-start gap-6 animate-pulse">
                            <div className="p-4 bg-error-100 rounded-2xl text-error-600">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <p className="text-error-600 font-black text-sm uppercase tracking-widest mb-2">Attention Required</p>
                                <p className="text-error-500 font-medium text-lg leading-tight tracking-tight">
                                    You have <span className="font-black underline decoration-2 underline-offset-4">{unansweredCount} questions</span> without verified inputs. Progress will be penalized if you proceed.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                    <Button variant="white" onClick={onClose} className="flex-1 py-5 font-black rounded-2xl text-neutral-400 hover:text-neutral-900 h-16 shadow-none border-neutral-100">
                        CONTINUE STUDYING
                    </Button>
                    <Button
                        variant="premium"
                        onClick={onConfirm}
                        className="flex-1 py-5 font-black rounded-2xl shadow-premium h-16 text-lg"
                    >
                        CONFIRM SUBMISSION
                    </Button>
                </div>
            </div>
        </div>
    );
}

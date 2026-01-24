import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';

export default function QuizNavigation({
    current,
    total,
    onNext,
    onPrev,
    onSubmit,
    isAnswered,
    isLast
}) {
    return (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 md:p-0 h-auto md:h-20 flex items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">

                {/* Previous Button */}
                <Button
                    variant="ghost"
                    size="lg"
                    onClick={onPrev}
                    disabled={current === 0}
                    className="text-slate-500 hover:text-indigo-600 w-32 hidden sm:flex disabled:opacity-30"
                >
                    <ChevronLeft size={20} className="mr-2" /> Previous
                </Button>

                {/* Mobile Navigation */}
                <div className="flex sm:hidden w-full gap-4">
                    <Button variant="outline" onClick={onPrev} disabled={current === 0} className="flex-1">
                        <ChevronLeft />
                    </Button>
                    {isLast ? (
                        <Button
                            variant="success"
                            onClick={onSubmit}
                            disabled={!isAnswered}
                            className="flex-[2] shadow-lg shadow-emerald-500/20"
                        >
                            Submit
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={onNext}
                            disabled={!isAnswered}
                            className="flex-[2] shadow-lg shadow-indigo-500/20"
                        >
                            Next <ChevronRight />
                        </Button>
                    )}
                </div>

                {/* Desktop Next/Submit Area */}
                <div className="hidden sm:flex items-center gap-4">
                    {!isLast && (
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={onNext}
                            disabled={!isAnswered}
                            className={`w-40 transition-all ${isAnswered ? 'shadow-xl shadow-indigo-500/30' : 'opacity-50 grayscale'}`}
                        >
                            Next <ChevronRight size={20} className="ml-2" />
                        </Button>
                    )}

                    {isLast && (
                        <Button
                            variant="success"
                            size="lg"
                            onClick={onSubmit}
                            disabled={!isAnswered}
                            className="w-48 shadow-xl shadow-emerald-500/30 font-bold tracking-wide"
                        >
                            Finish Exam <CheckCircle2 size={20} className="ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { Check, Circle, Flag, Minus } from 'lucide-react';

export default function QuestionPalette({
    questions,
    currentQuestion,
    answers,
    markedQuestions,
    onQuestionSelect
}) {
    const getQuestionStatus = (index) => {
        const questionId = questions[index].id;
        const isAnswered = answers[questionId] !== undefined && answers[questionId] !== null;
        const isMarked = markedQuestions.includes(questionId);
        const isCurrent = index === currentQuestion;

        if (isCurrent) return 'current';
        if (isMarked) return 'marked';
        if (isAnswered) return 'answered';
        return 'not-visited';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'current':
                return 'bg-primary-600 text-white border-primary-600';
            case 'answered':
                return 'bg-green-100 text-green-700 border-green-300';
            case 'marked':
                return 'bg-blue-100 text-blue-700 border-blue-300';
            default:
                return 'bg-white text-slate-600 border-slate-300 hover:border-slate-400';
        }
    };

    const statusCounts = {
        answered: questions.filter((_, i) => getQuestionStatus(i) === 'answered').length,
        marked: questions.filter((_, i) => getQuestionStatus(i) === 'marked').length,
        notVisited: questions.filter((_, i) => getQuestionStatus(i) === 'not-visited').length
    };

    return (
        <div className="bg-white p-4 rounded-xl border-2 border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Question Palette</h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className="text-slate-600">Answered ({statusCounts.answered})</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span className="text-slate-600">Marked ({statusCounts.marked})</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-slate-300" />
                    <span className="text-slate-600">Not Visited ({statusCounts.notVisited})</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary-600" />
                    <span className="text-slate-600">Current</span>
                </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => {
                    const status = getQuestionStatus(index);
                    return (
                        <button
                            key={index}
                            onClick={() => onQuestionSelect(index)}
                            className={`aspect-square flex items-center justify-center text-sm font-bold rounded-lg border-2 transition-all hover:scale-110 ${getStatusColor(status)}`}
                            aria-label={`Question ${index + 1}`}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>

            {/* Progress */}
            <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-xs text-slate-600 mb-2">
                    <span>Progress</span>
                    <span className="font-bold">{statusCounts.answered}/{questions.length}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${(statusCounts.answered / questions.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

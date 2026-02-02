import React from 'react';
import { Flag } from 'lucide-react';

export default function QuestionPanel({
    question,
    questionNumber,
    totalQuestions,
    answer,
    onAnswerChange,
    isMarked,
    onToggleMark
}) {
    const renderOptions = () => {
        switch (question.type) {
            case 'mcq':
                return (
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <label
                                key={index}
                                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${answer === index
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="answer"
                                    value={index}
                                    checked={answer === index}
                                    onChange={() => onAnswerChange(index)}
                                    className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="flex-1 text-slate-700">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'multi-select':
                return (
                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            const isSelected = Array.isArray(answer) && answer.includes(index);
                            return (
                                <label
                                    key={index}
                                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {
                                            const newAnswer = Array.isArray(answer) ? [...answer] : [];
                                            if (isSelected) {
                                                onAnswerChange(newAnswer.filter(i => i !== index));
                                            } else {
                                                onAnswerChange([...newAnswer, index]);
                                            }
                                        }}
                                        className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <span className="flex-1 text-slate-700">{option}</span>
                                </label>
                            );
                        })}
                    </div>
                );

            case 'true-false':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {['True', 'False'].map((option, index) => (
                            <button
                                key={option}
                                onClick={() => onAnswerChange(index === 0)}
                                className={`p-6 rounded-xl border-2 font-bold transition-all ${answer === (index === 0)
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                );

            case 'coding':
                return (
                    <div>
                        <textarea
                            value={answer || ''}
                            onChange={(e) => onAnswerChange(e.target.value)}
                            placeholder="Write your code here..."
                            className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-green-400 rounded-xl border-2 border-slate-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none resize-none"
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl border-2 border-slate-200">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-primary-600">
                            Question {questionNumber} of {totalQuestions}
                        </span>
                        {question.type && (
                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md uppercase">
                                {question.type.replace('-', ' ')}
                            </span>
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 leading-relaxed">
                        {question.question}
                    </h2>
                </div>

                <button
                    onClick={onToggleMark}
                    className={`p-2 rounded-lg transition-all ${isMarked
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                        }`}
                    aria-label="Mark for review"
                >
                    <Flag className="w-5 h-5" fill={isMarked ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Question Content */}
            <div className="mb-6">
                {renderOptions()}
            </div>

            {/* Helper Text */}
            {question.type === 'multi-select' && (
                <p className="text-sm text-slate-500 italic">
                    Select all that apply
                </p>
            )}
        </div>
    );
}

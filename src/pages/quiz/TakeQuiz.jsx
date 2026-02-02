import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Timer from '../../components/quiz/Timer';
import QuestionPanel from '../../components/quiz/QuestionPanel';
import QuestionPalette from '../../components/quiz/QuestionPalette';
import SubmitModal from '../../components/quiz/SubmitModal';
import { ChevronLeft, ChevronRight, Send, Maximize, AlertCircle } from 'lucide-react';

// Mock quiz data
const mockQuiz = {
    id: '1',
    title: 'JavaScript Fundamentals Quiz',
    duration: 30, // minutes
    questions: [
        {
            id: 'q1',
            type: 'mcq',
            question: 'What is the output of: console.log(typeof null)?',
            options: ['null', 'undefined', 'object', 'number'],
            correctAnswer: 2
        },
        {
            id: 'q2',
            type: 'multi-select',
            question: 'Which of the following are JavaScript data types?',
            options: ['String', 'Boolean', 'Integer', 'Symbol', 'Float'],
            correctAnswer: [0, 1, 3]
        },
        {
            id: 'q3',
            type: 'true-false',
            question: 'JavaScript is a statically typed language.',
            correctAnswer: false
        },
        {
            id: 'q4',
            type: 'coding',
            question: 'Write a function that reverses a string.',
            correctAnswer: 'function reverseString(str) { return str.split("").reverse().join(""); }'
        },
        {
            id: 'q5',
            type: 'mcq',
            question: 'Which method is used to add elements to the end of an array?',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            correctAnswer: 0
        }
    ]
};

export default function TakeQuiz() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [markedQuestions, setMarkedQuestions] = useState([]);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Prevent page leave
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    // Disable right-click
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft' && currentQuestion > 0) {
                setCurrentQuestion(prev => prev - 1);
            } else if (e.key === 'ArrowRight' && currentQuestion < mockQuiz.questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentQuestion]);

    const handleAnswerChange = (answer) => {
        setAnswers(prev => ({
            ...prev,
            [mockQuiz.questions[currentQuestion].id]: answer
        }));
    };

    const handleToggleMark = () => {
        const questionId = mockQuiz.questions[currentQuestion].id;
        setMarkedQuestions(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const handleNext = () => {
        if (currentQuestion < mockQuiz.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleTimeout = () => {
        handleSubmit();
    };

    const handleSubmit = () => {
        // Calculate score
        let correct = 0;
        mockQuiz.questions.forEach(question => {
            const userAnswer = answers[question.id];
            if (question.type === 'multi-select') {
                if (JSON.stringify(userAnswer?.sort()) === JSON.stringify(question.correctAnswer.sort())) {
                    correct++;
                }
            } else {
                if (userAnswer === question.correctAnswer) {
                    correct++;
                }
            }
        });

        const score = Math.round((correct / mockQuiz.questions.length) * 100);

        // Navigate to results
        navigate(`/dashboard/quizzes/${quizId}/result`, {
            state: {
                score,
                correct,
                total: mockQuiz.questions.length,
                answers
            }
        });
    };

    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b-2 border-slate-200 px-6 py-4">
                <div className="max-w-[1800px] mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{mockQuiz.title}</h1>
                        <p className="text-sm text-slate-500">Question {currentQuestion + 1} of {mockQuiz.questions.length}</p>
                    </div>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Toggle fullscreen"
                    >
                        <Maximize className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1800px] mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                    {/* Left: Question Panel */}
                    <div className="space-y-6">
                        <QuestionPanel
                            question={mockQuiz.questions[currentQuestion]}
                            questionNumber={currentQuestion + 1}
                            totalQuestions={mockQuiz.questions.length}
                            answer={answers[mockQuiz.questions[currentQuestion].id]}
                            onAnswerChange={handleAnswerChange}
                            isMarked={markedQuestions.includes(mockQuiz.questions[currentQuestion].id)}
                            onToggleMark={handleToggleMark}
                        />

                        {/* Navigation */}
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-slate-200">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Previous
                            </button>

                            <span className="text-sm text-slate-500">
                                Use arrow keys to navigate
                            </span>

                            <button
                                onClick={handleNext}
                                disabled={currentQuestion === mockQuiz.questions.length - 1}
                                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Right: Sidebar */}
                    <div className="space-y-6">
                        <Timer
                            duration={mockQuiz.duration}
                            onTimeout={handleTimeout}
                            onWarning={() => {
                                // Show warning notification
                                console.log('5 minutes remaining!');
                            }}
                        />

                        <QuestionPalette
                            questions={mockQuiz.questions}
                            currentQuestion={currentQuestion}
                            answers={answers}
                            markedQuestions={markedQuestions}
                            onQuestionSelect={setCurrentQuestion}
                        />

                        <button
                            onClick={() => setShowSubmitModal(true)}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
                        >
                            <Send className="w-5 h-5" />
                            Submit Quiz
                        </button>
                    </div>
                </div>
            </div>

            {/* Submit Modal */}
            <SubmitModal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onConfirm={handleSubmit}
                answeredCount={answeredCount}
                totalQuestions={mockQuiz.questions.length}
                markedCount={markedQuestions.length}
            />
        </div>
    );
}

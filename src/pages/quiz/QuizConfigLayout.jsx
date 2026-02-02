import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Title } from '../../components/ui/Typography';
import QuizDetailsForm from '../../components/quiz/QuizDetailsForm';
import QuestionSettings from '../../components/quiz/QuestionSettings';
import DifficultySelector from '../../components/quiz/DifficultySelector';
import StartSection from '../../components/quiz/StartSection';
import { ArrowLeft } from 'lucide-react';

export default function QuizConfigLayout() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        course: '',
        description: '',
        questionCount: 10,
        questionTypes: ['mcq'],
        negativeMarking: false,
        randomize: true,
        difficulty: 'medium',
        timeLimit: 30,
        adaptiveMode: false
    });

    const isValid = formData.title && formData.topic && formData.questionTypes.length > 0;

    const handleStart = () => {
        if (!isValid) return;
        console.log('Starting quiz with config:', formData);
        // Navigate to quiz or generate quiz
        navigate('/dashboard/quizzes/start');
    };

    const handlePreview = () => {
        if (!isValid) return;
        console.log('Previewing quiz config:', formData);
        // Show preview modal or navigate to preview
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
            <Container className="py-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back</span>
                        </button>
                        <Title className="text-3xl font-bold text-slate-900 mb-2">
                            Configure Quiz
                        </Title>
                        <p className="text-slate-600">
                            Set up your quiz parameters and preferences
                        </p>
                    </div>

                    {/* Main Card */}
                    <Card className="p-8 border-2 border-slate-200 shadow-xl">
                        <div className="space-y-12">
                            {/* Quiz Details */}
                            <QuizDetailsForm formData={formData} onChange={setFormData} />

                            {/* Divider */}
                            <div className="border-t border-slate-200" />

                            {/* Question Settings */}
                            <QuestionSettings formData={formData} onChange={setFormData} />

                            {/* Divider */}
                            <div className="border-t border-slate-200" />

                            {/* Difficulty & Time */}
                            <DifficultySelector formData={formData} onChange={setFormData} />

                            {/* Divider */}
                            <div className="border-t border-slate-200" />

                            {/* Start Section */}
                            <StartSection
                                formData={formData}
                                onStart={handleStart}
                                onPreview={handlePreview}
                                isValid={isValid}
                            />
                        </div>
                    </Card>

                    {/* Footer Note */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            All settings can be adjusted before starting the quiz
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    );
}

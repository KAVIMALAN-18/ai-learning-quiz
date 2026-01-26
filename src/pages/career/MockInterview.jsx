import React, { useState, useEffect } from 'react';
import {
    Mic,
    Send,
    MessageSquare,
    RefreshCcw,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Brain,
    History,
    Play
} from 'lucide-react';
import careerService from '../../services/career.service';
import Container from '../../components/ui/Container';
import { Title, BodyText, Label } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function MockInterview() {
    const [session, setSession] = useState(null);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [interviewStarted, setInterviewStarted] = useState(false);

    const startSession = async (type = 'Technical', topic = 'Fullstack Development') => {
        try {
            setLoading(true);
            const data = await careerService.startInterview(type, topic);
            setSession(data);
            setInterviewStarted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (!userAnswer.trim()) return;

        try {
            setSubmitting(true);
            const feedback = await careerService.submitInterviewAnswer({
                sessionId: session._id,
                questionIndex: activeQuestion,
                answer: userAnswer
            });

            // Update session locally
            const updatedQuestions = [...session.questions];
            updatedQuestions[activeQuestion] = {
                ...updatedQuestions[activeQuestion],
                ...feedback,
                userAnswer
            };
            setSession({ ...session, questions: updatedQuestions });

            if (activeQuestion < session.questions.length - 1) {
                setActiveQuestion(activeQuestion + 1);
                setUserAnswer('');
            } else {
                // End of interview logic
                setInterviewStarted(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!interviewStarted) {
        return (
            <Container className="py-20 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-8 border border-primary-100 shadow-inner">
                    <Brain size={48} />
                </div>
                <Title className="text-4xl font-black mb-4">AI Mock Interview Explorer</Title>
                <BodyText className="max-w-xl mx-auto mb-12 text-lg text-slate-500 font-medium">
                    Practice with our industry-tuned AI interviewer. Select your focus area and receive real-time analysis on your answers and depth of knowledge.
                </BodyText>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    <Card className="p-8 hover:border-primary-300 cursor-pointer transition-all border-slate-100 group" onClick={() => startSession('Technical')}>
                        <h4 className="font-black text-xl mb-2 group-hover:text-primary-600">Technical Session</h4>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-6">DSA, System Design, Languages</p>
                        <Button fullWidth variant="primary" className="py-4">START TECHNICAL</Button>
                    </Card>
                    <Card className="p-8 hover:border-indigo-300 cursor-pointer transition-all border-slate-100 group" onClick={() => startSession('HR')}>
                        <h4 className="font-black text-xl mb-2 group-hover:text-indigo-600">HR & Behavior</h4>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-6">Communication, Leadership, Goals</p>
                        <Button fullWidth variant="secondary" className="py-4">START HR</Button>
                    </Card>
                </div>
            </Container>
        );
    }

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">AI Interviewer is preparing questions...</p>
        </div>
    );

    const currentQ = session.questions[activeQuestion];

    return (
        <Container className="py-10 animate-fade-in pb-20">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <Play size={20} fill="currentColor" />
                        </div>
                        <div>
                            <Title className="text-xl">Active Session</Title>
                            <MetaText className="uppercase text-primary-600 font-black tracking-widest text-[10px]">{session.type} Interview</MetaText>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {session.questions.map((_, i) => (
                            <div key={i} className={`w-10 h-1.5 rounded-full transition-all duration-500 ${i <= activeQuestion ? 'bg-primary-600' : 'bg-slate-100'}`} />
                        ))}
                    </div>
                </div>

                <Card className="p-12 bg-white shadow-premium border-none relative overflow-hidden">
                    <div className="flex gap-8">
                        <div className="shrink-0">
                            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 font-black">
                                Q{activeQuestion + 1}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-slate-900 leading-tight mb-12">
                                {currentQ.question}
                            </h2>

                            <div className="space-y-6">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Response</Label>
                                <textarea
                                    className="w-full min-h-[200px] p-6 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-slate-700 font-medium text-lg leading-relaxed shadow-inner"
                                    placeholder="Type your detailed answer here..."
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    disabled={submitting}
                                />

                                <div className="flex justify-between items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                                    <Button variant="ghost" className="text-slate-400 hover:text-slate-900 gap-2 font-bold">
                                        <Mic size={18} /> Enable Voice
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        isLoading={submitting}
                                        disabled={!userAnswer.trim()}
                                        className="px-10 py-4 font-black shadow-lg shadow-primary-600/20"
                                    >
                                        SUBMIT ANSWER <Send size={18} className="ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI FEEDBACK AREA (Only for previous questions if we navigate back, or we show it after submit) */}
                </Card>

                {/* PRO TIPS SECTION */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                        <AlertCircle size={24} className="text-amber-600 shrink-0" />
                        <div>
                            <h5 className="font-bold text-amber-900 mb-1">Pro Tip: Structure</h5>
                            <p className="text-xs text-amber-800/80 leading-relaxed font-medium">Use the STAR method (Situation, Task, Action, Result) for behavioral questions to provide impactful answers.</p>
                        </div>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
                        <CheckCircle2 size={24} className="text-indigo-600 shrink-0" />
                        <div>
                            <h5 className="font-bold text-indigo-900 mb-1">Pro Tip: Technical</h5>
                            <p className="text-xs text-indigo-800/80 leading-relaxed font-medium">When answering technical questions, mention specific time and space complexity (Big O notation) where applicable.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

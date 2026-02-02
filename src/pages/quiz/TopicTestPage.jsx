import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import courseService from '../../services/course.service';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Title, BodyText, SectionHeader } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { CheckCircle2, XCircle, ArrowRight, Zap, Trophy, HelpCircle } from 'lucide-react';
import Badge from '../../components/ui/Badge';

export default function TopicTestPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { topicId, courseId } = location.state || {};

    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!topicId) {
            navigate('/dashboard/roadmap');
            return;
        }

        const fetchTopic = async () => {
            try {
                const data = await courseService.getTopic(topicId);
                setTopic(data);
            } catch (err) {
                console.error("Failed to fetch topic for test:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopic();
    }, [topicId]);

    const handleOptionSelect = (qIdx, oIdx) => {
        setAnswers({ ...answers, [qIdx]: oIdx });
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const res = await courseService.submitTopicTest(topicId, courseId, answers);
            setResult(res);
        } catch (err) {
            console.error("Submission failed:", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><LoadingSpinner size={48} /></div>;

    if (result) {
        const passed = result.score >= 80;
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <Card className="max-w-2xl w-full p-12 text-center space-y-8 rounded-[3rem] shadow-premium relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-3 ${passed ? 'bg-success' : 'bg-error'}`} />

                    <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto ${passed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                        {passed ? <Trophy size={48} /> : <Zap size={48} />}
                    </div>

                    <div>
                        <Title className="text-4xl font-black text-slate-900 mb-2">
                            {passed ? 'Topic Mastered!' : 'Keep Practicing'}
                        </Title>
                        <BodyText className="text-slate-500 font-medium">
                            {passed
                                ? "You've successfully validated your knowledge for this topic."
                                : "You need at least 80% to unlock the next topic. Review the content and try again."}
                        </BodyText>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Score</p>
                                <p className={`text-4xl font-black ${passed ? 'text-success' : 'text-slate-900'}`}>{result.score}%</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                                <Badge variant={passed ? 'success' : 'error'} className="font-black px-4 py-1 uppercase text-xs">{passed ? 'Passed' : 'Failed'}</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button
                            fullWidth
                            className="py-5 font-black text-lg shadow-xl shadow-primary-600/10"
                            onClick={() => navigate('/dashboard/roadmap')}
                        >
                            RETURN TO CURRICULUM
                        </Button>
                        {!passed && (
                            <Button
                                variant="ghost"
                                className="font-bold text-slate-400 hover:text-slate-900"
                                onClick={() => {
                                    setResult(null);
                                    setAnswers({});
                                }}
                            >
                                TRY AGAIN
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-3xl mx-auto space-y-12">
                <header className="text-center space-y-4">
                    <Badge variant="primary" className="font-black uppercase tracking-widest text-[10px] px-4 py-1 shadow-lg shadow-primary-600/10">Knowledge Validation</Badge>
                    <Title className="text-5xl font-black text-slate-900 tracking-tight leading-tight">{topic.title}</Title>
                    <BodyText className="text-slate-500 font-medium text-lg">Select the correct answers for each question to demonstrate mastery.</BodyText>
                </header>

                <div className="space-y-8">
                    {topic.practiceQuestions?.map((q, qIdx) => (
                        <Card key={qIdx} className="p-10 border-none shadow-premium bg-white rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 text-slate-50/50 -mr-4 -mt-4">
                                <HelpCircle size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
                                        {qIdx + 1}
                                    </div>
                                    <SectionHeader className="m-0 text-xl font-black text-slate-900">{q.question}</SectionHeader>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {q.options.map((opt, oIdx) => (
                                        <button
                                            key={oIdx}
                                            onClick={() => handleOptionSelect(qIdx, oIdx)}
                                            className={`p-5 rounded-2xl text-left font-bold transition-all border-2 flex items-center justify-between ${answers[qIdx] === oIdx
                                                    ? 'bg-primary-50 border-primary-600 text-primary-900'
                                                    : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'
                                                }`}
                                        >
                                            <span>{opt}</span>
                                            {answers[qIdx] === oIdx && <CheckCircle2 size={20} className="text-primary-600" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="pt-10 flex flex-col items-center">
                    <Button
                        className="px-16 py-6 font-black text-xl rounded-2xl shadow-premium group"
                        disabled={Object.keys(answers).length < (topic.practiceQuestions?.length || 0)}
                        onClick={handleSubmit}
                    >
                        {submitting ? 'VALIDATING...' : 'SUBMIT ANSWERS'} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Mastery threshold: 80%</p>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Container from '../../components/ui/Container';
import { Title, SectionHeader, BodyText, MetaText } from '../../components/ui/Typography';
import {
    X,
    Save,
    Plus,
    Trash2,
    GripVertical,
    Check,
    ChevronRight,
    Settings,
    List,
    Clock,
    Target,
    Layers
} from 'lucide-react';

export default function AdminQuizBuilder() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('settings'); // settings | questions

    const [quizDetails, setQuizDetails] = useState({
        title: '',
        category: 'React',
        difficulty: 'Intermediate',
        timeLimit: 30,
        passingScore: 70,
        description: ''
    });

    const [questions, setQuestions] = useState([
        {
            id: 1,
            text: "What is the primary purpose of useEffect in React?",
            type: "mcq",
            options: [
                { id: 'a', text: "To handle side effects", isCorrect: true },
                { id: 'b', text: "To create state", isCorrect: false },
                { id: 'c', text: "To render JSX", isCorrect: false },
                { id: 'd', text: "To optimize build size", isCorrect: false }
            ]
        }
    ]);

    const addQuestion = () => {
        const newId = questions.length + 1;
        setQuestions([...questions, {
            id: newId,
            text: "",
            type: "mcq",
            options: [
                { id: 'a', text: "", isCorrect: false },
                { id: 'b', text: "", isCorrect: false },
                { id: 'c', text: "", isCorrect: false },
                { id: 'd', text: "", isCorrect: false }
            ]
        }]);
    };

    const updateQuestion = (idx, field, value) => {
        const updated = [...questions];
        updated[idx][field] = value;
        setQuestions(updated);
    };

    const updateOption = (qIdx, oIdx, text) => {
        const updated = [...questions];
        updated[qIdx].options[oIdx].text = text;
        setQuestions(updated);
    };

    const setCorrectOption = (qIdx, oIdx) => {
        const updated = [...questions];
        updated[qIdx].options.forEach((opt, i) => {
            opt.isCorrect = i === oIdx;
        });
        setQuestions(updated);
    };

    const removeQuestion = (idx) => {
        setQuestions(questions.filter((_, i) => i !== idx));
    };

    return (
        <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col animate-fade-in font-sans">
            {/* Builder Header */}
            <div className="h-20 bg-white border-b border-neutral-200 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard/admin/quizzes')}
                        className="hover:bg-neutral-100 rounded-md p-2"
                    >
                        <X size={24} className="text-neutral-500" />
                    </Button>
                    <div className="h-8 w-px bg-neutral-200" />
                    <div>
                        <div className="flex items-center gap-3">
                            <Title className="text-xl">
                                {quizDetails.title || "New Assessment"}
                            </Title>
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
                                Draft Mode
                            </span>
                        </div>
                        <MetaText className="text-[10px] uppercase font-black tracking-widest text-primary-600">Architecting Content</MetaText>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="hidden sm:flex border-neutral-200 font-black uppercase tracking-widest text-[10px]">Stash Draft</Button>
                    <Button className="shadow-xl shadow-primary-600/20 px-6 font-black uppercase tracking-widest text-[10px]">
                        <Save size={16} className="mr-2" /> Finalize & Publish
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <div className="w-80 bg-white border-r border-neutral-200 flex flex-col p-6 space-y-8">
                    <div>
                        <MetaText className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-6">Configuration</MetaText>
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`w-full text-left px-5 py-4 rounded-md font-black uppercase tracking-widest text-[11px] flex items-center gap-4 transition-all ${activeTab === 'settings' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-neutral-500 hover:bg-neutral-50'}`}
                            >
                                <Settings size={18} /> Basic Parameters
                            </button>
                            <button
                                onClick={() => setActiveTab('questions')}
                                className={`w-full text-left px-5 py-4 rounded-md font-black uppercase tracking-widest text-[11px] flex items-center gap-4 transition-all ${activeTab === 'questions' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-neutral-500 hover:bg-neutral-50'}`}
                            >
                                <List size={18} /> Curriculum Builder
                                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-md ${activeTab === 'questions' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'}`}>{questions.length}</span>
                            </button>
                        </nav>
                    </div>

                    <div className="pt-8 border-t border-neutral-100">
                        <MetaText className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-4">Integrity Check</MetaText>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-success">
                                <Check size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Title Defined</span>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-300">
                                <Check size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Questions Validated</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto bg-neutral-50 p-12">
                    <div className="max-w-4xl mx-auto">

                        {/* SETTINGS TAB */}
                        {activeTab === 'settings' && (
                            <div className="space-y-8 animate-slide-up">
                                <div className="mb-10">
                                    <SectionHeader className="text-3xl mt-0 mb-2">Core Parameters</SectionHeader>
                                    <BodyText className="text-neutral-500">Define the global properties and grading criteria for this assessment.</BodyText>
                                </div>

                                <Card className="p-10 border-neutral-100 shadow-xl space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Assessment Title</label>
                                        <input
                                            value={quizDetails.title}
                                            onChange={e => setQuizDetails({ ...quizDetails, title: e.target.value })}
                                            className="w-full px-6 py-4 border border-neutral-200 rounded-md text-xl font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all placeholder:text-neutral-200"
                                            placeholder="e.g. Advanced Reactive Patterns"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Stream / Category</label>
                                            <div className="relative">
                                                <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                                <select
                                                    value={quizDetails.category}
                                                    onChange={e => setQuizDetails({ ...quizDetails, category: e.target.value })}
                                                    className="w-full pl-12 pr-6 py-4 border border-neutral-200 rounded-md text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-primary-500/20 outline-none appearance-none bg-white"
                                                >
                                                    <option>React</option>
                                                    <option>JavaScript</option>
                                                    <option>Node.js</option>
                                                    <option>CSS</option>
                                                    <option>Python</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Target Proficiency</label>
                                            <div className="relative">
                                                <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                                <select
                                                    value={quizDetails.difficulty}
                                                    onChange={e => setQuizDetails({ ...quizDetails, difficulty: e.target.value })}
                                                    className="w-full pl-12 pr-6 py-4 border border-neutral-200 rounded-md text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-primary-500/20 outline-none appearance-none bg-white"
                                                >
                                                    <option>Beginner</option>
                                                    <option>Intermediate</option>
                                                    <option>Advanced</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Temporal Limit (Minutes)</label>
                                            <div className="relative">
                                                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                                <input
                                                    type="number"
                                                    value={quizDetails.timeLimit}
                                                    onChange={e => setQuizDetails({ ...quizDetails, timeLimit: parseInt(e.target.value) })}
                                                    className="w-full pl-12 pr-6 py-4 border border-neutral-200 rounded-md text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Pass Criteria (%)</label>
                                            <div className="relative">
                                                <Check size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                                <input
                                                    type="number"
                                                    value={quizDetails.passingScore}
                                                    onChange={e => setQuizDetails({ ...quizDetails, passingScore: parseInt(e.target.value) })}
                                                    className="w-full pl-12 pr-6 py-4 border border-neutral-200 rounded-md text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* QUESTIONS TAB */}
                        {activeTab === 'questions' && (
                            <div className="space-y-8 animate-slide-up">
                                <div className="mb-10 flex items-end justify-between">
                                    <div>
                                        <SectionHeader className="text-3xl mt-0 mb-2">Curriculum Builder</SectionHeader>
                                        <BodyText className="text-neutral-500">Construct complex problem sets and define the absolute truth for each node.</BodyText>
                                    </div>
                                    <div className="bg-white px-4 py-2 rounded-md border border-neutral-200 shadow-sm">
                                        <MetaText className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Nodes: </MetaText>
                                        <span className="text-sm font-black text-primary-600">{questions.length}</span>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {questions.map((q, qIdx) => (
                                        <Card key={q.id} className="p-10 border-neutral-100 shadow-xl relative group overflow-hidden">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-primary-600"></div>

                                            <div className="flex items-start gap-6">
                                                <div className="mt-2 text-neutral-200 cursor-move hover:text-neutral-400 transition-colors">
                                                    <GripVertical size={24} />
                                                </div>
                                                <div className="flex-1 space-y-6">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <input
                                                            value={q.text}
                                                            onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
                                                            placeholder="State the core problem node..."
                                                            className="w-full text-2xl font-black text-neutral-900 placeholder:text-neutral-100 border-none focus:ring-0 p-0 bg-transparent leading-tight"
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => removeQuestion(qIdx)}
                                                            className="h-10 w-10 p-0 text-neutral-300 hover:text-error hover:bg-error/5 rounded-md flex-shrink-0"
                                                        >
                                                            <Trash2 size={20} />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {q.options.map((opt, oIdx) => (
                                                            <div key={opt.id} className={`flex items-center gap-4 p-4 rounded-md border transition-all ${opt.isCorrect ? 'bg-success/5 border-success/30 shadow-sm shadow-success/10' : 'bg-neutral-50 border-neutral-200'}`}>
                                                                <button
                                                                    onClick={() => setCorrectOption(qIdx, oIdx)}
                                                                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${opt.isCorrect ? 'border-success bg-success text-white' : 'border-neutral-300 text-transparent hover:border-neutral-400 bg-white'}`}
                                                                >
                                                                    <Check size={14} className="stroke-[3px]" />
                                                                </button>
                                                                <input
                                                                    value={opt.text}
                                                                    onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                                                                    placeholder={`Variant ${oIdx + 1}`}
                                                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-neutral-700 placeholder:text-neutral-300"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}

                                    <button
                                        onClick={addQuestion}
                                        className="w-full py-16 border-2 border-dashed border-neutral-200 rounded-md text-neutral-400 hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50/30 transition-all flex flex-col items-center justify-center group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                                            <Plus size={32} className="group-hover:scale-110 transition-transform" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-[0.3em]">Inject Question Node</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

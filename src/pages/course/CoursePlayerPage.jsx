import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    PlayCircle,
    Clock,
    Layout,
    BookOpen,
    Trophy,
    ArrowLeft,
    Settings,
    HelpCircle,
    FileText,
    Youtube,
    Link as LinkIcon,
    Zap,
    Check,
    Rocket,
    Target,
    ArrowRight
} from 'lucide-react';

import courseService from '../../services/course.service';
import Container from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Title, BodyText, Label, MetaText, SectionHeader } from '../../components/ui/Typography';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

export default function CoursePlayerPage() {
    const { courseSlug, topicSlug } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [activeTopic, setActiveTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [topicLoading, setTopicLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedModules, setExpandedModules] = useState({});

    // Fetch course metadata and curriculum
    const loadCourse = async () => {
        try {
            setLoading(true);
            const data = await courseService.getDetails(courseSlug);
            setCourse(data);

            // If topicSlug is provided, find and load that topic
            if (topicSlug) {
                const topic = data.modules?.flatMap(m => m.topics).find(t => t.slug === topicSlug);
                if (topic) {
                    loadTopic(topic._id);
                } else {
                    // Fallback to first topic if topic slug is invalid
                    if (data.modules?.[0]?.topics?.[0]) {
                        navigate(`/dashboard/roadmap/${courseSlug}/${data.modules[0].topics[0].slug}`, { replace: true });
                    }
                }
            } else if (data.modules?.[0]?.topics?.[0]) {
                // If no topicSlug, redirect to first topic
                navigate(`/dashboard/roadmap/${courseSlug}/${data.modules[0].topics[0].slug}`, { replace: true });
            }
        } catch (err) {
            setError("Failed to load course details.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch full topic content
    const loadTopic = async (topicId) => {
        try {
            setTopicLoading(true);
            const data = await courseService.getTopic(topicId);
            setActiveTopic(data);
        } catch (err) {
            console.error("Failed to load topic:", err);
        } finally {
            setTopicLoading(false);
        }
    };

    const [revisionMode, setRevisionMode] = useState(false);

    // Toggle module expansion
    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Filtered modules and topics
    const filteredModules = useMemo(() => {
        if (!course?.modules) return [];
        if (!searchQuery) return course.modules;

        return course.modules.map(m => ({
            ...m,
            topics: m.topics.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
        })).filter(m => m.topics.length > 0);
    }, [course, searchQuery]);

    // Update status in the new topicStatuses model
    const handleComplete = async () => {
        if (!activeTopic || !course) return;
        try {
            await courseService.completeTopic(course._id, activeTopic._id);
            // Refresh course data to update completion checkmarks and status
            const updatedCourse = await courseService.getDetails(courseSlug);
            setCourse(updatedCourse);
        } catch (err) {
            console.error("Failed to complete topic:", err);
        }
    };

    useEffect(() => {
        loadCourse();
    }, [courseSlug]);

    useEffect(() => {
        if (course && topicSlug) {
            const topic = course.modules?.flatMap(m => m.topics).find(t => t.slug === topicSlug);
            if (topic && topic._id !== activeTopic?._id) {
                loadTopic(topic._id);
            }
        }
    }, [topicSlug, course]);

    // Auto-expand the module containing the active topic
    useEffect(() => {
        if (course && topicSlug) {
            const module = course.modules?.find(m => m.topics.some(t => t.slug === topicSlug));
            if (module) {
                setExpandedModules(prev => ({ ...prev, [module._id]: true }));
            }
        }
    }, [topicSlug, course]);

    const progressPercent = useMemo(() => {
        if (!course?.modules) return 0;
        const totalTopics = course.totalTopics || course.modules.reduce((acc, m) => acc + (m.topics?.length || 0), 0);
        const completedCount = course.userProgress?.completedTopics?.length || 0;
        return totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
    }, [course]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-mesh">
            <LoadingSpinner size={64} />
            <p className="mt-8 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Workspace...</p>
        </div>
    );

    if (error) return (
        <Container className="py-20">
            <ErrorState title="Course Unavailable" message={error} onRetry={loadCourse} />
        </Container>
    );

    return (
        <div className="h-screen bg-mesh flex flex-col font-sans overflow-hidden">
            {/* 1. TOP HEADER (WORKSPACE TOOLBAR) */}
            <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 z-40 px-8 py-4 flex-shrink-0">
                <div className="max-w-[1700px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/dashboard/roadmap')}
                            className="p-3 hover:bg-neutral-50 rounded-2xl transition-all text-neutral-400 hover:text-neutral-900 group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="h-10 w-[1px] bg-neutral-100 mx-2" />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Curriculum</Label>
                                <span className="text-neutral-200">/</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 truncate max-w-[200px]">{course.title}</span>
                            </div>
                            <Title className="text-xl font-black text-neutral-900 leading-none tracking-tight truncate max-w-[400px]">
                                {activeTopic?.title || 'Overview'}
                            </Title>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden lg:flex flex-col items-end">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">Mastery Progress</Label>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-neutral-900">{progressPercent}%</span>
                                <div className="h-1.5 w-32 bg-neutral-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-600 transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="h-10 w-[1px] bg-neutral-100 mx-2" />
                        <div className="flex gap-3">
                            <Button
                                variant="white"
                                className="px-5 font-black text-[10px] uppercase tracking-widest"
                                onClick={() => setRevisionMode(!revisionMode)}
                            >
                                {revisionMode ? 'STUDY MODE' : 'REVISION MODE'}
                            </Button>
                            <Button
                                variant="primary"
                                className="px-8 font-black shadow-premium active:scale-95"
                                onClick={handleComplete}
                            >
                                COMPLETE TOPIC
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. MAIN WORKBENCH */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* CURRICULUM SIDEBAR (GLASS PANEL) */}
                <aside
                    className={`bg-white/40 backdrop-blur-xl border-r border-white/20 transition-all duration-500 overflow-hidden z-30 flex flex-col ${sidebarOpen ? 'w-[450px]' : 'w-0 opacity-0'
                        }`}
                >
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400">Course Syllabus</h3>
                            <Badge variant="neutral" className="text-[8px] font-black">{filteredModules.length} Modules</Badge>
                        </div>
                        <div className="relative">
                            <Label className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                <Search size={14} />
                            </Label>
                            <input
                                type="text"
                                placeholder="Find a concept..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white/50 border-2 border-white/20 rounded-[2rem] text-sm font-medium focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all placeholder:text-neutral-400"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-4">
                        {filteredModules.map((m, mIdx) => {
                            const isExpanded = expandedModules[m._id];
                            return (
                                <div key={m._id} className="group">
                                    <button
                                        onClick={() => toggleModule(m._id)}
                                        className={`w-full p-6 flex items-center justify-between rounded-[2.5rem] transition-all duration-300 ${isExpanded ? 'bg-white shadow-soft translate-x-1' : 'hover:bg-white/50'}`}
                                    >
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em]">Module {mIdx + 1}</span>
                                            <span className="text-base font-black text-neutral-900 text-left leading-tight group-hover:text-primary-600 transition-colors">{m.title}</span>
                                        </div>
                                        <div className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-primary-600 text-white rotate-90' : 'bg-neutral-50 text-neutral-400 group-hover:bg-white'}`}>
                                            <ChevronRight size={16} />
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="mt-3 space-y-2 pl-4 pr-2">
                                            {m.topics?.map((t) => {
                                                const isCompleted = course.userProgress?.completedTopics?.includes(t._id);
                                                const isActive = topicSlug === t.slug;
                                                return (
                                                    <button
                                                        key={t._id}
                                                        onClick={() => navigate(`/dashboard/roadmap/${courseSlug}/${t.slug}`)}
                                                        className={`w-full flex items-center gap-5 p-5 rounded-3xl text-left transition-all relative overflow-hidden group/topic ${isActive
                                                            ? 'bg-neutral-900 text-white shadow-2xl scale-[1.02] z-10'
                                                            : 'hover:bg-white'
                                                            }`}
                                                    >
                                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />}
                                                        <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 text-white' : isActive ? 'bg-white/10 text-white' : 'bg-neutral-50 text-neutral-400 group-hover/topic:bg-primary-50 group-hover/topic:text-primary-600'
                                                            }`}>
                                                            {isCompleted ? <Check size={18} strokeWidth={3} /> : isActive ? <PlayCircle size={18} strokeWidth={3} /> : <BookOpen size={18} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-black truncate tracking-tighter ${isActive ? 'text-white' : 'text-neutral-700'}`}>
                                                                {t.title}
                                                            </p>
                                                            {isCompleted && !isActive && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Mastered</span>}
                                                        </div>
                                                        {!isActive && isCompleted && <CheckCircle2 size={16} className="text-emerald-500" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* LESSON CONTENT VIEW (IMMERSIVE) */}
                <main className="flex-1 overflow-y-auto bg-white/40 relative backdrop-blur-sm scroll-smooth">
                    {/* Toggle Sidebar Action */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`fixed bottom-12 left-12 h-14 w-14 glass-panel text-white rounded-3xl flex items-center justify-center z-50 transition-all hover:scale-110 hover:-translate-y-1 active:scale-95 ${sidebarOpen ? '' : 'translate-x-[-20px]'}`}
                    >
                        {sidebarOpen ? <X size={20} /> : <Layout size={20} />}
                    </button>

                    {topicLoading ? (
                        <div className="h-full flex flex-col items-center justify-center animate-pulse">
                            <BrainCircuit size={48} className="text-primary-600 mb-6" />
                            <p className="text-neutral-400 font-black uppercase tracking-[0.3em] text-[10px]">Decoding Concept...</p>
                        </div>
                    ) : activeTopic ? (
                        <div className="max-w-[1000px] mx-auto px-12 lg:px-24 py-24 animate-fade-in pb-60">
                            {/* CONTENT HERO */}
                            <div className="mb-20">
                                <Badge variant="primary" className="mb-6 px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.3em]">Knowledge Hub</Badge>
                                <h2 className="heading-xl mb-8 tracking-tighter">{activeTopic.title}</h2>
                                <div className="flex items-center gap-10">
                                    <div className="flex items-center gap-3 text-neutral-400">
                                        <Clock size={16} />
                                        <span className="text-xs font-black uppercase tracking-widest leading-none">15 Min Lesson</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-400">
                                        <BrainCircuit size={16} />
                                        <span className="text-xs font-black uppercase tracking-widest leading-none">Medium Difficulty</span>
                                    </div>
                                </div>
                            </div>

                            {/* LESSON BODY */}
                            <div className="space-y-24">
                                {/* 1. EXPLANATION */}
                                <section className="space-y-10 group">
                                    <SectionHeader className="text-[10px] uppercase tracking-[0.4em] text-primary-600 font-black flex items-center gap-4 group-hover:gap-6 transition-all">
                                        Concept Deep Dive <div className="h-[1px] flex-1 bg-primary-100" />
                                    </SectionHeader>
                                    <div className="prose prose-2xl prose-slate max-w-none">
                                        <div className="whitespace-pre-wrap text-2xl text-neutral-600 leading-[1.6] font-medium tracking-tight">
                                            {activeTopic.explanation}
                                        </div>
                                    </div>
                                </section>

                                {/* 2. LIVE EXAMPLES */}
                                {activeTopic.examples?.length > 0 && (
                                    <section className="space-y-12">
                                        <SectionHeader className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-black flex items-center gap-4">
                                            Interactive Sandbox <div className="h-[1px] flex-1 bg-neutral-100" />
                                        </SectionHeader>
                                        <div className="space-y-12">
                                            {activeTopic.examples.map((example, idx) => (
                                                <div key={idx} className="bg-neutral-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 group ring-1 ring-white/10 hover:ring-primary-500/50 transition-all duration-500 scale-100 hover:scale-[1.01]">
                                                    <div className="px-10 py-6 bg-white/5 flex justify-between items-center border-b border-white/5">
                                                        <div className="flex items-center gap-5">
                                                            <div className="flex gap-2">
                                                                <div className="w-3 h-3 rounded-full bg-error-500/50" />
                                                                <div className="w-3 h-3 rounded-full bg-warning-500/50" />
                                                                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                                            </div>
                                                            <div className="h-6 w-[1px] bg-white/10 mx-2" />
                                                            <Badge variant="primary" className="bg-primary-500/20 text-primary-400 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">{example.language || 'JS'}</Badge>
                                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{example.label || 'Snippet'}</span>
                                                        </div>
                                                        <Button
                                                            variant="glass"
                                                            size="sx"
                                                            className="text-white bg-white/5 hover:bg-white/20 border-white/10"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(example.code);
                                                            }}
                                                        >
                                                            COPY SOURCE
                                                        </Button>
                                                    </div>
                                                    <pre className="p-12 text-lg overflow-x-auto selection:bg-primary-500/40">
                                                        <code className="text-secondary-100 font-mono leading-relaxed block">
                                                            {example.code}
                                                        </code>
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* 3. PRACTICE MISSION */}
                                <Card variant="premium" className="p-12 border-none bg-primary-600 text-white rounded-[3.5rem] relative overflow-hidden group shadow-premium hover:shadow-premium-hover">
                                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                                        <Target size={240} fill="currentColor" />
                                    </div>
                                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                                        <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-white border border-white/10 shrink-0">
                                            <Zap size={40} className="animate-pulse" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <Label className="text-primary-100 block mb-4 uppercase tracking-[0.3em] font-black">Skills Laboratory</Label>
                                            <h4 className="text-4xl font-black mb-6 tracking-tighter">Practical Mission</h4>
                                            <p className="text-primary-50 text-xl leading-relaxed font-medium opacity-80">Apply what you've learned. Build a dynamic module using the concepts from this lesson and earn bonus experience points.</p>
                                        </div>
                                        <Button variant="white" className="px-12 py-6 font-black shrink-0 text-lg rounded-2xl">OPEN WORKSPACE</Button>
                                    </div>
                                </Card>

                                {/* 4. MASTERY VALIDATION */}
                                <Card variant="glass" className="p-16 border-none bg-neutral-900 text-white rounded-[3.5rem] relative overflow-hidden group shadow-2xl">
                                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                                        <Trophy size={200} fill="currentColor" />
                                    </div>
                                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                                        <Badge variant="primary" className="bg-primary-500/20 text-primary-400 border-none px-4 py-1.5 mb-8 font-black text-[10px] uppercase tracking-[0.4em]">Checkpoint</Badge>
                                        <h4 className="text-5xl font-black mb-8 tracking-tighter">Knowledge Validation</h4>
                                        <p className="text-neutral-400 text-xl mb-12 leading-relaxed font-medium">To unlock the next phase of your roadmap, you must demonstrate mastery of these concepts through our adaptive testing module.</p>
                                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                            <Button
                                                variant="premium"
                                                className="px-12 py-6 font-black rounded-2xl text-xl grow"
                                                onClick={() => navigate(`/dashboard/quizzes/start`, { state: { topicId: activeTopic._id, courseId: course._id } })}
                                            >
                                                START MASTERY TEST
                                            </Button>
                                            <Button
                                                variant="glass"
                                                className="px-10 py-6 font-black rounded-2xl text-xl"
                                                onClick={() => setRevisionMode(true)}
                                            >
                                                PRACTICE FLASHCARDS
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-20 text-center animate-fade-in">
                            <div className="w-32 h-32 bg-white rounded-[3rem] shadow-premium flex items-center justify-center text-primary-600 mb-10 border border-neutral-50 shadow-soft">
                                <Rocket size={48} />
                            </div>
                            <EmptyState
                                title="Select a Concept"
                                description="Choose a topic from the curriculum to begin your immersive learning experience."
                                icon={Search}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

import { Search } from 'lucide-react';

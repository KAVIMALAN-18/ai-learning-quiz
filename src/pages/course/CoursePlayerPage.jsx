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
    Check
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
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lessonLoading, setLessonLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Fetch course metadata and curriculum
    const loadCourse = async () => {
        try {
            setLoading(true);
            const data = await courseService.getDetails(courseSlug);
            setCourse(data);

            // If topicSlug is provided, find and load that lesson
            if (topicSlug) {
                const lesson = data.modules?.flatMap(m => m.lessons).find(l => l.slug === topicSlug);
                if (lesson) {
                    loadLesson(lesson._id);
                } else {
                    // Fallback to first lesson if topic slug is invalid
                    if (data.modules?.[0]?.lessons?.[0]) {
                        navigate(`/dashboard/roadmap/${courseSlug}/${data.modules[0].lessons[0].slug}`, { replace: true });
                    }
                }
            } else if (data.modules?.[0]?.lessons?.[0]) {
                // If no topicSlug, redirect to first lesson
                navigate(`/dashboard/roadmap/${courseSlug}/${data.modules[0].lessons[0].slug}`, { replace: true });
            }
        } catch (err) {
            setError("Failed to load course details.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch full lesson content
    const loadLesson = async (lessonId) => {
        try {
            setLessonLoading(true);
            const data = await courseService.getLesson(lessonId);
            setActiveLesson(data);
        } catch (err) {
            console.error("Failed to load lesson:", err);
        } finally {
            setLessonLoading(false);
        }
    };

    const handleComplete = async () => {
        if (!activeLesson || !course) return;
        try {
            await courseService.completeLesson(course._id, activeLesson._id);
            // Refresh course data to update completion checkmarks
            const updatedCourse = await courseService.getDetails(courseSlug);
            setCourse(updatedCourse);
            // Move to next lesson if available?
        } catch (err) {
            console.error("Failed to complete lesson:", err);
        }
    };

    useEffect(() => {
        loadCourse();
    }, [courseSlug]);

    useEffect(() => {
        if (course && topicSlug) {
            const lesson = course.modules?.flatMap(m => m.lessons).find(l => l.slug === topicSlug);
            if (lesson && lesson._id !== activeLesson?._id) {
                loadLesson(lesson._id);
            }
        }
    }, [topicSlug, course]);

    const progressPercent = useMemo(() => {
        if (!course?.modules) return 0;
        const totalLessons = course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
        const completedCount = course.userProgress?.completedLessons?.length || 0;
        return totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    }, [course]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <LoadingSpinner size={48} />
            <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Preparing your learning environment...</p>
        </div>
    );

    if (error) return (
        <Container className="py-20">
            <ErrorState title="Course Unavailable" message={error} onRetry={loadCourse} />
        </Container>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* 1. TOP HEADER (CLEAN & MINIMAL) */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-40 px-8 py-5">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/dashboard/roadmap')}
                            className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 px-2 py-0.5 bg-primary-50 rounded-md">Roadmap</Label>
                                <span className="text-slate-300">/</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{course.title}</span>
                            </div>
                            <Title className="text-2xl font-black text-slate-900 leading-none tracking-tight">{activeLesson?.title || 'Loading...'}</Title>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden lg:flex flex-col items-end">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Course Completion</Label>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black text-slate-900">{progressPercent}%</span>
                                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-600 transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <Button variant="primary" className="px-8 font-black shadow-lg shadow-primary-600/10">MARK AS DONE</Button>
                    </div>
                </div>
            </header>

            {/* 2. MAIN WORKBENCH */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* CURRICULUM SIDEBAR */}
                <aside
                    className={`bg-white border-r border-slate-100 transition-all duration-300 overflow-y-auto z-30 ${sidebarOpen ? 'w-[380px]' : 'w-0 opacity-0 -translate-x-full'
                        }`}
                >
                    <div className="p-8 border-b border-slate-50">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Course Syllabus</h3>
                    </div>
                    <div className="p-4 space-y-2">
                        {course.modules?.map((m, mIdx) => (
                            <div key={m._id} className="space-y-1">
                                <div className="px-4 py-3 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{m.title}</span>
                                </div>
                                <div className="space-y-1">
                                    {m.lessons?.map((l) => {
                                        const isCompleted = course.userProgress?.completedLessons?.includes(l._id);
                                        const isActive = topicSlug === l.slug;
                                        return (
                                            <button
                                                key={l._id}
                                                onClick={() => navigate(`/dashboard/roadmap/${courseSlug}/${l.slug}`)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all group ${isActive
                                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-1'
                                                    : 'hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isCompleted ? 'bg-success text-white' : isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'
                                                    }`}>
                                                    {isCompleted ? <Check size={14} /> : isActive ? <PlayCircle size={14} /> : <BookOpen size={14} />}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-700'}`}>
                                                        {l.title}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* TOPIC CONTENT PANEL */}
                <main className="flex-1 overflow-y-auto bg-white relative scrollbar-hide">
                    {/* Toggle Sidebar Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="fixed bottom-10 left-10 bg-slate-900 text-white shadow-2xl rounded-2xl p-4 z-50 hover:scale-110 transition-all active:scale-95"
                    >
                        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>

                    {lessonLoading ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <LoadingSpinner />
                            <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading topic content...</p>
                        </div>
                    ) : activeLesson ? (
                        <div className="max-w-[900px] mx-auto px-8 lg:px-16 py-20 animate-fade-in pb-40">
                            {/* 1. EXPLANATION */}
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <SectionHeader className="text-[10px] uppercase tracking-[0.3em] text-primary-600 font-black decoration-primary-600/30 decoration-4 underline-offset-8">Concept Breakdown</SectionHeader>
                                    <div className="prose prose-slate max-w-none">
                                        <div className="whitespace-pre-wrap text-xl text-slate-600 leading-relaxed font-medium">
                                            {activeLesson.content}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. EXAMPLES & CODE SNIPPETS */}
                                {activeLesson.codeSnippets?.length > 0 && (
                                    <div className="space-y-10">
                                        <SectionHeader className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black">Live Code Examples</SectionHeader>
                                        <div className="space-y-8">
                                            {activeLesson.codeSnippets.map((code, idx) => (
                                                <div key={idx} className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 group">
                                                    <div className="px-8 py-4 bg-slate-800/50 flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex gap-1.5">
                                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                                            </div>
                                                            <span className="ml-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{code.label || code.language}</span>
                                                        </div>
                                                        <button className="text-[10px] font-black text-primary-400 hover:text-white transition-colors uppercase tracking-widest px-4 py-1.5 bg-white/5 rounded-full">Copy Source</button>
                                                    </div>
                                                    <pre className="p-10 text-sm overflow-x-auto">
                                                        <code className="text-slate-300 font-mono leading-relaxed block">
                                                            {code.code}
                                                        </code>
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 3. PRACTICE TASKS */}
                                <Card className="p-10 border-none bg-slate-50 rounded-[2.5rem] relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-primary-600 shadow-xl shadow-primary-600/5 shrink-0 border border-slate-100">
                                            <Target size={32} />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h4 className="text-2xl font-black text-slate-900 mb-2">Practice Task</h4>
                                            <p className="text-slate-500 font-medium text-lg leading-relaxed">Implement the concepts learned in this topic to build a small real-world module. Submit your code for AI review.</p>
                                        </div>
                                        <Button className="px-10 py-5 font-black shrink-0 shadow-premium">OPEN CODELAB</Button>
                                    </div>
                                </Card>

                                {/* 4. MINI QUIZ */}
                                <Card className="p-12 border-none bg-indigo-600 text-white rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-indigo-600/20">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                        <Zap size={180} fill="currentColor" />
                                    </div>
                                    <div className="relative z-10 text-center max-w-xl mx-auto">
                                        <Label className="text-indigo-200 block mb-4 uppercase tracking-[0.3em] font-black">Knowledge Check</Label>
                                        <h4 className="text-4xl font-black mb-6">Take the Mastery Test</h4>
                                        <p className="text-indigo-100 text-lg mb-10 leading-relaxed font-medium">You need to pass this 5-minute quiz with at least 80% to unlock the next topic in the roadmap.</p>
                                        <Button
                                            fullWidth
                                            variant="secondary"
                                            className="bg-white text-indigo-600 hover:bg-slate-50 border-none font-black py-5 rounded-2xl shadow-premium text-lg tracking-tight"
                                            onClick={() => navigate(`/dashboard/quizzes/start`, { state: { lessonId: activeLesson._id, courseId: course._id } })}
                                        >
                                            START MINI TEST <ArrowRight size={20} className="ml-2" />
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-20 text-center">
                            <EmptyState
                                title="Ready to begin?"
                                description="Select the first topic from the course syllabus to start your journey towards mastery."
                                icon={Rocket}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

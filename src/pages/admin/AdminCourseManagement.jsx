import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.client';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Container from '../../components/ui/Container';
import { Title, SectionHeader, BodyText, MetaText, Label } from '../../components/ui/Typography';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    BookOpen,
    Clock,
    RefreshCw,
    Layers,
    ChevronRight,
    PlayCircle
} from 'lucide-react';

export default function AdminCourseManagement() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await api.get('/courses'); // Reuse the list endpoint
            setCourses(res || []);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this course and all its contents?')) return;
        try {
            await api.delete(`/admin/courses/${id}`);
            setCourses(courses.filter(c => c._id !== id));
        } catch (err) {
            alert("Delete failed: " + (err.response?.data?.message || err.message));
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container className="py-10 animate-fade-in pb-20">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-neutral-100">
                    <div>
                        <Label className="uppercase font-black tracking-[0.3em] text-primary-600 block mb-2 text-xs">
                            Curriculum Master
                        </Label>
                        <Title className="text-4xl text-slate-900">Manage Courses</Title>
                        <BodyText className="mt-2 text-slate-500 max-w-xl">
                            Design structured learning paths and oversee the academic syllabus.
                        </BodyText>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => alert("Course creation modal or page would open here.")}
                            className="shadow-xl shadow-primary-600/20 px-8"
                        >
                            <Plus size={20} className="mr-2" /> CREATE COURSE
                        </Button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search curriculum by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
                    </div>
                    <Button variant="outline" onClick={fetchCourses} className="bg-white p-3.5 rounded-lg border-slate-200">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </Button>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {loading ? (
                        [1, 2].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
                    ) : filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <Card key={course._id} className="p-0 border-slate-200 shadow-xl overflow-hidden rounded-[2rem] group">
                                <div className="flex flex-col h-full">
                                    <div className="h-40 relative">
                                        <img
                                            src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600'}
                                            className="w-full h-full object-cover"
                                            alt={course.title}
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40" />
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="primary" className="bg-white/20 backdrop-blur-md text-white border-white/30">{course.difficulty}</Badge>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-black text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors uppercase tracking-tight">{course.title}</h3>
                                        <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">{course.description}</p>

                                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <Layers size={14} /> {course.modulesCount || 0} Modules
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <Clock size={14} /> {course.estimatedTime}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/dashboard/admin/courses/${course._id}/edit`)}
                                                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all border border-slate-100"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course._id)}
                                                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button
                                                    className="ml-2 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-primary-600 transition-all shadow-lg"
                                                    onClick={() => navigate(`/dashboard/roadmap/${course.slug}`)}
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-3xl">
                            <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">No courses in repository</h3>
                            <p className="text-slate-500 mt-2">Start building your academic syllabus by creating your first course.</p>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}

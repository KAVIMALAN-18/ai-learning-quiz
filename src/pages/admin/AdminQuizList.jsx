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
    Eye,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpDown,
    RefreshCw
} from 'lucide-react';

export default function AdminQuizList() {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/quizzes');
            setQuizzes(res.data.quizzes || []);
        } catch (err) {
            console.error("Failed to fetch quizzes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this assessment?')) return;
        try {
            await api.delete(`/admin/quizzes/${id}`);
            setQuizzes(quizzes.filter(q => q._id !== id));
        } catch (err) {
            alert("Delete failed: " + (err.response?.data?.message || err.message));
        }
    };

    const filteredQuizzes = quizzes.filter(q => {
        const matchesSearch = q.title?.toLowerCase().includes(search.toLowerCase()) ||
            q.topic?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || q.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <Container className="py-10 animate-fade-in pb-20">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-neutral-100">
                    <div>
                        <Label className="uppercase font-black tracking-[0.3em] text-primary-600 block mb-2 text-xs">
                            Content Management
                        </Label>
                        <Title className="text-4xl text-slate-900">Quiz Repository</Title>
                        <BodyText className="mt-2 text-slate-500 max-w-xl">
                            Architect and oversee the assessment library for all learning paths.
                        </BodyText>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => navigate('/dashboard/admin/quizzes/new')}
                            className="shadow-xl shadow-primary-600/20"
                        >
                            <Plus size={20} className="mr-2" /> Create Assessment
                        </Button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search repository by title or topic..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg focus:ring-primary-500 p-3.5 outline-none shadow-sm min-w-[160px]"
                        >
                            <option value="All">All Status</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                        </select>
                        <Button variant="outline" onClick={fetchQuizzes} className="bg-white p-3.5 rounded-lg border-slate-200">
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <Card className="border-slate-200 shadow-xl overflow-hidden p-0 rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Description</th>
                                    <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Category</th>
                                    <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Complexity</th>
                                    <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Status</th>
                                    <th className="px-8 py-5 text-right text-[10px] uppercase font-black tracking-widest text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i}>
                                            <td colSpan="5" className="px-8 py-6"><Skeleton className="h-12 w-full" /></td>
                                        </tr>
                                    ))
                                ) : filteredQuizzes.length > 0 ? (
                                    filteredQuizzes.map((quiz) => (
                                        <tr key={quiz._id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{quiz.title || quiz.topic}</p>
                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">ID: {quiz._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate max-w-[120px]">{quiz.topic}</span>
                                                    <span className="text-xs font-bold text-slate-700">{quiz.questions?.length || 0} Questions</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant="neutral" size="sm" className="bg-slate-100 text-slate-600 border-none font-bold uppercase tracking-widest">
                                                    {quiz.difficulty || 'General'}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Published
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/dashboard/admin/quizzes/${quiz._id}/edit`)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors hover:bg-indigo-50 rounded-lg"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(quiz._id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors hover:bg-rose-50 rounded-lg"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <AlertCircle size={40} className="mx-auto mb-4 text-slate-200" />
                                            <h3 className="text-xl font-bold text-slate-900">No assessments found</h3>
                                            <p className="text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </Container>
    );
}

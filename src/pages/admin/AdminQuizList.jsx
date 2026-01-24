import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Container from '../../components/ui/Container';
import { Title, SectionHeader, BodyText, MetaText } from '../../components/ui/Typography';
import {
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    Eye,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpDown
} from 'lucide-react';

export default function AdminQuizList() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    // Mock Data
    const [quizzes, setQuizzes] = useState([
        { id: 1, title: "React Essentials Certification", category: "React", difficulty: "Beginner", questions: 15, time: 25, status: "Published", author: "Admin" },
        { id: 2, title: "Advanced Node.js Patterns", category: "Node.js", difficulty: "Advanced", questions: 20, time: 45, status: "Draft", author: "Admin" },
        { id: 3, title: "CSS Grid Masterclass", category: "CSS", difficulty: "Intermediate", questions: 12, time: 20, status: "Published", author: "Admin" },
        { id: 4, title: "Python Data Structures", category: "Python", difficulty: "Intermediate", questions: 10, time: 15, status: "Published", author: "Admin" },
    ]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            setQuizzes(quizzes.filter(q => q.id !== id));
        }
    };

    return (
        <Container className="py-10 animate-fade-in pb-20">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-neutral-100">
                    <div>
                        <MetaText className="uppercase font-black tracking-[0.3em] text-primary-600 block mb-2">
                            Content Management
                        </MetaText>
                        <Title className="text-4xl">Quiz Repository</Title>
                        <BodyText className="mt-2 text-neutral-500 max-w-xl">
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
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-neutral-100 p-2 rounded-lg">
                    <div className="flex gap-2 w-full md:w-96">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search repository..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border-neutral-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <Button variant="outline" className="bg-white h-[46px] w-[46px] p-0 shadow-sm border-neutral-200">
                            <ArrowUpDown size={18} />
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <MetaText className="hidden sm:inline font-black uppercase tracking-widest text-[10px]">Filter Status:</MetaText>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-white border border-neutral-200 text-neutral-900 text-xs font-black uppercase tracking-widest rounded-md focus:ring-primary-500 p-3 outline-none shadow-sm min-w-[140px]"
                        >
                            <option value="All">All Status</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                        </select>
                    </div>
                </div>

                {/* Quiz Table */}
                <Card className="border-neutral-100 shadow-xl overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                                    <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-neutral-400">Assessment Description</th>
                                    <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-neutral-400">Metadata</th>
                                    <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-neutral-400">Compliance</th>
                                    <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-neutral-400">Status</th>
                                    <th className="px-8 py-5 text-right text-[10px] uppercase font-black tracking-widest text-neutral-400">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {quizzes.map((quiz) => (
                                    <tr key={quiz.id} className="group hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${quiz.category === 'React' ? 'bg-primary-50 text-primary-600' :
                                                    quiz.category === 'Node.js' ? 'bg-secondary-50 text-secondary-600' :
                                                        'bg-neutral-100 text-neutral-600'
                                                    }`}>
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-neutral-900 group-hover:text-primary-600 transition-colors">{quiz.title}</p>
                                                    <MetaText className="text-[10px] uppercase font-bold tracking-widest">UID: 00{quiz.id}-ST7</MetaText>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{quiz.category}</span>
                                                <span className="text-xs font-bold text-neutral-900">{quiz.questions} Questions</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${quiz.difficulty === 'Beginner' ? 'text-success bg-success/5 border-success/10' :
                                                quiz.difficulty === 'Intermediate' ? 'text-primary-600 bg-primary-50 border-primary-100' :
                                                    'text-error bg-error/5 border-error/10'
                                                }`}>
                                                {quiz.difficulty}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {quiz.status === 'Published' ? (
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-success">
                                                    <CheckCircle2 size={14} className="fill-success/10" /> Active
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                                    <Clock size={14} /> Staged
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-primary-50 hover:text-primary-600 rounded-md">
                                                    <Eye size={18} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="h-9 w-9 p-0 hover:bg-secondary-50 hover:text-secondary-600 rounded-md"
                                                    onClick={() => navigate(`/dashboard/admin/quizzes/${quiz.id}/edit`)}
                                                >
                                                    <Edit3 size={18} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="h-9 w-9 p-0 hover:bg-error/5 hover:text-error rounded-md"
                                                    onClick={() => handleDelete(quiz.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {quizzes.length === 0 && (
                        <div className="p-20 text-center">
                            <AlertCircle size={48} className="mx-auto mb-6 text-neutral-200" />
                            <Title className="text-xl mb-2">Repository Empty</Title>
                            <BodyText className="text-neutral-500">No assessments found matching your current parameters.</BodyText>
                        </div>
                    )}
                </Card>
            </div>
        </Container>
    );
}

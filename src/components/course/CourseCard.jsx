import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import Badge from '../ui/Badge';
import {
    Clock,
    Users,
    BookOpen,
    ArrowRight,
    TrendingUp,
    Zap,
    Cpu,
    Brain,
    Database,
    Cloud,
    Layout,
    Layers,
    Server,
    Terminal,
    Code,
    Smartphone,
    MessageSquare,
    Box,
    Coffee
} from 'lucide-react';
import { MetaText, Label } from '../ui/Typography';

const iconMap = {
    'python': Code,
    'coffee': Coffee,
    'terminal': Terminal,
    'code': Code,
    'server': Server,
    'layout': Layout,
    'layers': Layers,
    'database': Database,
    'smartphone': Smartphone,
    'cpu': Cpu,
    'brain': Brain,
    'message-square': MessageSquare,
    'cloud': Cloud,
    'box': Box,
};

const difficultyColors = {
    'Beginner': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Intermediate': 'bg-blue-50 text-blue-600 border-blue-100',
    'Advanced': 'bg-purple-50 text-purple-600 border-purple-100'
};

export default function CourseCard({ course }) {
    const navigate = useNavigate();

    // Support both backend (difficulty) and frontend (level) fields
    const difficulty = course.difficulty || course.level || 'Beginner';
    const thumbnail = course.thumbnail || course.image;
    const estimatedTime = course.estimatedTime || course.duration;
    const modulesCount = course.totalModules || course.modules?.length || 0;
    const enrolledCount = course.enrollmentCount || course.enrolled || 0;
    const progress = course.progress || 0; // In case we pass progress from backend

    const IconComponent = iconMap[course.icon] || BookOpen;

    const handleCardClick = () => {
        navigate(`/dashboard/roadmap/${course.slug || course.id}`);
    };

    return (
        <Card
            className="group relative overflow-hidden bg-white border-none shadow-premium hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Image Overlay with Gradient */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Float Badge */}
                <div className="absolute top-6 left-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
                        <IconComponent className="w-5 h-5 text-white" />
                    </div>
                </div>

                <div className="absolute top-6 right-6">
                    <Badge className={`${difficultyColors[difficulty]} border font-black uppercase text-[9px] tracking-widest px-3 py-1 bg-white shadow-xl`}>
                        {difficulty}
                    </Badge>
                </div>

                {/* Progress Overlay (if any) */}
                {progress > 0 && (
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex justify-between items-end mb-2">
                            <Label className="text-white text-[10px] font-black uppercase tracking-widest">Progress</Label>
                            <span className="text-white text-xs font-black">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-500 transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-8 space-y-4">
                <div>
                    <MetaText className="text-primary-600 font-black uppercase tracking-[0.2em] text-[9px] mb-2 block">
                        {course.category}
                    </MetaText>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-primary-600 transition-colors">
                        {course.title}
                    </h3>
                </div>

                <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
                    {course.description}
                </p>

                {/* Stats Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</Label>
                            <div className="flex items-center gap-1.5 text-slate-700 font-black text-xs">
                                <Clock className="w-3.5 h-3.5 text-slate-300" />
                                {estimatedTime}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Curriculum</Label>
                            <div className="flex items-center gap-1.5 text-slate-700 font-black text-xs">
                                <BookOpen className="w-3.5 h-3.5 text-slate-300" />
                                {modulesCount} Units
                            </div>
                        </div>
                    </div>

                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 group-hover:rotate-12">
                        <ArrowRight size={18} />
                    </div>
                </div>
            </div>
        </Card>
    );
}

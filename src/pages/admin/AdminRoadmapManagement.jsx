import React, { useState, useEffect } from 'react';
import api from '../../services/api.client';
import { Card } from '../../components/ui/Card';
import { Title, BodyText, Label } from '../../components/ui/Typography';
import Container from '../../components/ui/Container';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import {
    Map,
    ExternalLink,
    RefreshCw,
    Flag,
    User,
    Clock,
    ChevronRight
} from 'lucide-react';

export const AdminRoadmapManagement = () => {
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRoadmaps = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/roadmaps');
            setRoadmaps(res.data.roadmaps || []);
        } catch (err) {
            console.error("Failed to fetch roadmaps:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoadmaps();
    }, []);

    const handleAction = (id, action) => {
        alert(`Action "${action}" on roadmap ${id} would be implemented here.`);
    };

    return (
        <Container className="py-10 space-y-8 pb-20 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <Label className="text-primary-600 block mb-2 uppercase tracking-widest font-black text-xs">Oversight</Label>
                    <Title className="text-4xl">Roadmap Management</Title>
                    <BodyText className="mt-2 text-slate-500 max-w-lg">Monitor and optimize AI-generated learning paths for all platform users.</BodyText>
                </div>
                <Button variant="outline" onClick={fetchRoadmaps} className="bg-white">
                    <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
                ) : roadmaps.length > 0 ? (
                    roadmaps.map((roadmap) => (
                        <Card key={roadmap._id} className="p-6 border-slate-100 hover:shadow-xl transition-all group overflow-hidden">
                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                                        <Map size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="neutral" size="sm" className="bg-slate-100 text-slate-600 border-none font-bold uppercase tracking-tighter">{roadmap.level}</Badge>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: {roadmap._id.slice(-6)}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight">Mastering {roadmap.topic}</h3>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400 font-medium">
                                            <span className="flex items-center gap-1.5"><User size={14} className="text-slate-300" /> {roadmap.userId?.name || 'Unknown User'}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-300" /> {new Date(roadmap.updatedAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {roadmap.steps?.length || 0} Milestones</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row lg:flex-col justify-end gap-3 self-end lg:self-auto min-w-[160px]">
                                    <button
                                        onClick={() => handleAction(roadmap._id, 'flag')}
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border-2 border-slate-100 text-slate-600 text-sm font-bold hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition-all"
                                    >
                                        <Flag size={14} /> Flag Output
                                    </button>
                                    <button
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-primary-600 transition-all shadow-lg shadow-black/5"
                                    >
                                        Inspect Steps <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Progress Mini Bar */}
                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-4">
                                <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.round(((roadmap.steps?.filter(s => s.completed).length || 0) / (roadmap.steps?.length || 1)) * 100)}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    {Math.round(((roadmap.steps?.filter(s => s.completed).length || 0) / (roadmap.steps?.length || 1)) * 100)}% Complete
                                </span>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-3xl">
                        <Map size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">No roadmaps generated yet</h3>
                        <p className="text-slate-500 mt-2">Roadmaps will appear here once users start creating learning paths.</p>
                    </div>
                )}
            </div>
        </Container>
    );
}

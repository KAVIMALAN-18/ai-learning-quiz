import React, { useState, useEffect } from 'react';
import {
    Building2,
    Calendar,
    CheckCircle2,
    ExternalLink,
    Filter,
    MoreVertical,
    Plus,
    Search,
    Clock,
    ArrowRight
} from 'lucide-react';
import careerService from '../../services/career.service';
import Container from '../../components/ui/Container';
import { Title, BodyText, Label } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const StatusBadge = ({ status }) => {
    const styles = {
        'Applied': 'bg-slate-100 text-slate-600 border-slate-200',
        'Shortlisted': 'bg-indigo-50 text-indigo-600 border-indigo-100',
        'Interviewing': 'bg-primary-50 text-primary-600 border-primary-100',
        'Offered': 'bg-success/10 text-success border-success/20',
        'Rejected': 'bg-error/10 text-error border-error/20'
    };
    return <Badge className={`${styles[status] || styles['Applied']} px-3 py-1 font-bold text-[10px]`}>{status}</Badge>;
};

export default function PlacementTracker() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPlacements = async () => {
        try {
            setLoading(true);
            const data = await careerService.getPlacements();
            setPlacements(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlacements();
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <LoadingSpinner />
        </div>
    );

    return (
        <Container className="py-10 space-y-12 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-100">
                <div>
                    <Label className="text-secondary-600 block mb-2 px-3 py-1 bg-secondary-50 w-fit rounded-lg font-bold">Applications</Label>
                    <Title className="text-5xl font-black text-slate-900 tracking-tight">Placement Pipeline</Title>
                    <BodyText className="mt-4 text-slate-500 max-w-xl text-lg font-medium">
                        Track your professional journey. From initial application to final offer letter, manage every step of your career search.
                    </BodyText>
                </div>
                <Button variant="primary" className="px-8 py-4 font-black shadow-xl shadow-primary-600/20">
                    <Plus size={18} className="mr-2" /> ADD APPLICATION
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* STATUS COLUMNS (Visual Board) */}
                {['Applied', 'Interviewing', 'Offered'].map((status) => (
                    <div key={status} className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400">{status}</h4>
                            <Badge variant="neutral" size="sm" className="bg-slate-100">{placements.filter(p => p.status === status).length}</Badge>
                        </div>
                        <div className="space-y-4">
                            {placements.filter(p => p.status === status).map(p => (
                                <Card key={p._id} className="p-6 border-none shadow-premium hover:shadow-xl transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            <Building2 size={20} />
                                        </div>
                                        <button className="text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                    <h5 className="font-black text-slate-900 group-hover:text-primary-600 transition-colors">{p.companyName}</h5>
                                    <p className="text-xs text-slate-500 font-bold mb-6 italic">{p.role}</p>

                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <Calendar size={12} /> {new Date(p.appliedDate).toLocaleDateString()}
                                    </div>
                                </Card>
                            ))}
                            {placements.filter(p => p.status === status).length === 0 && (
                                <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300">
                                    <Clock size={32} strokeWidth={1} />
                                    <p className="text-[10px] uppercase font-bold tracking-widest mt-4">Empty Slot</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* STATS & QUICK ACTIONS */}
                <div className="space-y-8">
                    <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400 px-2">Market Insights</h4>
                    <Card className="p-8 bg-slate-900 text-white border-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp size={64} />
                        </div>
                        <div className="relative z-10">
                            <Label className="text-white/40 block mb-6">Application Success</Label>
                            <div className="text-4xl font-black mb-1">12%</div>
                            <p className="text-[10px] text-success font-black uppercase tracking-widest">Interview rate</p>
                        </div>
                    </Card>

                    <Card className="p-8 border-slate-100">
                        <h4 className="font-black text-slate-900 mb-6">Upcoming Interviews</h4>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs font-black text-slate-900 mb-1">Google - L3 Interview</p>
                                <p className="text-[10px] text-slate-400 font-medium">Tomorrow, 10:30 AM</p>
                            </div>
                            <Button variant="ghost" fullWidth className="text-[10px] font-black uppercase tracking-widest text-primary-600 mt-4">VIEW CALENDAR <ArrowRight size={14} className="ml-2" /></Button>
                        </div>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

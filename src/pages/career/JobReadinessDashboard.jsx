import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Trophy,
    Briefcase,
    FileText,
    ShieldCheck,
    TrendingUp,
    Users,
    Award,
    ArrowRight,
    Target,
    Rocket
} from 'lucide-react';
import careerService from '../../services/career.service';
import Container from '../../components/ui/Container';
import { Title, SectionHeader, BodyText, Label, MetaText } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';

const SkillMeter = ({ value, label, icon: Icon, color }) => (
    <Card className="p-8 flex flex-col items-center text-center group hover:shadow-2xl transition-all border-none bg-white shadow-premium">
        <div className={`relative w-32 h-32 mb-6`}>
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100"
                />
                <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * value) / 100}
                    strokeLinecap="round"
                    className={`${color} transition-all duration-1000 ease-out`}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{value}%</span>
            </div>
        </div>
        <div className={`p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors mb-3`}>
            <Icon size={18} />
        </div>
        <Label className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">{label}</Label>
    </Card>
);

export default function JobReadinessDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            const data = await careerService.getMetrics();
            setMetrics(data);
        } catch (err) {
            setError("Failed to calculate readiness data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <LoadingSpinner size={48} />
            <MetaText className="mt-4 animate-pulse uppercase font-black text-primary-600 tracking-widest">Analyzing Career Readiness...</MetaText>
        </div>
    );

    return (
        <Container className="py-10 space-y-16 animate-fade-in pb-20">
            {/* 1. HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-100">
                <div>
                    <Label className="text-primary-600 block mb-2 px-3 py-1 bg-primary-50 w-fit rounded-lg font-bold">Career Performance</Label>
                    <Title className="text-5xl font-black text-slate-900 leading-tight tracking-tight">Job Readiness Hub</Title>
                    <BodyText className="mt-4 text-slate-500 max-w-2xl text-lg font-medium">
                        Your personalized command center for internship placements, skill validation, and industry-standard certification.
                    </BodyText>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="px-8 py-4 font-black bg-white" onClick={() => navigate('/dashboard/leaderboard')}>VIEW LEADERBOARD</Button>
                    <Button variant="primary" className="px-8 py-4 font-black shadow-xl shadow-primary-600/20" onClick={() => navigate('/dashboard/resume-builder')}>RESUME BUILDER</Button>
                </div>
            </div>

            {/* 2. OVERALL SCORE CARD */}
            <Card className="p-12 bg-slate-900 text-white border-none overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Rocket size={200} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="shrink-0 relative">
                        <div className="w-48 h-48 rounded-full border-[12px] border-white/5 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl font-black">{metrics?.overall}%</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mt-1">Readiness</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-primary-500 p-4 rounded-2xl shadow-xl shadow-primary-600/40">
                            <Award size={24} />
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-3xl font-black mb-4">You're "Placement Ready"</h3>
                        <p className="text-white/60 max-w-xl text-lg leading-relaxed mb-8">
                            Based on your current scores, you are officially categorized as <span className="text-primary-400 font-bold underline decoration-primary-400/30 underline-offset-4">Industry Ready</span>. Top companies looking for {metrics?.technical > 80 ? 'Technical Leads' : 'Fullstack Associates'} are currently matching with profiles like yours.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Badge variant="primary" className="bg-white/10 text-white border-white/20 px-4 py-2">Top 5% Learner</Badge>
                            <Badge variant="primary" className="bg-white/10 text-white border-white/20 px-4 py-2">Elite Programmer</Badge>
                            <Badge variant="primary" className="bg-white/10 text-white border-white/20 px-4 py-2">Fast Tracker</Badge>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 3. SKILL METERS GRID */}
            <div className="space-y-10">
                <SectionHeader className="text-2xl font-black">Core Skill Competencies</SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <SkillMeter value={metrics?.technical} label="Technical Depth" icon={Target} color="text-indigo-600" />
                    <SkillMeter value={metrics?.aptitude} label="Cognitive Aptitude" icon={Trophy} color="text-teal-600" />
                    <SkillMeter value={metrics?.projectScore} label="Project Implementation" icon={Rocket} color="text-amber-600" />
                    <SkillMeter value={metrics?.communication} label="Soft Skills & Comm" icon={Users} color="text-indigo-400" />
                </div>
            </div>

            {/* 4. ACTIONS & TOOLS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
                <Card className="p-8 hover:border-primary-300 transition-all border-slate-100 flex flex-col justify-between group">
                    <div>
                        <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl w-fit mb-6">
                            <Briefcase size={24} />
                        </div>
                        <h4 className="text-xl font-black mb-3">AI Mock Interviews</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">Practice with our real-time AI interviewer. Get instant analysis on your tone, content, and confidence.</p>
                    </div>
                    <Button variant="ghost" className="mt-8 justify-between px-0 font-bold text-primary-600 group-hover:translate-x-1 transition-transform" onClick={() => navigate('/dashboard/mock-interview')}>
                        START SESSION <ArrowRight size={18} />
                    </Button>
                </Card>

                <Card className="p-8 hover:border-indigo-300 transition-all border-slate-100 flex flex-col justify-between group">
                    <div>
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-6">
                            <FileText size={24} />
                        </div>
                        <h4 className="text-xl font-black mb-3">Placement Tracker</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">Manage your job search journey. Track applied positions, upcoming interviews, and received offers.</p>
                    </div>
                    <Button variant="ghost" className="mt-8 justify-between px-0 font-bold text-indigo-600 group-hover:translate-x-1 transition-transform" onClick={() => navigate('/dashboard/placements')}>
                        OPEN TRACKER <ArrowRight size={18} />
                    </Button>
                </Card>

                <Card className="p-8 hover:border-teal-300 transition-all border-slate-100 flex flex-col justify-between group">
                    <div>
                        <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl w-fit mb-6">
                            <ShieldCheck size={24} />
                        </div>
                        <h4 className="text-xl font-black mb-3">Verify Certificates</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">Earn industry-standard, blockchain-verifiable certificates for every course you successfully master.</p>
                    </div>
                    <Button variant="ghost" className="mt-8 justify-between px-0 font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
                        BROWSE AWARDS <ArrowRight size={18} />
                    </Button>
                </Card>
            </div>
        </Container>
    );
}

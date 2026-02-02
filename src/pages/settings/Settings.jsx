import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, MapPin, Calendar, Award,
    BookOpen, Target, Settings as SettingsIcon,
    Shield, Bell, Zap, Cloud, Globe,
    ExternalLink, Edit3, Camera, Activity,
    Trophy, Star, Heart, Share2, Download, ArrowRight
} from 'lucide-react';
import Container from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

// Mock user data with enhanced activity
const mockUser = {
    name: 'Kavimalan K',
    email: 'kavimalan.k@university.edu',
    location: 'Engineering Campus, IN',
    joinedDate: '2024-03-12',
    bio: 'Computational Intelligence Specialist exploring the intersection of Generative AI and adaptive pedagogical systems. Currently optimizing neural quiz architectures.',
    skills: [
        { name: 'Neural Networks', level: 95, color: 'primary' },
        { name: 'Full-Stack Engineering', level: 88, color: 'emerald' },
        { name: 'Data Structures', level: 92, color: 'amber' },
        { name: 'Cloud Architecture', level: 75, color: 'indigo' },
    ],
    completedCourses: 14,
    totalCourses: 18,
    certificatesEarned: 7,
    averageScore: 94,
    streak: 24,
    activityData: Array.from({ length: 52 * 7 }, (_, i) => ({
        day: i,
        value: Math.floor(Math.random() * 5)
    }))
};

const TABS = [
    { id: 'identity', label: 'Identity', icon: <User size={14} /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity size={14} /> },
    { id: 'vault', label: 'Badge Vault', icon: <Award size={14} /> },
    { id: 'settings', label: 'Configurations', icon: <SettingsIcon size={14} /> }
];

export default function Settings() {
    const [activeTab, setActiveTab] = useState('identity');

    return (
        <div className="bg-surface-50 min-h-screen font-sans text-surface-900 pb-32">
            {/* 1. PREMIUM HERO SECTION */}
            <div className="relative h-[400px] w-full overflow-hidden bg-slate-900">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_-20%,#4f46e5_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-mesh opacity-20" />

                <Container className="h-full relative flex items-end pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row items-center md:items-end gap-10 w-full"
                    >
                        <div className="relative group">
                            <div className="w-44 h-44 lg:w-56 lg:h-56 bg-white/10 backdrop-blur-3xl p-2 rounded-[2.5rem] border border-white/20 shadow-2xl">
                                <div className="w-full h-full bg-premium-gradient rounded-[2.2rem] flex items-center justify-center text-white text-6xl font-black shadow-inner">
                                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute bottom-4 right-4 p-4 bg-white rounded-2xl shadow-xl text-primary-600 hover:bg-primary-50 transition-colors border border-surface-200"
                            >
                                <Camera size={20} />
                            </motion.button>
                        </div>

                        <div className="flex-1 text-center md:text-left mb-4">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                                <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-none">
                                    {mockUser.name}
                                </h1>
                                <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Shield size={12} /> Elite Tier Learner
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-white/50">
                                <div className="flex items-center gap-2.5 text-sm font-medium">
                                    <MapPin size={16} className="text-primary-400" /> {mockUser.location}
                                </div>
                                <div className="flex items-center gap-2.5 text-sm font-medium">
                                    <Calendar size={16} className="text-primary-400" /> Joined {new Date(mockUser.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2.5 text-sm font-medium">
                                    <Globe size={16} className="text-primary-400" /> github.com/kavimalan
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <Button variant="premium" className="rounded-2xl px-8 h-14 font-black shadow-xl">
                                <Edit3 size={18} className="mr-2" /> EDIT PROFILE
                            </Button>
                            <Button variant="glass" className="rounded-2xl w-14 h-14 bg-white/10 border-white/20 text-white flex items-center justify-center p-0">
                                <Share2 size={20} />
                            </Button>
                        </div>
                    </motion.div>
                </Container>
            </div>

            {/* 2. TASK NAVIGATION BARS */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-200">
                <Container className="max-w-[1300px]">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-8">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-6 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all flex items-center gap-2 ${activeTab === tab.id ? 'text-primary-600' : 'text-surface-400 hover:text-surface-600'}`}
                                >
                                    {tab.icon} {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="profileTabLine"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="hidden md:flex items-center gap-4 py-4">
                            <div className="h-10 w-[1px] bg-surface-200" />
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400">
                                <Activity size={14} className="text-emerald-500" /> Node Status: <span className="text-emerald-600">Syncing</span>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="max-w-[1300px] mt-12">
                <AnimatePresence mode="wait">
                    {activeTab === 'identity' && (
                        <motion.div
                            key="identity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                        >
                            {/* LEFT SIDE: BIO & JOURNEY */}
                            <div className="lg:col-span-8 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                    <div className="md:col-span-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                                            <h2 className="text-2xl font-black text-surface-900 tracking-tight uppercase">Cognitive Brief</h2>
                                        </div>
                                        <p className="text-xl font-medium text-surface-600 leading-relaxed indent-8">
                                            {mockUser.bio}
                                        </p>
                                    </div>
                                    <div className="md:col-span-4 flex flex-col gap-4">
                                        <Card className="p-8 bg-white border-surface-200 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                                <Zap size={60} />
                                            </div>
                                            <div className="text-4xl font-black text-surface-900 mb-1">{mockUser.streak}d</div>
                                            <span className="text-[10px] font-black uppercase text-surface-400 tracking-widest">Active Streak</span>
                                        </Card>
                                        <Card className="p-8 bg-slate-900 text-white border-none shadow-xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                                <Target size={60} />
                                            </div>
                                            <div className="text-4xl font-black text-primary-400 mb-1">{mockUser.averageScore}%</div>
                                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Efficiency Rate</span>
                                        </Card>
                                    </div>
                                </div>

                                {/* SKILL ARCHITECTURE */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                                            <h2 className="text-2xl font-black text-surface-900 tracking-tight uppercase">Skill Architecture</h2>
                                        </div>
                                        <Badge variant="surface" className="font-black text-[9px] uppercase tracking-widest bg-slate-100 border-none">4 Verified Stacks</Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {mockUser.skills.map((skill, idx) => (
                                            <Card key={idx} className="p-8 border-surface-200 bg-white hover:border-primary-200 transition-all group shadow-sm">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl bg-surface-50 flex items-center justify-center text-primary-600 border border-surface-100`}>
                                                            <Zap size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-surface-900 text-lg tracking-tight uppercase leading-none mb-1">{skill.name}</h4>
                                                            <span className="text-[9px] font-black uppercase text-surface-400 tracking-widest">Advanced Practitioner</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-xl font-black text-surface-900">{skill.level}%</div>
                                                </div>
                                                <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${skill.level}%` }}
                                                        transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.1 }}
                                                        className="h-full bg-premium-gradient rounded-full"
                                                    />
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE: BADGES & ATTAINMENT */}
                            <div className="lg:col-span-4 space-y-10">
                                <Card noPadding className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                                        <Trophy size={180} />
                                    </div>
                                    <div className="p-10 relative z-10">
                                        <div className="flex items-center gap-3 mb-8">
                                            <Star size={20} className="text-amber-400" />
                                            <h3 className="text-xl font-black tracking-tight uppercase">Badge Vault</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3 mb-10">
                                            {['Neural Prophet', 'Hook Master', 'Logic Engine', 'Recursion God', 'Speed Runner', 'Architect'].map((badge, idx) => (
                                                <div key={idx} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all cursor-pointer">
                                                    {badge}
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="glass" fullWidth className="h-14 rounded-2xl font-black shadow-xl border-white/10 hover:bg-white/20">
                                            EXPLORE ALL ACHIEVEMENTS <ArrowRight size={18} className="ml-2" />
                                        </Button>
                                    </div>
                                </Card>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                                        <h2 className="text-lg font-black text-surface-900 tracking-tight uppercase">Neural Matrix</h2>
                                    </div>
                                    <Card className="p-8 bg-white border-surface-200 shadow-sm">
                                        <div className="grid grid-cols-7 gap-2">
                                            {Array.from({ length: 28 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`aspect-square rounded-[3px] transition-all hover:ring-2 hover:ring-primary-500 ${i % 3 === 0 ? 'bg-primary-600' : i % 5 === 0 ? 'bg-primary-300' : 'bg-surface-100'}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="mt-6 flex items-center justify-between text-[10px] font-black uppercase text-surface-400 tracking-widest">
                                            <span>Past 4 Weeks</span>
                                            <span className="text-emerald-600">+12% vs LY</span>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-10"
                        >
                            <Card className="p-12 bg-white flex flex-col items-center justify-center text-center border-surface-200">
                                <div className="w-20 h-20 rounded-3xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
                                    <Activity size={32} />
                                </div>
                                <h2 className="text-3xl font-black text-surface-900 tracking-tight uppercase mb-4">Analytics Engine Offline</h2>
                                <p className="text-surface-500 max-w-md mx-auto leading-relaxed">
                                    We're re-indexing your cognitive history. Full data visualization will be available in the next technical release.
                                </p>
                                <Button variant="primary" className="mt-10 px-10 h-14 rounded-2xl font-black shadow-xl">FORCE RE-INDEXING</Button>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>
        </div>
    );
}

import React, { useState } from 'react';
import {
    Trophy,
    Medal,
    TrendingUp,
    Users,
    Crown,
    Zap,
    Star
} from 'lucide-react';
import Container from '../../components/ui/Container';
import { Title, BodyText, Label, SectionHeader } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const LeaderboardRow = ({ rank, name, score, streak, avatar }) => (
    <div className="flex items-center gap-6 p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none group">
        <div className="w-10 text-center">
            {rank === 1 ? <Crown className="text-yellow-400 mx-auto" /> :
                rank === 2 ? <Medal className="text-slate-400 mx-auto" /> :
                    rank === 3 ? <Medal className="text-amber-600 mx-auto" /> :
                        <span className="text-sm font-black text-slate-300">#{rank}</span>}
        </div>
        <div className="flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm font-black flex items-center justify-center text-slate-400 uppercase text-xs">
                {name.charAt(0)}
            </div>
            <div>
                <h5 className="font-black text-slate-900 group-hover:text-primary-600 transition-colors">{name}</h5>
                <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="primary" size="sm" className="bg-primary-50 text-primary-700 text-[8px] px-1.5 py-0">Tier: Elite</Badge>
                    <span className="text-[10px] text-slate-400 font-medium tracking-tight">Level 42</span>
                </div>
            </div>
        </div>
        <div className="text-right flex items-center gap-10">
            <div className="hidden sm:block">
                <Label className="text-[10px] text-slate-300 block mb-0.5">STREAK</Label>
                <div className="flex items-center gap-1 font-black text-slate-900">
                    <Zap size={12} className="text-amber-500 fill-amber-500" /> {streak} Days
                </div>
            </div>
            <div className="w-24 text-center p-3 bg-slate-50 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all">
                <Label className="text-[8px] text-slate-400 group-hover:text-white/60 block mb-0.5 uppercase tracking-widest font-bold">Points</Label>
                <div className="text-lg font-black leading-none">{score.toLocaleString()}</div>
            </div>
        </div>
    </div>
);

export default function Leaderboard() {
    const [activeTab, setActiveTab] = useState('weekly');

    const leaders = [
        { rank: 1, name: 'Aditya Varma', score: 12450, streak: 14 },
        { rank: 2, name: 'Kavimalan K', score: 11820, streak: 8 },
        { rank: 3, name: 'Sarah Miller', score: 9840, streak: 21 },
        { rank: 4, name: 'Rahul Sen', score: 8520, streak: 3 },
        { rank: 5, name: 'Priya Das', score: 7900, streak: 12 },
        { rank: 6, name: 'Elena Gilbert', score: 7100, streak: 5 },
    ];

    return (
        <Container className="py-10 space-y-12 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-100">
                <div>
                    <Label className="text-primary-600 block mb-2 px-3 py-1 bg-primary-50 w-fit rounded-lg font-bold">Public Rankings</Label>
                    <Title className="text-5xl font-black text-slate-900 tracking-tight">The Leaderboard</Title>
                    <BodyText className="mt-4 text-slate-500 max-w-xl text-lg font-medium">
                        Compete with the world's most disciplined learners. Rank up by completing courses, scoring high on quizzes, and maintaining your streak.
                    </BodyText>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('weekly')}
                        className={`px-6 py-2.5 rounded-lg text-xs font-black transition-all ${activeTab === 'weekly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        WEEKLY
                    </button>
                    <button
                        onClick={() => setActiveTab('monthly')}
                        className={`px-6 py-2.5 rounded-lg text-xs font-black transition-all ${activeTab === 'monthly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        MONTHLY
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <Card className="p-0 border-none shadow-premium overflow-hidden">
                        <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                            <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400">Top Performers</h4>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                <Users size={14} /> 1,240 Current Learners
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {leaders.map(l => <LeaderboardRow key={l.rank} {...l} />)}
                        </div>
                        <div className="p-8 bg-slate-900 text-white flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-sm">#2</div>
                                <div>
                                    <h5 className="font-black">Your Rank (Kavimalan K)</h5>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">You are in the top 1%</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black">11,820</div>
                                <Label className="text-[10px] text-primary-400 font-bold tracking-widest">Keep going!</Label>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <SectionHeader className="text-sm uppercase tracking-[0.2em] text-slate-400">Your Stats</SectionHeader>
                    <Card className="p-8 bg-white border-none shadow-premium text-center">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-sm border border-indigo-100">
                            <Star size={32} fill="currentColor" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">Tier: Elite Learner</h4>
                        <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed px-6">Earn another 1,200 points to unlock the "Diamond" status and priority placement perks.</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold px-2">
                                <span className="text-slate-400 uppercase tracking-widest">Progress to Diamond</span>
                                <span className="text-indigo-600">82%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 w-[82%] rounded-full shadow-lg shadow-indigo-600/20" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 bg-slate-50/50 border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp size={18} className="text-success" />
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Streak Bonus</h4>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-2">1.5x Multiplier</div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed italic">Maintain a 7-day streak to unlock the "Mastery" multiplier for all your exam scores.</p>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

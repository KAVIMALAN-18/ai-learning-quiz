import React from 'react';
import { Target, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { SectionHeader, Title, BodyText, Label } from '../ui/Typography';

export function TopicMastery({ topics, suggestions }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Topic Breakdown List */}
                <div className="lg:col-span-2 space-y-4">
                    <SectionHeader className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-6">Topic-wise Mastery</SectionHeader>
                    {topics?.length > 0 ? (
                        topics.map((topic, idx) => (
                            <Card key={idx} className="p-6 border-none bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${topic.status === 'Strong' ? 'bg-success/10 text-success' :
                                                topic.status === 'Weak' ? 'bg-error/10 text-error' :
                                                    'bg-primary/10 text-primary'
                                            }`}>
                                            {topic.status === 'Strong' ? <TrendingUp size={20} /> :
                                                topic.status === 'Weak' ? <AlertCircle size={20} /> :
                                                    <Target size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 mb-0.5">{topic.topicName}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{topic.attempts} Attempts</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-slate-900">{topic.accuracy}%</div>
                                        <Label className={`text-[9px] font-black uppercase tracking-widest ${topic.status === 'Strong' ? 'text-success' :
                                                topic.status === 'Weak' ? 'text-error' :
                                                    'text-primary-600'
                                            }`}>{topic.status}</Label>
                                    </div>
                                </div>
                                {/* Micro progress bar */}
                                <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${topic.status === 'Strong' ? 'bg-success' :
                                                topic.status === 'Weak' ? 'bg-error' :
                                                    'bg-primary-600'
                                            }`}
                                        style={{ width: `${topic.accuracy}%` }}
                                    />
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="p-12 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No topic data available yet</p>
                        </div>
                    )}
                </div>

                {/* AI Suggestions / Insights */}
                <div className="space-y-6">
                    <SectionHeader className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-6">Growth Strategy</SectionHeader>
                    <Card className="p-8 border-none bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-slate-900/20">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Sparkles size={120} fill="currentColor" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                <Sparkles size={24} className="text-primary-400" />
                            </div>
                            <h4 className="text-xl font-black mb-6">Personalized Insights</h4>
                            <div className="space-y-6">
                                {suggestions?.length > 0 ? suggestions.map((s, idx) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                                        <p className="text-sm font-medium text-slate-300 leading-relaxed">{s}</p>
                                    </div>
                                )) : (
                                    <p className="text-sm font-medium text-slate-400 italic">Insights will appear here as you complete more quizzes.</p>
                                )}
                            </div>
                            <button className="mt-10 w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                                Generate AI Study Plan
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

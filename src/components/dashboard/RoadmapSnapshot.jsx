import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Map } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function RoadmapSnapshot() {
    const navigate = useNavigate();

    return (
        <Card className="p-0 overflow-hidden border-indigo-100" noPadding>
            <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                    <Map size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Current Path</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Frontend Mastery</h3>
                <p className="text-indigo-100 text-sm">Advanced React Patterns</p>
            </div>
            <div className="p-6 bg-white">
                <div className="space-y-6 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100" />

                    {[
                        { title: 'Custom Hooks', status: 'completed' },
                        { title: 'Context API', status: 'active' },
                        { title: 'Performance Optimization', status: 'locked' }
                    ].map((step, i) => (
                        <div key={i} className="flex gap-4 relative">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 bg-white ${step.status === 'completed' ? 'border-emerald-500 text-emerald-500' :
                                step.status === 'active' ? 'border-indigo-500 text-indigo-500' :
                                    'border-slate-200 text-slate-300'
                                }`}>
                                {step.status === 'completed' && <CheckCircle2 size={12} fill="currentColor" className="text-emerald-100" />}
                                {step.status === 'active' && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${step.status === 'active' ? 'text-indigo-700' : 'text-slate-700'}`}>{step.title}</p>
                                <p className="text-xs text-slate-400 capitalize">{step.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Button className="w-full mt-8" onClick={() => navigate('/dashboard/roadmap')}>View Full Roadmap</Button>
            </div>
        </Card>
    );
}

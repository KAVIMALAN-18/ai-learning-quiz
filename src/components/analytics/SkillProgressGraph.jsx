import React from 'react';
import { Card } from '../ui/Card';

// Mock data for skill progress over time
const skillProgressData = [
    { label: 'Week 1', value: 20 },
    { label: 'Week 2', value: 35 },
    { label: 'Week 3', value: 48 },
    { label: 'Week 4', value: 62 },
    { label: 'Week 5', value: 71 },
    { label: 'Week 6', value: 85 },
    { label: 'Week 7', value: 92 }
];

export default function SkillProgressGraph() {
    const maxValue = 100;

    return (
        <Card className="p-8 border border-slate-200">
            <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Skill Progress Overview
                </h3>
                <p className="text-sm text-slate-500">
                    Your skill level improvement over time
                </p>
            </div>

            {/* Graph Container */}
            <div className="relative h-64">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-slate-400 font-medium">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                </div>

                {/* Graph area */}
                <div className="ml-14 h-full relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="border-t border-slate-100" />
                        ))}
                    </div>

                    {/* Area chart */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="skillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>

                        {/* Area fill */}
                        <path
                            d={`M 0,${256 - (skillProgressData[0].value / maxValue) * 256} 
                  ${skillProgressData.map((point, i) =>
                                `L ${(i / (skillProgressData.length - 1)) * 100}%,${256 - (point.value / maxValue) * 256}`
                            ).join(' ')}
                  L 100%,256 L 0,256 Z`}
                            fill="url(#skillGradient)"
                        />

                        {/* Line */}
                        <path
                            d={`M 0,${256 - (skillProgressData[0].value / maxValue) * 256} 
                  ${skillProgressData.map((point, i) =>
                                `L ${(i / (skillProgressData.length - 1)) * 100}%,${256 - (point.value / maxValue) * 256}`
                            ).join(' ')}`}
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Data points */}
                        {skillProgressData.map((point, i) => (
                            <circle
                                key={i}
                                cx={`${(i / (skillProgressData.length - 1)) * 100}%`}
                                cy={256 - (point.value / maxValue) * 256}
                                r="5"
                                fill="#6366f1"
                                stroke="#fff"
                                strokeWidth="2"
                                className="hover:r-7 transition-all cursor-pointer"
                            />
                        ))}
                    </svg>

                    {/* X-axis labels */}
                    <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-slate-400 font-medium">
                        {skillProgressData.map((point, i) => (
                            <span key={i}>{point.label}</span>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}

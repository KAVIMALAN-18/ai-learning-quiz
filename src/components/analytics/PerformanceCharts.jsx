import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/Typography';

export function ScoreTrendChart({ data }) {
    // Format dates for display
    const chartData = data?.map(item => ({
        ...item,
        displayDate: new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })
    })) || [];

    return (
        <Card className="p-8 border-none bg-white rounded-[2rem] shadow-xl shadow-slate-200/50">
            <SectionHeader className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-8">Score History / Trend</SectionHeader>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="displayDate"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                            }}
                            cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#4f46e5"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

export function CourseComparisonChart({ data }) {
    return (
        <Card className="p-8 border-none bg-white rounded-[2rem] shadow-xl shadow-slate-200/50">
            <SectionHeader className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-8">Course-wise Performance</SectionHeader>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="courseTitle"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                        />
                        <Bar
                            dataKey="averageScore"
                            fill="#4f46e5"
                            radius={[10, 10, 0, 0]}
                            barSize={40}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function ScoreChart({ data }) {
    return (
        <Card className="p-6 border border-slate-200">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Quiz Scores by Course
                </h3>
                <p className="text-sm text-slate-500">
                    Average performance across different courses
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="course"
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                    />
                    <YAxis
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        domain={[0, 100]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <Bar dataKey="avgScore" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}

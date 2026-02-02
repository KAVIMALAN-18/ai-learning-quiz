import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

export default function AccuracyChart({ data }) {
    // Transform data for Recharts
    const chartData = data.map((item, index) => ({
        name: item.date || `Day ${index + 1}`,
        accuracy: item.accuracy
    }));

    return (
        <Card className="p-6 border border-slate-200">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Accuracy Over Time
                </h3>
                <p className="text-sm text-slate-500">
                    Track your quiz accuracy trend
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
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
                    <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ fill: '#6366f1', r: 5 }}
                        activeDot={{ r: 7 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}

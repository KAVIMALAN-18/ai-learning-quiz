import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '../ui/Card';
import Skeleton from '../ui/Skeleton';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function TopicChart({ data = [], isLoading = false }) {
    if (isLoading) {
        return <Skeleton className="w-full h-[300px] rounded-xl" />;
    }

    if (!data || data.length === 0) {
        return (
            <Card className="h-[300px] flex items-center justify-center bg-slate-50 border-dashed border-2">
                <p className="text-slate-400 font-medium">No topic analytics available.</p>
            </Card>
        );
    }

    const chartData = {
        labels: data.map(d => d.topic),
        datasets: [
            {
                label: 'Accuracy (%)',
                data: data.map(d => d.accuracy),
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                hoverBackgroundColor: '#6366f1',
                borderRadius: 6,
                barThickness: 32,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                borderRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                ticks: { font: { size: 11 }, color: '#64748b' }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11, weight: '600' }, color: '#1e293b' }
            }
        },
    };

    return (
        <div className="h-[300px] w-full">
            <Bar data={chartData} options={options} />
        </div>
    );
}

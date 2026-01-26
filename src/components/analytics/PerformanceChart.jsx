import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card } from '../ui/Card';
import Skeleton from '../ui/Skeleton';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function PerformanceChart({ data = [], isLoading = false }) {
    if (isLoading) {
        return <Skeleton className="w-full h-[300px] rounded-xl" />;
    }

    if (!data || data.length === 0) {
        return (
            <Card className="h-[300px] flex items-center justify-center bg-slate-50 border-dashed border-2">
                <p className="text-slate-400 font-medium">No quiz performance data yet.</p>
            </Card>
        );
    }

    const chartData = {
        labels: data.map(d => d.label),
        datasets: [
            {
                label: 'Quiz Score (%)',
                data: data.map(d => d.score),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointRadius: 4,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1e293b',
                titleFont: { size: 12, weight: 'bold' },
                bodyFont: { size: 12 },
                padding: 12,
                borderRadius: 8,
            },
        },
        scales: {
            y: {
                min: 0,
                max: 100,
                grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                ticks: { font: { size: 11 }, color: '#64748b' }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, color: '#64748b' }
            }
        },
    };

    return (
        <div className="h-[300px] w-full">
            <Line data={chartData} options={options} />
        </div>
    );
}

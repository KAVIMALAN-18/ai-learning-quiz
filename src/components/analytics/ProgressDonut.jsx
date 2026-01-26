import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Skeleton from '../ui/Skeleton';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProgressDonut({ data = [], isLoading = false }) {
    if (isLoading) {
        return <Skeleton className="w-48 h-48 rounded-full mx-auto" />;
    }

    const total = data.reduce((acc, d) => acc + d.value, 0);
    const completed = data.find(d => d.name === 'Completed')?.value || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const chartData = {
        labels: data.map(d => d.name),
        datasets: [
            {
                data: data.map(d => d.value),
                backgroundColor: ['#6366f1', '#f1f5f9'],
                borderWidth: 0,
                cutout: '80%',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
    };

    return (
        <div className="relative w-48 h-48 mx-auto">
            <Doughnut data={chartData} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{percentage}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
            </div>
        </div>
    );
}

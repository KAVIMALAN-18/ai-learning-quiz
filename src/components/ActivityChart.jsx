import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';


// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const LearningProgressChart = () => {
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 13 },
                bodyFont: { size: 12 },
                cornerRadius: 8,
                displayColors: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' },
                ticks: { font: { size: 11 }, color: '#64748b' },
                border: { display: false },
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, color: '#64748b' },
                border: { display: false },
            },
        },
        tension: 0.4,
    };

    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'XP Earned',
                data: [120, 190, 150, 220, 180, 250, 310],
                borderColor: '#4f46e5',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
                    gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
                    return gradient;
                },
                fill: true,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    return (
        <div className="h-64 w-full">
            <Line options={options} data={data} />
        </div>
    );
};

export const QuizPerformanceChart = () => {
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: '#f1f5f9' },
                ticks: { stepSize: 20, color: '#64748b' },
                border: { display: false },
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b' },
                border: { display: false },
            },
        },
    };

    const data = {
        labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
        datasets: [
            {
                label: 'Accuracy %',
                data: [65, 72, 68, 85, 92],
                backgroundColor: '#10b981',
                borderRadius: 6,
                barThickness: 24,
            },
        ],
    };

    return (
        <div className="h-64 w-full">
            <Bar options={options} data={data} />
        </div>
    );
};

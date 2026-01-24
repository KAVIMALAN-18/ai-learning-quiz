import React from 'react';

/**
 * AccuracyBar - A horizontal percentage bar
 */
export const AccuracyBar = ({ percentage, label, color = 'primary' }) => {
    const colorMap = {
        primary: 'bg-primary-600',
        success: 'bg-emerald-500',
        error: 'bg-rose-500',
        warning: 'bg-amber-500',
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-neutral-400">{label}</span>
                <span className="text-sm font-black text-neutral-900">{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorMap[color] || colorMap.primary} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

/**
 * MetricSplitBar - A segmented bar showing distribution
 */
export const MetricSplitBar = ({ segments = [] }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between mb-3">
                {segments.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.color}`} />
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight">{s.label} ({s.value})</span>
                    </div>
                ))}
            </div>
            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                {segments.map((s, i) => (
                    <div
                        key={i}
                        className={`h-full ${s.color} transition-all duration-1000 ease-out border-r border-white last:border-0`}
                        style={{ width: `${s.percentage}%` }}
                    />
                ))}
            </div>
        </div>
    );
};

/**
 * PerformanceBar - Compact bar for question lists
 */
export const PerformanceBar = ({ value, max, label, color = 'neutral' }) => {
    const percentage = Math.min(100, (value / max) * 100);
    const colorMap = {
        success: 'bg-emerald-500',
        error: 'bg-rose-500',
        neutral: 'bg-neutral-900',
        primary: 'bg-primary-600'
    };

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorMap[color]} transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-[10px] font-black text-neutral-400 whitespace-nowrap">{label}</span>
        </div>
    );
};

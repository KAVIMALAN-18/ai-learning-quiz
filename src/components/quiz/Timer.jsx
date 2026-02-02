import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function Timer({ duration, onTimeout, onWarning }) {
    const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
    const [isWarning, setIsWarning] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeout();
            return;
        }

        // Warning at 5 minutes
        if (timeLeft === 300 && !isWarning) {
            setIsWarning(true);
            onWarning?.();
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onTimeout, onWarning, isWarning]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const percentage = (timeLeft / (duration * 60)) * 100;

    return (
        <div className={`sticky top-0 p-4 rounded-xl border-2 transition-all ${isWarning
                ? 'bg-red-50 border-red-300'
                : 'bg-white border-slate-200'
            }`}>
            <div className="flex items-center gap-3 mb-3">
                {isWarning ? (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                    <Clock className="w-5 h-5 text-slate-600" />
                )}
                <span className="text-sm font-medium text-slate-700">Time Remaining</span>
            </div>

            <div className={`text-3xl font-bold mb-3 ${isWarning ? 'text-red-600' : 'text-slate-900'
                }`}>
                {formatTime(timeLeft)}
            </div>

            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ${isWarning ? 'bg-red-500' : 'bg-primary-600'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {isWarning && (
                <p className="text-xs text-red-600 font-medium mt-2">
                    Less than 5 minutes remaining!
                </p>
            )}
        </div>
    );
}

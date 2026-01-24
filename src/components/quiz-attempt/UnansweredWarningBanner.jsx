import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function UnansweredWarningBanner({ count }) {
    if (count <= 0) return null;

    return (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 sticky top-16 z-30 animate-fade-in">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-800 text-sm font-medium">
                <AlertCircle size={16} />
                <span>You have <span className="font-bold">{count}</span> unanswered questions. answers are required to submit.</span>
            </div>
        </div>
    );
}

import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function UnansweredWarningBanner({ count }) {
    if (count <= 0) return null;

    return (
        <div className="bg-warning-50/80 backdrop-blur-md border-b border-warning-100 px-8 py-3 sticky top-20 z-30 animate-fade-in shadow-soft">
            <div className="max-w-[1700px] mx-auto flex items-center justify-center gap-4 text-warning-700">
                <ShieldAlert size={18} className="animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">
                    Session Check: <span className="text-warning-900 underline decoration-2 underline-offset-2">{count} questions remain unverified</span>. Inputs are mandatory for holistic evaluation.
                </span>
            </div>
        </div>
    );
}

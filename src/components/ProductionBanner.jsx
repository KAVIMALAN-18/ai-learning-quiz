import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ProductionBanner() {
    const isDev = import.meta.env.DEV;
    if (!isDev) return null;

    return (
        <div className="bg-amber-500 text-white px-4 py-1.5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm relative z-[60]">
            <AlertTriangle size={14} />
            <span>Development Environment — Experimental Features Active</span>
            <div className="hidden sm:block ml-4 px-2 py-0.5 bg-white/20 rounded text-[8px]">v1.0.0-beta.4</div>
        </div>
    );
}

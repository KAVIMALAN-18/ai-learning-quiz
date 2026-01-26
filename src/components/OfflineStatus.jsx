import React, { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';

export default function OfflineStatus() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            setTimeout(() => setShow(false), 3000); // Hide after 3s when back online
        };
        const handleOffline = () => {
            setIsOffline(true);
            setShow(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!show && !isOffline) return null;

    return (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${isOffline ? 'bg-rose-500/90 border-rose-400 text-white' : 'bg-emerald-500/90 border-emerald-400 text-white'}`}>
                {isOffline ? <WifiOff size={20} className="animate-pulse" /> : <div className="w-2 h-2 rounded-full bg-white animate-ping" />}
                <div className="flex flex-col">
                    <p className="text-sm font-black uppercase tracking-widest">{isOffline ? 'Connection Lost' : 'Back Online'}</p>
                    <p className="text-[10px] font-medium opacity-80">{isOffline ? 'You are currently browsing offline.' : 'Your connection has been restored.'}</p>
                </div>
                <button onClick={() => setShow(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors ml-2">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}

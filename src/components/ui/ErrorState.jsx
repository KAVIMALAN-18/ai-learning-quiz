import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
    title = "Something went wrong",
    message = "We encountered an error while loading this content. Please try again or contact support if the issue persists.",
    onRetry,
    className = ""
}) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2 tracking-tight">{title}</h3>
            <p className="text-neutral-500 max-w-sm mb-8 text-sm font-medium leading-relaxed">
                {message}
            </p>
            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="bg-white group"
                >
                    <RefreshCw size={16} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Try Again
                </Button>
            )}
        </div>
    );
}

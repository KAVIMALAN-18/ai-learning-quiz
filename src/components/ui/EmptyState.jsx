import React from 'react';
import { Ghost } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
    title = "No data available",
    description = "There is nothing to show here yet.",
    icon: Icon = Ghost,
    action,
    actionLabel = "Get Started"
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-neutral-400">
                <Icon size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2 tracking-tight">{title}</h3>
            <p className="text-neutral-500 max-w-sm mb-8 text-sm font-medium leading-relaxed">{description}</p>
            {action && (
                <Button onClick={action} variant="primary" className="px-8 shadow-lg shadow-primary-600/20">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

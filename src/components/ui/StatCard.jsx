import React from 'react';
import Card from './Card';
import { Title, Label, MetaText } from './Typography';

export default function StatCard({ label, value, subtext, icon: Icon, color }) {
    return (
        <Card className="relative overflow-hidden group hover:shadow-premium-hover transition-all duration-300" noPadding>
            <div className="p-6">
                <div className={`absolute top-0 left-0 w-1 h-full ${color || 'bg-indigo-500'}`} />
                <div className="flex justify-between items-start">
                    <div>
                        <Label className="mb-1 block">{label}</Label>
                        <div className="text-2xl font-black text-neutral-900 tracking-tight">{value}</div>
                        {subtext && <p className="text-xs text-neutral-400 mt-1 font-medium">{subtext}</p>}
                    </div>
                    {Icon && (
                        <div className="p-3 bg-neutral-50 rounded-xl text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors duration-300">
                            <Icon size={20} />
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

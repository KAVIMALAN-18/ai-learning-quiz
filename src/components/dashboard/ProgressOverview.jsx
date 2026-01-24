import React from 'react';
import Card from '../ui/Card';

export default function ProgressOverview() {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 text-lg">Learning Progress</h3>
                <button className="text-indigo-600 text-sm font-medium hover:underline">View Report</button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 w-full">
                    <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-600">Overall Completion</span>
                        <span className="text-slate-900">62%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-indigo-600 w-[62%] rounded-full" />
                    </div>
                    <p className="text-xs text-slate-400">
                        You have completed <strong>8 of 14</strong> modules. Keep going to reach your weekly goal!
                    </p>
                </div>

                <div className="w-px h-24 bg-slate-100 hidden md:block" />

                <div className="flex-1 w-full">
                    <p className="text-sm font-medium text-slate-600 mb-4">Weekly Activity</p>
                    <div className="flex items-end justify-between h-20 gap-2">
                        {[40, 70, 30, 85, 50, 20, 10].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-50 rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm transition-all duration-500"
                                    style={{ height: `${h}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-wider">
                        <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

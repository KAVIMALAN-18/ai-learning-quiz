import React from 'react';
import { Card } from '../ui/Card';

// Mock data for course performance
const coursePerformanceData = [
    { course: 'Python', score: 92, color: 'bg-blue-500' },
    { course: 'JavaScript', score: 88, color: 'bg-yellow-500' },
    { course: 'React', score: 85, color: 'bg-cyan-500' },
    { course: 'Node.js', score: 78, color: 'bg-green-500' },
    { course: 'SQL', score: 95, color: 'bg-purple-500' },
    { course: 'MongoDB', score: 82, color: 'bg-pink-500' }
];

export default function CoursePerformanceGraph() {
    const maxScore = 100;

    return (
        <Card className="p-8 border border-slate-200">
            <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Course Performance Breakdown
                </h3>
                <p className="text-sm text-slate-500">
                    Compare your performance across different courses
                </p>
            </div>

            {/* Bar Chart */}
            <div className="space-y-6">
                {coursePerformanceData.map((course, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">{course.course}</span>
                            <span className="font-bold text-slate-900">{course.score}%</span>
                        </div>

                        {/* Bar */}
                        <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                            <div
                                className={`absolute inset-y-0 left-0 ${course.color} rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                                style={{ width: `${course.score}%` }}
                            >
                                <span className="text-xs font-bold text-white opacity-90">
                                    {course.score}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Performance Scale</span>
                    <div className="flex items-center gap-4">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

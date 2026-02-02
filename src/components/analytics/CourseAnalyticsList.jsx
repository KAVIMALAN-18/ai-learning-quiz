import React from 'react';
import { Card } from '../ui/Card';
import Badge from '../ui/Badge';
import { CheckCircle2, Circle } from 'lucide-react';

// Mock data for course-wise analytics
const courseAnalytics = [
    {
        name: 'Python Programming',
        completion: 95,
        avgScore: 92,
        topicsCompleted: 18,
        topicsPending: 2,
        level: 'Advanced'
    },
    {
        name: 'JavaScript Essentials',
        completion: 88,
        avgScore: 88,
        topicsCompleted: 15,
        topicsPending: 3,
        level: 'Intermediate'
    },
    {
        name: 'React.js Development',
        completion: 75,
        avgScore: 85,
        topicsCompleted: 12,
        topicsPending: 4,
        level: 'Intermediate'
    },
    {
        name: 'Node.js Backend',
        completion: 60,
        avgScore: 78,
        topicsCompleted: 9,
        topicsPending: 6,
        level: 'Beginner'
    },
    {
        name: 'SQL Database Design',
        completion: 100,
        avgScore: 95,
        topicsCompleted: 20,
        topicsPending: 0,
        level: 'Advanced'
    }
];

const getLevelColor = (level) => {
    switch (level) {
        case 'Advanced':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'Intermediate':
            return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Beginner':
            return 'bg-orange-100 text-orange-700 border-orange-200';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

export default function CourseAnalyticsList() {
    return (
        <Card className="p-8 border border-slate-200">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Course-wise Analytics
                </h3>
                <p className="text-sm text-slate-500">
                    Detailed breakdown of your performance in each course
                </p>
            </div>

            <div className="space-y-4">
                {courseAnalytics.map((course, index) => (
                    <div
                        key={index}
                        className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
                    >
                        {/* Course Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 mb-1">{course.name}</h4>
                                <div className="flex items-center gap-2">
                                    <Badge className={`text-xs px-2 py-1 border ${getLevelColor(course.level)}`}>
                                        {course.level}
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-slate-900">{course.completion}%</div>
                                <div className="text-xs text-slate-500">Completion</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${course.completion}%` }}
                                />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg border border-slate-100">
                                <div className="text-lg font-bold text-slate-900">{course.avgScore}%</div>
                                <div className="text-xs text-slate-500 mt-1">Avg Score</div>
                            </div>

                            <div className="text-center p-3 bg-white rounded-lg border border-slate-100">
                                <div className="flex items-center justify-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="text-lg font-bold text-slate-900">{course.topicsCompleted}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Completed</div>
                            </div>

                            <div className="text-center p-3 bg-white rounded-lg border border-slate-100">
                                <div className="flex items-center justify-center gap-1">
                                    <Circle className="w-4 h-4 text-orange-600" />
                                    <span className="text-lg font-bold text-slate-900">{course.topicsPending}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Pending</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

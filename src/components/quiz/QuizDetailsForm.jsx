import React from 'react';
import { Info } from 'lucide-react';

export default function QuizDetailsForm({ formData, onChange }) {
    const topics = [
        'Python Basics',
        'JavaScript Fundamentals',
        'React.js',
        'Node.js',
        'Data Structures',
        'Algorithms',
        'Machine Learning',
        'Web Development'
    ];

    const courses = [
        'Python Programming',
        'JavaScript Essentials',
        'React Development',
        'Full Stack Development',
        'Data Science',
        'Machine Learning'
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Quiz Details</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Configure the basic information for your quiz
                </p>
            </div>

            {/* Quiz Title */}
            <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quiz Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => onChange({ ...formData, title: e.target.value })}
                    placeholder="Enter quiz title"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-slate-900 placeholder-slate-400"
                />
            </div>

            {/* Topic Selector */}
            <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Topic <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.topic}
                    onChange={(e) => onChange({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-slate-900 appearance-none cursor-pointer"
                >
                    <option value="">Select a topic</option>
                    {topics.map((topic) => (
                        <option key={topic} value={topic}>
                            {topic}
                        </option>
                    ))}
                </select>
            </div>

            {/* Course Selector */}
            <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Course
                </label>
                <select
                    value={formData.course}
                    onChange={(e) => onChange({ ...formData, course: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-slate-900 appearance-none cursor-pointer"
                >
                    <option value="">Select a course (optional)</option>
                    {courses.map((course) => (
                        <option key={course} value={course}>
                            {course}
                        </option>
                    ))}
                </select>
            </div>

            {/* Description */}
            <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    Description
                    <div className="group relative">
                        <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-xs rounded-lg">
                            Add a brief description of what this quiz covers
                        </div>
                    </div>
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => onChange({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the quiz (optional)"
                    rows={3}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-slate-900 placeholder-slate-400 resize-none"
                />
            </div>
        </div>
    );
}

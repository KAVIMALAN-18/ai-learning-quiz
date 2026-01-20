import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Layout from '../../components/Layout';
import { Search, Bell, ChevronDown, LogOut, Mail, Phone, Brain, Trophy, TrendingUp, Settings } from 'lucide-react';

// Tab class returns appropriate classes for active/inactive states
const tabClass = ({ isActive }) =>
  `flex-1 text-sm px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-white text-blue-700 shadow-md ring-1 ring-white/20' : 'text-white/90 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30'}`;

const getLevelColor = (level) => {
  switch (level) {
    case 'beginner':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'intermediate':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'advanced':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  }
};

export default function DashboardLayout() {
  const { user, loading, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    if (user) setMeta({ level: getLevelColor(user.currentLevel) });
  }, [user]);

  if (loading) return null;

  return (
    <Layout>
      <header className="bg-gradient-to-r rounded-xl from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">LearnSphere</h2>
                  <p className="text-blue-100 text-xs">Learning Platform</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses, quizzes..."
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent w-64"
                />
              </div>

              <button className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
              </button>

              <div className="relative">
                <button onClick={() => setShowUserMenu((s) => !s)} className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-blue-200">Student</p>
                  </div>
                  <ChevronDown className="h-5 w-5 text-white/80" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                        <Mail className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </button>
                      <button className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                        <Settings className="h-4 w-4" />
                        <span>Account Settings</span>
                      </button>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button onClick={logout} className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full">
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

            <div className="py-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {user?.name}</h2>
                  <p className="text-blue-100">Here's your personalized learning dashboard</p>
                </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-300" />
                    <div>
                      <p className="text-xs text-blue-200">Current Streak</p>
                      <p className="text-lg font-bold text-white">7 days</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-300" />
                    <div>
                      <p className="text-xs text-blue-200">Avg. Score</p>
                      <p className="text-lg font-bold text-white">85%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex space-x-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 transition-shadow">
                <NavLink to="/dashboard" end className={tabClass}>
                  Overview
                </NavLink>
                <NavLink to="/dashboard/roadmap" className={tabClass}>
                  Roadmap
                </NavLink>
                <NavLink to="/dashboard/chat" className={tabClass}>
                  AI Tutor
                </NavLink>
                <NavLink to="/dashboard/courses" className={tabClass}>
                  Courses
                </NavLink>
                <NavLink to="/dashboard/progress" className={tabClass}>
                  Progress
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7">
        <Outlet />
      </main>
    </Layout>
  );
}

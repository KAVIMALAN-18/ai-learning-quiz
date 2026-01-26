import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Layout from '../../components/Layout';
import { Search, Bell, ChevronDown, LogOut, Mail, Settings, Brain } from 'lucide-react';

const tabClass = ({ isActive }) =>
  `text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`;

export default function DashboardLayout() {
  const { user, loading, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (loading) return null;

  return (
    <Layout>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">LearnSphere</span>
            </div>

            {/* Search (Desktop) */}
            <div className="hidden md:block relative w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics, quizzes..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>

              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu((s) => !s)}
                  className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="font-semibold text-slate-900 text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                      <Settings size={14} /> Account Settings
                    </button>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 -mb-px">
            <NavLink to="/dashboard" end className={tabClass}>Overview</NavLink>
            <NavLink to="/dashboard/roadmap" className={tabClass}>My Roadmap</NavLink>
            <NavLink to="/dashboard/quiz" className={tabClass}>Quiz Library</NavLink>
            <NavLink to="/dashboard/courses" className={tabClass}>Courses</NavLink>
            <NavLink to="/dashboard/recommendations" className={tabClass}>AI Recommendations</NavLink>
            <NavLink to="/dashboard/chat" className={tabClass}>AI Tutor</NavLink>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Outlet />
      </main>
    </Layout>
  );
}

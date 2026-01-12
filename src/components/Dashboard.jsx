import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, Award, Mail, Phone, User, LogOut, Sparkles, TrendingUp, Zap, Brain, Rocket, Star, Settings, Bell, Calendar, ChevronRight, Trophy, Users, Clock, BarChart, CheckCircle, Target as TargetIcon, RefreshCw, Search, Menu, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import Roadmap from "./Roadmap";
import TopicChat from "./TopicChat";

const Dashboard = () => {
  const { user, loading, error, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Professional Color Palette
  const colors = {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      500: '#64748b',
      600: '#475569'
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#10b981',
      600: '#059669'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706'
    },
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      500: '#d946ef',
      600: '#c026d3'
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          gradient: 'from-emerald-400 to-emerald-500'
        };
      case "intermediate":
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          gradient: 'from-blue-400 to-blue-500'
        };
      case "advanced":
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          gradient: 'from-purple-400 to-purple-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          gradient: 'from-gray-400 to-gray-500'
        };
    }
  };

  const getLevelEmoji = (level) => {
    switch (level) {
      case "beginner":
        return "🌱";
      case "intermediate":
        return "🚀";
      case "advanced":
        return "⭐";
      default:
        return "📚";
    }
  };

  useEffect(() => {
    if (user) {
      setData({
        level: getLevelColor(user?.currentLevel),
        emoji: getLevelEmoji(user?.currentLevel)
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      {/* NEW: Modern Header with Enhanced Design */}
      <div className="bg-gradient-to-r rounded-xl from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo/Brand */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">LearnSphere</h1>
                  <p className="text-blue-100 text-xs">Learning Platform</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex ml-10 space-x-1">
                {['Dashboard', 'Courses', 'Quizzes', 'Progress', 'Community'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>

            {/* Right: User Controls */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
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

              {/* Notifications */}
              <button className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-blue-200">Student</p>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 text-white/80" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <a href="#" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4" />
                        <span>Account Settings</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        <BookOpen className="h-4 w-4" />
                        <span>My Courses</span>
                      </a>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={logout}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
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

          {/* Dashboard Header Section */}
          <div className="py-8">
            <div className="flex flex-col md:flex-row md:items-center  justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-blue-100">
                  Here's your personalized learning dashboard
                </p>
              </div>
              
              {/* Quick Stats in Header */}
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

            {/* Tabs Navigation */}
            <div className="mt-8">
              <div className="flex space-x-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
                {['overview', 'my-courses', 'progress', 'analytics', 'goals'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content (Keeping the existing content) */}
      <div className=" mx-auto  mt-7">
        {/* User Profile Card - Updated Position */}
        <div className="bg-white  rounded-xl shadow-lg border border-gray-200 mb-8 transform !w-full -translate-y-4">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <span className={`px-3 py-1 ${data.level?.bg} ${data.level?.text} ${data.level?.border} rounded-full text-sm font-medium flex items-center space-x-1`}>
                      <span>{data.emoji}</span>
                      <span>{user.currentLevel?.charAt(0).toUpperCase() + user.currentLevel?.slice(1)}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{user.mobile}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors">
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the content remains the same as your previous version */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to learn today? 📚</h3>
                  <p className="text-gray-600">Continue your journey from where you left off</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                  Continue Learning
                </button>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Learning Progress</h3>
                <RefreshCw className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
              
              {/* Progress Bars */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Course Completion</span>
                    <span className="text-sm font-bold text-blue-600">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full w-2/5"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Quiz Accuracy</span>
                    <span className="text-sm font-bold text-emerald-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full w-[85%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Time Spent Learning</span>
                    <span className="text-sm font-bold text-purple-600">24h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Section */}
            {user.onboardingCompleted ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Your Learning Goals</span>
                  </h3>
                  <button
                    onClick={() => navigate("/onboarding")}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Edit Goals
                  </button>
                </div>

                {/* Goals Grid */}
                <div className="space-y-6">
                  {user.learningGoals && user.learningGoals.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Primary Goals</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.learningGoals.map((goal, idx) => (
                          <div key={idx} className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{goal}</p>
                                <p className="text-sm text-gray-500 mt-1">In progress</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.customGoals && user.customGoals.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Personal Goals</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.customGoals.map((goal, idx) => (
                          <div key={idx} className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Star className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{goal}</p>
                                <p className="text-sm text-gray-500 mt-1">Custom goal</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Your Profile</h3>
                <p className="text-gray-600 mb-6">Set up your learning goals to get personalized recommendations</p>
                <button
                  onClick={() => navigate("/onboarding")}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Start Onboarding
                </button>
              </div>
            )}

            {/* Roadmap Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">My Roadmap</h3>
                  <p className="text-sm text-gray-600">Track progress and regenerate plans per topic</p>
                </div>
              </div>
              <Roadmap topics={[...(user.learningGoals || []), ...(user.customGoals || [])]} />
            </div>

            {/* Topic Chat (AI Tutor) */}
            <TopicChat topics={[...(user.learningGoals || []), ...(user.customGoals || [])]} />
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-8">
            {/* User Info Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium text-gray-900 font-mono text-sm truncate">{user._id.substring(0, 12)}...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Learning Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Quizzes Taken</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <BarChart className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">85%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-900">7 days</p>
                  </div>
                  <Trophy className="w-8 h-8 text-amber-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">Start New Lesson</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TargetIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-900">Take Practice Quiz</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="font-medium text-gray-900">Join Community</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>Recent Activity</span>
            </h3>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {[
                { action: 'Completed "Advanced JavaScript Concepts" quiz', time: '2 hours ago', score: '92%', type: 'quiz' },
                { action: 'Earned "Quick Learner" badge', time: 'Yesterday', score: null, type: 'badge' },
                { action: 'Started "React Mastery" course', time: '2 days ago', score: null, type: 'course' },
                { action: 'Reached 50 questions milestone', time: '3 days ago', score: null, type: 'milestone' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'quiz' ? 'bg-blue-100' :
                      activity.type === 'badge' ? 'bg-amber-100' :
                      activity.type === 'course' ? 'bg-purple-100' : 'bg-emerald-100'
                    }`}>
                      {activity.type === 'quiz' && <BookOpen className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'badge' && <Trophy className="w-5 h-5 text-amber-600" />}
                      {activity.type === 'course' && <Sparkles className="w-5 h-5 text-purple-600" />}
                      {activity.type === 'milestone' && <Target className="w-5 h-5 text-emerald-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  {activity.score && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-medium rounded-full text-sm">
                      {activity.score}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">LearnSphere</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">© 2024 LearnSphere AI. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-500 text-sm cursor-pointer hover:text-gray-700">Privacy Policy</span>
              <span className="text-gray-500 text-sm cursor-pointer hover:text-gray-700">Terms of Service</span>
              <span className="text-gray-500 text-sm cursor-pointer hover:text-gray-700">Help Center</span>
              <span className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>All systems operational</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
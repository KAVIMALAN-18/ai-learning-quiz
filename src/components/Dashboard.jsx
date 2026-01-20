import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Target,
  Mail,
  Phone,
  LogOut,
  TrendingUp,
  Zap,
  Rocket,
  Trophy,
  Users,
  Clock,
  BarChart,
  CheckCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import Roadmap from "./Roadmap";
import TopicChat from "./TopicChat";
import AnalyticsPanel from "./analytics/AnalyticsPanel";

/* ------------------ Progress Bar ------------------ */
const ProgressBar = ({ label, percent }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-bold">{percent}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

/* ------------------ Dashboard ------------------ */
const Dashboard = () => {
  const { user, loading, error, logout } = useAuth();
  const navigate = useNavigate();
  const [levelMeta, setLevelMeta] = useState({});

  if (loading) {
    return <div className="p-10 text-center">Loading dashboard…</div>;
  }

  if (!user) {
    return <div className="p-10 text-center">Please login again.</div>;
  }

  useEffect(() => {
    const map = {
      beginner: { label: "Beginner", color: "text-emerald-600" },
      intermediate: { label: "Intermediate", color: "text-blue-600" },
      advanced: { label: "Advanced", color: "text-purple-600" },
    };
    setLevelMeta(map[user.currentLevel] || {});
  }, [user.currentLevel]);

  const goals = [
    ...(user.learningGoals || []),
    ...(user.customGoals || []),
  ];

  return (
    <div className="mx-auto mt-7 px-4">
      {/* USER CARD */}
      <div className="bg-white rounded-xl shadow-sm border mb-8 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <span className={`text-sm ${levelMeta.color}`}>
                {levelMeta.label}
              </span>
              <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {user.mobile}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-blue-50 border rounded-xl p-6 flex justify-between">
            <div>
              <h3 className="font-bold text-lg">Ready to learn today?</h3>
              <p className="text-gray-600">Continue where you left off</p>
            </div>
            <button
              onClick={() => navigate("/dashboard/courses")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Continue Learning
            </button>
          </div>

          <div className="bg-white border rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Learning Progress</h3>
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </div>
            <ProgressBar label="Course Completion" percent={40} />
            <ProgressBar label="Quiz Accuracy" percent={85} />
            <ProgressBar label="Consistency" percent={60} />
          </div>

          <Roadmap topics={goals} />
          <TopicChat topics={goals} />
        </div>

        {/* RIGHT */}
        <div className="space-y-8">
          <div className="bg-white border rounded-xl p-6">
            <AnalyticsPanel user={user} />
          </div>

          <div className="bg-white border rounded-xl p-6 space-y-3">
            <button aria-label="Start lesson" onClick={() => navigate('/dashboard/courses')} className="w-full p-4 bg-gray-50 rounded flex justify-between items-center hover:bg-gray-100 transition">
              <span className="flex gap-2 items-center">
                <BookOpen aria-hidden />
                <span className="text-sm font-medium">Start Lesson</span>
              </span>
              <ChevronRight aria-hidden />
            </button>

            <button aria-label="Open community" onClick={() => navigate('/community')} className="w-full p-4 bg-gray-50 rounded flex justify-between items-center hover:bg-gray-100 transition">
              <span className="flex gap-2 items-center">
                <Users aria-hidden />
                <span className="text-sm font-medium">Community</span>
              </span>
              <ChevronRight aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* RECENT */}
      <div className="bg-white border rounded-xl mt-10">
        <div className="p-6 border-b flex items-center gap-2">
          <Clock /> Recent Activity
        </div>
        <div className="p-6 flex justify-between">
          <span>Completed JavaScript Quiz</span>
          <span className="bg-green-100 px-2 rounded">92%</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

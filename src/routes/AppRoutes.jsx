import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../components/Login";
import Register from "../components/Register";
import Onboarding from "../components/Onboarding";
import QuizPlayer from "../components/QuizPlayer";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardOverview from "../pages/dashboard/DashboardOverview";
import DashboardCourses from "../pages/dashboard/DashboardCourses";
import DashboardProgress from "../pages/dashboard/DashboardProgress";
import DashboardAnalytics from "../pages/dashboard/DashboardAnalytics";
import DashboardGoals from "../pages/dashboard/DashboardGoals";
import DashboardRoadmap from "../pages/dashboard/DashboardRoadmap";
import DashboardChat from "../pages/dashboard/DashboardChat";
import DashboardQuiz from "../pages/dashboard/DashboardQuiz";
import QuizOverview from "../pages/quiz/QuizOverview";
import QuizStart from "../pages/quiz/QuizStart";
import QuizAttempt from "../pages/quiz/QuizAttempt";
import QuizResult from "../pages/quiz/QuizResult";

import { useAuth } from "../context/useAuth";

// ProtectedRoute: lightweight wrapper used by routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner if you prefer
  return user ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected dashboard with nested routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default to overview */}
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="roadmap" element={<DashboardRoadmap />} />
        <Route path="quiz">
          <Route index element={<QuizOverview />} />
          <Route path="start" element={<QuizStart />} />
          <Route path="attempt/:id" element={<QuizAttempt />} />
          <Route path="result/:id" element={<QuizResult />} />
        </Route>
        <Route path="chat" element={<DashboardChat />} />
        <Route path="courses" element={<DashboardCourses />} />
        <Route path="progress" element={<DashboardProgress />} />
        <Route path="analytics" element={<DashboardAnalytics />} />
        <Route path="goals" element={<DashboardGoals />} />
      </Route>

      {/* Other protected routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz/:id"
        element={
          <ProtectedRoute>
            <QuizPlayer />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
    </Routes>
  );
}

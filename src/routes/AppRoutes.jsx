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
import QuizHistory from "../pages/quiz/QuizHistory";
import AdminQuizList from "../pages/admin/AdminQuizList";
import AdminQuizBuilder from "../pages/admin/AdminQuizBuilder";

import { useAuth } from "../context/useAuth";

import ProtectedRoute from "../components/ProtectedRoute";

/**
 * AppRoutes - Centralized routing configuration.
 * Implements role-based access control (RBAC) and protected boundaries
 * to ensure a secure and scalable navigation structure.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔒 Protected User Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect to overview */}
        <Route index element={<Navigate to="overview" replace />} />

        {/* Core Learning Features */}
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="roadmap" element={<DashboardRoadmap />} />
        <Route path="quizzes">
          <Route index element={<QuizOverview />} />
          <Route path="start" element={<QuizStart />} />
          <Route path="attempt/:id" element={<QuizAttempt />} />
          <Route path="result/:id" element={<QuizResult />} />
          <Route path="history" element={<QuizHistory />} />
        </Route>
        <Route path="chat" element={<DashboardChat />} />

        {/* Analytics & Progress */}
        <Route path="courses" element={<DashboardCourses />} />
        <Route path="progress" element={<DashboardProgress />} />
        <Route path="analytics" element={<DashboardAnalytics />} />
        <Route path="goals" element={<DashboardGoals />} />

        {/* 🛡️ Admin-Only Routes */}
        <Route
          path="admin/quizzes"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminQuizList />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/quizzes/new"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminQuizBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/quizzes/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminQuizBuilder />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 🔒 Other Specialized Protected Routes */}
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

      {/* 🚩 Catch-all: Redirect to secure home */}
      <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
    </Routes>
  );
}


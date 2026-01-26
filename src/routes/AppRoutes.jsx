import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../components/Login";
import Register from "../components/Register";
import Onboarding from "../components/Onboarding";
import QuizPlayer from "../components/QuizPlayer";

import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Lazy Loaded Pages
const DashboardOverview = lazy(() => import("../pages/dashboard/DashboardOverview"));
const DashboardCourses = lazy(() => import("../pages/dashboard/DashboardCourses"));
const DashboardProgress = lazy(() => import("../pages/dashboard/DashboardProgress"));
const DashboardAnalytics = lazy(() => import("../pages/dashboard/DashboardAnalytics"));
const DashboardGoals = lazy(() => import("../pages/dashboard/DashboardGoals"));
const DashboardRoadmap = lazy(() => import("../pages/dashboard/DashboardRoadmap"));
const DashboardChat = lazy(() => import("../pages/dashboard/DashboardChat"));
const RecommendationPage = lazy(() => import("../pages/dashboard/RecommendationPage"));
const QuizOverview = lazy(() => import("../pages/quiz/QuizOverview"));
const QuizStart = lazy(() => import("../pages/quiz/QuizStart"));
const QuizAttempt = lazy(() => import("../pages/quiz/QuizAttempt"));
const QuizResult = lazy(() => import("../pages/quiz/QuizResult"));
const QuizHistory = lazy(() => import("../pages/quiz/QuizHistory"));
const AdminQuizList = lazy(() => import("../pages/admin/AdminQuizList"));
const AdminQuizBuilder = lazy(() => import("../pages/admin/AdminQuizBuilder"));
const AdminOverview = lazy(() => import("../pages/admin/AdminOverview"));
const AdminCourseManagement = lazy(() => import("../pages/admin/AdminCourseManagement"));
const CoursePlayerPage = lazy(() => import("../pages/course/CoursePlayerPage"));

const JobBoard = lazy(() => import("../pages/jobs/JobBoard"));
const RecruiterDashboard = lazy(() => import("../pages/jobs/RecruiterDashboard"));
const ApplicationTracker = lazy(() => import("../pages/jobs/ApplicationTracker"));
const CareerDashboard = lazy(() => import("../pages/career/CareerDashboard"));
const JobReadinessDashboard = lazy(() => import("../pages/career/JobReadinessDashboard"));
const MockInterview = lazy(() => import("../pages/career/MockInterview"));
const PlacementTracker = lazy(() => import("../pages/career/PlacementTracker"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const MyCertificates = lazy(() => import("../pages/certificates/MyCertificates"));
const VerifyCertificate = lazy(() => import("../pages/certificates/VerifyCertificate"));
const Settings = lazy(() => import("../pages/settings/Settings"));
const ResumeBuilder = lazy(() => import("../pages/career/ResumeBuilder"));
const Leaderboard = lazy(() => import("../pages/career/Leaderboard"));
const AdminRoadmapManagement = lazy(() => import("../pages/admin/AdminRoadmapManagement"));

import { useAuth } from "../context/useAuth";

import ProtectedRoute from "../components/ProtectedRoute";

/**
 * AppRoutes - Centralized routing configuration.
 * Implements role-based access control (RBAC) and protected boundaries
 * to ensure a secure and scalable navigation structure.
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-slate-50"><LoadingSpinner size={48} /></div>}>
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:certificateId" element={<VerifyCertificate />} />

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
          <Route path="roadmap/:courseSlug" element={<CoursePlayerPage />} />
          <Route path="roadmap/:courseSlug/:topicSlug" element={<CoursePlayerPage />} />
          <Route path="quizzes">
            <Route index element={<QuizOverview />} />
            <Route path="start" element={<QuizStart />} />
            <Route path="attempt/:id" element={<QuizAttempt />} />
            <Route path="result/:id" element={<QuizResult />} />
            <Route path="history" element={<QuizHistory />} />
          </Route>
          <Route path="chat" element={<DashboardChat />} />
          <Route path="recommendations" element={<RecommendationPage />} />

          {/* Analytics & Progress */}
          <Route path="courses" element={<DashboardCourses />} />
          <Route path="progress" element={<DashboardProgress />} />
          <Route path="analytics" element={<DashboardAnalytics />} />
          <Route path="goals" element={<DashboardGoals />} />

          {/* 💼 Career & Results */}
          <Route path="results" element={<QuizHistory />} />
          <Route path="profile" element={<Settings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="certificates" element={<MyCertificates />} />

          {/* 🛡️ Admin-Only Routes */}
          <Route
            path="admin/overview"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/quizzes"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminQuizList />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/quizzes/new"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminQuizBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/quizzes/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminQuizBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/courses"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminCourseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/roadmaps"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminRoadmapManagement />
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
    </Suspense>
  );
}


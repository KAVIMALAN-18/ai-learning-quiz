import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-300 font-medium">Checking your credentials...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!token) return <Navigate to="/login" />;

  // If trying to access dashboard without completing onboarding, redirect to onboarding
  if (location.pathname === "/dashboard" && !user?.onboardingCompleted) {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

export default ProtectedRoute;

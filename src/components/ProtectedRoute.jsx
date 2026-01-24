import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-500 font-medium font-sans">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based protection
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.warn(`⛔ Access Denied: User role '${user?.role}' is not authorized for this route.`);
    return <Navigate to="/dashboard/overview" replace />;
  }

  // Onboarding check (if applicable)
  if (location.pathname.startsWith("/dashboard") && !user?.onboardingCompleted && user?.role !== 'admin') {
    // Only redirect non-admins to onboarding if not completed
    // return <Navigate to="/onboarding" replace />;
  }

  return children;
};


export default ProtectedRoute;

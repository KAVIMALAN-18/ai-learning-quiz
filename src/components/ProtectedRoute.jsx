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

  // Waif for user profile to load if we have a token but no user yet
  // Depending on AuthProvider logic, 'loading' might need to be true here.
  // If loading is false but user is null, it means fetch failed (500 error we saw).
  // In that case, let's show an error or redirect to login to retry.
  if (!user && !loading) {
    // Fallback: If token exists but user fetch failed heavily, force logout or show error
    // return <Navigate to="/login" replace />; 
    // Better: Show concise error
    return <div className="p-10 text-center text-red-500">Failed to load user profile. Please refresh or log in again.</div>
  }

  // Role-based protection: Only check if user exists
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.warn(`⛔ Access Denied: User role '${user.role}' is not authorized for this route.`);
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

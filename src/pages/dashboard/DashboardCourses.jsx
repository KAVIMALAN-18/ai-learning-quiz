import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../../services/dashboard.service';

export default function DashboardCourses() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingLocal(true);
      setError(null);
      try {
        const data = await dashboardService.getEnrolledCourses();
        if (cancelled) return;
        setCourses(data || []);
      } catch (err) {
        if (cancelled) return;
        setError('Failed to load courses');
        setCourses([]);
      } finally {
        if (!cancelled) setLoadingLocal(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading || loadingLocal) return <p className="text-sm text-gray-500">Loading courses...</p>;

  const primary = user?.learningGoals || [];
  const custom = user?.customGoals || [];
  const enrolled = courses || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">My Courses</h3>
      </div>

      {enrolled.length === 0 ? (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-600 mb-4">You don't have any courses yet.</p>
          <button onClick={() => navigate('/onboarding')} className="px-4 py-2 bg-blue-600 text-white rounded-md">Set Learning Goals</button>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Enrolled Courses</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {enrolled.map((c) => (
              <div key={c.id || c.title} className="p-4 bg-white border rounded-lg">
                <p className="font-medium text-gray-900">{c.title}</p>
                <p className="text-sm text-gray-500 mt-1">Progress: {c.progress || '0%'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

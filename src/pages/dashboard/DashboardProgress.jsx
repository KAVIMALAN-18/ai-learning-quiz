import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../../services/dashboard.service';

export default function DashboardProgress() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingLocal(true);
      setError(null);
      try {
        const data = await dashboardService.getProgress();
        if (cancelled) return;
        setProgress(data);
      } catch (err) {
        if (cancelled) return;
        setError('Failed to load progress');
        setProgress(null);
      } finally {
        if (!cancelled) setLoadingLocal(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading || loadingLocal) return <p className="text-sm text-gray-500">Loading progress...</p>;

  const attempts = progress?.attempts || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Progress</h3>
      </div>

      {attempts.length === 0 ? (
        <div className="p-6 bg-white border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600 mb-4">No quiz attempts found yet.</p>
          <button onClick={() => navigate('/dashboard/courses')} className="px-4 py-2 bg-blue-600 text-white rounded-md">Browse Courses</button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Render attempts when endpoint available */}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import dashboardService from '../../services/dashboard.service';

export default function DashboardAnalytics() {
  const { loading } = useAuth();
  const [data, setData] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingLocal(true);
      setError(null);
      try {
        const res = await dashboardService.getAnalytics();
        if (cancelled) return;
        setData(res);
      } catch (err) {
        if (cancelled) return;
        setError('Failed to load analytics');
        setData(null);
      } finally {
        if (!cancelled) setLoadingLocal(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading || loadingLocal) return <p className="text-sm text-gray-500">Loading analytics...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Analytics</h3>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <p className="text-gray-600">Performance charts and insights will appear here. Charts will be added in a follow-up task.</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-xl font-bold">{data?.summary?.avgScore ?? '—'}%</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded">
                <p className="text-sm text-gray-600">Quizzes</p>
                <p className="text-xl font-bold">{data?.summary?.quizzesTaken ?? '—'}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded">
                <p className="text-sm text-gray-600">This week</p>
                <p className="text-xl font-bold">{(data?.weekly || []).length} days</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

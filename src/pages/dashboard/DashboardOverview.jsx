import React from 'react';
import Dashboard from '../../components/dashboard/Dashboard';
import ErrorState from '../../components/ui/ErrorState';
import { useDashboardData } from '../../hooks/useDashboardData';

/**
 * DashboardOverview: Acts as a container to fetch and pass data using useDashboardData hook.
 */
export default function DashboardOverview() {
  const { stats, velocity, recentQuizzes, roadmap, charts, isLoading, error, refresh } = useDashboardData();

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorState
          title="Dashboard Unavailable"
          message={error}
          onRetry={refresh}
        />
      </div>
    );
  }

  return (
    <Dashboard
      stats={stats}
      velocity={velocity}
      recentQuizzes={recentQuizzes}
      roadmap={roadmap}
      charts={charts}
      isLoading={isLoading}
    />
  );
}


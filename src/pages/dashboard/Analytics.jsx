import React from 'react';
import { useAuth } from '../../context/useAuth';

const Analytics = () => {
  const { loading } = useAuth();
  if (loading) return <p className="text-sm text-gray-500">Loading analytics...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Analytics</h3>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-600">Performance charts and insights will appear here. Charts will be added in a follow-up task.</p>
      </div>
    </div>
  );
};

export default Analytics;

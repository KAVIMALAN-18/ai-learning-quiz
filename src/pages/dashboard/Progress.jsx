import React from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Progress = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p className="text-sm text-gray-500">Loading progress...</p>;

  // Note: server doesn't expose quiz attempts listing endpoint; show placeholder and CTA
  const attempts = []; // placeholder — will show empty state

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
          {/* map attempts here when API available */}
        </div>
      )}
    </div>
  );
};

export default Progress;

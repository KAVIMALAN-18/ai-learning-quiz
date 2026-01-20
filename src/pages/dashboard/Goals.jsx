import React from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Goals = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p className="text-sm text-gray-500">Loading goals...</p>;

  const primary = user?.learningGoals || [];
  const custom = user?.customGoals || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Goals</h3>
        <button onClick={() => navigate('/onboarding')} className="px-3 py-2 bg-gray-50 rounded-md">Edit Goals</button>
      </div>

      {primary.length === 0 && custom.length === 0 ? (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-600 mb-4">You haven't set any goals yet.</p>
          <button onClick={() => navigate('/onboarding')} className="px-4 py-2 bg-blue-600 text-white rounded-md">Set Goals</button>
        </div>
      ) : (
        <div className="space-y-4">
          {primary.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Primary Goals</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {primary.map((g, i) => (
                  <div key={i} className="p-4 bg-white border rounded-lg">
                    <p className="font-medium text-gray-900">{g}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {custom.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Personal Goals</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {custom.map((g, i) => (
                  <div key={i} className="p-4 bg-white border rounded-lg">
                    <p className="font-medium text-gray-900">{g}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Goals;

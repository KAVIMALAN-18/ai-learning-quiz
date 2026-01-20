import React from 'react';
import Roadmap from '../../components/Roadmap';
import { useAuth } from '../../context/useAuth';

export default function DashboardRoadmap() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!user) return <div className="p-8 text-center">Please login to view your roadmap.</div>;

  const goals = [
    ...(Array.isArray(user.learningGoals) ? user.learningGoals : []),
    ...(Array.isArray(user.customGoals) ? user.customGoals : []),
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Roadmap</h2>
      <p className="text-sm text-gray-600 mb-6">Personalized learning plans per topic</p>
      <Roadmap topics={goals} />
    </div>
  );
}

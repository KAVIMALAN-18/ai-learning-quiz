import React from 'react';
import { useAuth } from '../../context/useAuth';

export default function DashboardQuiz() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!user) return <div className="p-8 text-center">Please login to view quizzes.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quizzes</h2>
      <p className="text-sm text-gray-600 mb-6">Your available quizzes and history will appear here.</p>
      <div className="bg-white border rounded-md p-6 text-center text-gray-500">No quizzes available yet.</div>
    </div>
  );
}

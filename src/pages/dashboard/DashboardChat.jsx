import React from 'react';
import TopicChat from '../../components/TopicChat';
import { useAuth } from '../../context/useAuth';

export default function DashboardChat() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!user) return <div className="p-8 text-center">Please login to use the AI Tutor.</div>;

  const goals = [
    ...(Array.isArray(user.learningGoals) ? user.learningGoals : []),
    ...(Array.isArray(user.customGoals) ? user.customGoals : []),
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI Tutor</h2>
      <p className="text-sm text-gray-600 mb-6">Ask topic-specific questions and get clear answers.</p>
      <TopicChat topics={goals} />
    </div>
  );
}

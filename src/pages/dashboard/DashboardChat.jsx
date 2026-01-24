import React from 'react';
import TopicChat from '../../components/chat/TopicChat';
import { useAuth } from '../../context/useAuth';
import Container from '../../components/ui/Container';
import { Title, BodyText, MetaText } from '../../components/ui/Typography';
import EmptyState from '../../components/ui/EmptyState';
import { MessageCircle } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function DashboardChat() {
  const { user, loading } = useAuth();

  if (loading) return (
    <Container className="py-20 flex flex-col items-center justify-center">
      <LoadingSpinner />
      <MetaText className="mt-4 animate-pulse uppercase font-black tracking-widest">Initializing AI Tutor...</MetaText>
    </Container>
  );

  if (!user) return (
    <Container className="py-20">
      <EmptyState
        title="Unauthorized Access"
        description="Please log in to access your personal AI Tutor."
        icon={MessageCircle}
      />
    </Container>
  );

  const goals = [
    ...(Array.isArray(user.learningGoals) ? user.learningGoals : []),
    ...(Array.isArray(user.customGoals) ? user.customGoals : []),
  ];

  return (
    <Container className="py-10 h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-10 pb-4 border-b border-neutral-100">
          <MetaText className="uppercase font-black tracking-[0.3em] text-primary-600 block mb-2">
            AI Assistant
          </MetaText>
          <Title className="text-4xl">Technical Mentorship</Title>
          <BodyText className="mt-2 text-neutral-500 max-w-xl">
            Ask complex technical questions and get instant, milestone-aware explanations tailored to your learning path.
          </BodyText>
        </div>

        {/* Chat Component */}
        <div className="flex-1 min-h-0">
          {goals.length > 0 ? (
            <TopicChat topics={goals} />
          ) : (
            <EmptyState
              title="No Learning Goals Found"
              description="To activate your AI Tutor, please add at least one learning goal in your profile or onboarding."
              icon={MessageCircle}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

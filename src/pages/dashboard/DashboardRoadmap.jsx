import React from 'react';
import Roadmap from '../../components/roadmap/Roadmap';
import { useAuth } from '../../context/useAuth';
import Container from '../../components/ui/Container';
import { Title, MetaText, BodyText, Label } from '../../components/ui/Typography';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { Card } from '../../components/ui/Card';
import { Map, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';


export default function DashboardRoadmap() {
  const { user, loading } = useAuth();

  if (loading) return (
    <Container className="py-10 animate-fade-in pb-20">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-neutral-100">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-12 w-40" />
        </div>
        <Card className="p-8 space-y-8">
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
          <div className="space-y-6 pt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-6">
                <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Container>
  );

  if (!user) return (
    <Container className="py-20 text-center">
      <Title className="text-neutral-400">Session Expired</Title>
      <BodyText className="mt-4 mb-8">Please login to access your personalized learning roadmaps.</BodyText>
      <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
    </Container>
  );

  const goals = [
    ...(Array.isArray(user.learningGoals) ? user.learningGoals : []),
    ...(Array.isArray(user.customGoals) ? user.customGoals : []),
  ];

  return (
    <Container className="py-10 animate-fade-in pb-20">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-neutral-100">
          <div>
            <Label className="text-primary-600 block mb-2">
              Progress Tracking
            </Label>
            <Title className="text-4xl">Learning Roadmap</Title>
            <BodyText className="mt-2 text-neutral-500 max-w-lg">
              Visualize your journey from beginner to expert with milestone-based learning paths.
            </BodyText>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              <Plus size={18} className="mr-2" /> Custom Goal
            </Button>
          </div>
        </div>

        {goals.length > 0 ? (
          <Roadmap topics={goals} />
        ) : (
          <div className="py-12">
            <EmptyState
              title="No active roadmaps found"
              description="It looks like you haven't set any learning goals yet. Create one to generate a personalized roadmap."
              icon={Map}
              action={() => { }}
              actionLabel="Set Learning Goals"
            />
          </div>
        )}
      </div>
    </Container>
  );
}

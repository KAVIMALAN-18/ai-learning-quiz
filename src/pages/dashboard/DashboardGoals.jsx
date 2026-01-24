import React from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Title, SectionHeader, BodyText, MetaText } from '../../components/ui/Typography';
import EmptyState from '../../components/ui/EmptyState';
import { Target, Plus, Zap, Award } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function DashboardGoals() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return (
    <Container className="py-20 flex flex-col items-center justify-center">
      <LoadingSpinner />
      <MetaText className="mt-4 animate-pulse uppercase font-black tracking-widest">Loading Objectives...</MetaText>
    </Container>
  );

  const primary = user?.learningGoals || [];
  const custom = user?.customGoals || [];
  const hasGoals = primary.length > 0 || custom.length > 0;

  return (
    <Container className="py-10 animate-fade-in pb-20">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-neutral-100">
          <div>
            <MetaText className="uppercase font-black tracking-[0.3em] text-primary-600 block mb-2">
              Performance Targets
            </MetaText>
            <Title className="text-4xl">Learning Objectives</Title>
            <BodyText className="mt-2 text-neutral-500 max-w-xl">
              Define and track your professional development milestones.
            </BodyText>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/onboarding')} className="shadow-xl shadow-primary-600/20">
              <Plus size={18} className="mr-2" /> Adjust Goals
            </Button>
          </div>
        </div>

        {!hasGoals ? (
          <EmptyState
            title="No strategy defined"
            description="Setting concrete learning objectives is the first step towards mastery. Let's define your path."
            icon={Target}
            action={() => navigate('/onboarding')}
            actionLabel="Set Your Goals"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Primary Context */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-md">
                  <Award size={18} />
                </div>
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-[0.2em]">Industry Domains</h3>
              </div>

              <div className="space-y-4">
                {primary.length > 0 ? primary.map((g, i) => (
                  <Card key={i} className="p-8 border-l-4 border-l-primary-600 group hover:translate-x-1 duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <SectionHeader className="mt-0 mb-1 text-xl font-black group-hover:text-primary-600 transition-colors uppercase tracking-tight">{g}</SectionHeader>
                        <MetaText className="uppercase font-bold tracking-widest text-[10px]">Strategic Learning Focus</MetaText>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                        <Zap size={18} />
                      </div>
                    </div>
                  </Card>
                )) : (
                  <Card className="p-12 border-dashed border-2 flex flex-col items-center justify-center text-center opacity-50">
                    <MetaText className="uppercase font-black tracking-widest text-[10px]">No domains selected</MetaText>
                  </Card>
                )}
              </div>
            </div>

            {/* Custom Focus */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary-50 text-secondary-600 rounded-md">
                  <Target size={18} />
                </div>
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-[0.2em]">Personal Targets</h3>
              </div>

              <div className="space-y-4">
                {custom.length > 0 ? custom.map((g, i) => (
                  <Card key={i} className="p-8 border-l-4 border-l-secondary-500 group hover:translate-x-1 duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <SectionHeader className="mt-0 mb-1 text-xl font-black group-hover:text-secondary-600 transition-colors uppercase tracking-tight">{g}</SectionHeader>
                        <MetaText className="uppercase font-bold tracking-widest text-[10px]">Custom Specialization</MetaText>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-secondary-50 group-hover:text-secondary-600 transition-all">
                        <Award size={18} />
                      </div>
                    </div>
                  </Card>
                )) : (
                  <Card className="p-12 border-dashed border-2 flex flex-col items-center justify-center text-center opacity-50">
                    <MetaText className="uppercase font-black tracking-widest text-[10px]">No custom targets defined</MetaText>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

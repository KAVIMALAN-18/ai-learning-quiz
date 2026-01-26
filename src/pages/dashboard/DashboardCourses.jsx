import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../../services/dashboard.service';
import Container from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Title, BodyText, Label } from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { BookOpen, Clock, ArrowRight, PlayCircle } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

export default function DashboardCourses() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getEnrolledCourses();
        setCourses(data || []);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (authLoading || loading) return (
    <Container className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
      </div>
    </Container>
  );

  return (
    <Container className="py-10 animate-fade-in pb-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <Label className="uppercase font-black tracking-[0.3em] text-primary-600 block mb-2 text-xs">Academic Library</Label>
            <Title className="text-4xl text-slate-900">My Learning Paths</Title>
            <BodyText className="mt-2 text-slate-500 max-w-lg">Track your progress across all enrolled courses and certifications.</BodyText>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard/roadmap')} className="bg-white px-8">
            <BookOpen size={18} className="mr-2" /> DISCOVER MORE
          </Button>
        </div>

        {courses.length === 0 ? (
          <div className="py-20">
            <EmptyState
              title="Your library is empty"
              description="You haven't enrolled in any courses yet. Start your journey by exploring our structured roadmaps."
              icon={BookOpen}
              action={() => navigate('/dashboard/roadmap')}
              actionLabel="Explore Roadmaps"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card
                key={course._id || course.id}
                className="p-0 border-none bg-white shadow-premium hover:shadow-2xl transition-all duration-500 overflow-hidden group rounded-[2rem] cursor-pointer"
                onClick={() => navigate(`/dashboard/roadmap/${course.slug}`)}
              >
                <div className="h-40 relative">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={course.title}
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="text-white w-12 h-12" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors uppercase tracking-tight">{course.title}</h3>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-end">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion</Label>
                      <span className="text-xs font-black text-primary-600">{course.progress || '0%'}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 transition-all duration-1000 ease-out"
                        style={{ width: course.progress || '0%' }}
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={14} /> {course.estimatedTime || '10h'}
                    </div>
                    <ArrowRight size={18} className="text-slate-200 group-hover:text-primary-600 transition-colors" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Roadmap from '../../components/roadmap/Roadmap';
import { useAuth } from '../../context/useAuth';
import courseService from '../../services/course.service';
import Container from '../../components/ui/Container';
import { Title, MetaText, BodyText, Label, SectionHeader } from '../../components/ui/Typography';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { Card } from '../../components/ui/Card';
import { Map, Plus, BookOpen, Clock, Activity, ArrowRight, Zap } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function DashboardRoadmap() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.list();
      setCourses(data);
    } catch (err) {
      setError("Failed to load official courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (authLoading || loading) return (
    <Container className="py-10 animate-fade-in pb-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-0 overflow-hidden h-96">
              <Skeleton className="h-48 w-full" />
              <div className="p-8 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-1/2 mt-auto" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );

  return (
    <Container className="py-10 animate-fade-in pb-20">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* SECTION 1: HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-slate-100">
          <div>
            <Label className="text-primary-600 block mb-2 px-3 py-1 bg-primary-50 w-fit rounded-lg font-bold">
              Learning Roadmap
            </Label>
            <Title className="text-5xl font-black text-slate-900 leading-tight tracking-tight">Your Structured Path</Title>
            <BodyText className="mt-4 text-slate-500 max-w-2xl text-lg font-medium">
              Access your enrolled courses and follow a structured curriculum from beginner to advanced mastery.
            </BodyText>
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              className="shadow-xl shadow-primary-600/20 px-8 py-4 font-black"
              onClick={() => navigate('/dashboard/courses')}
            >
              BROWSE COURSES
            </Button>
          </div>
        </div>

        {/* SECTION 2: ENROLLED COURSES */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <SectionHeader className="m-0 text-2xl font-black text-slate-900 font-heading">Active Learning Paths</SectionHeader>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? courses.map((course) => (
              <Card
                key={course._id}
                className="p-0 overflow-hidden relative group border-none bg-white shadow-premium hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-2xl"
                onClick={() => navigate(`/dashboard/roadmap/${course.slug}`)}
              >
                {/* Thumbnail / Header */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600'}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="primary" className="bg-white/20 backdrop-blur-md text-white border-white/30 text-[10px] font-bold">{course.difficulty}</Badge>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8">
                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-8 font-medium leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Clock size={12} /> {course.estimatedTime}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-inner">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>

                {/* Hover Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-600 -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Card>
            )) : (
              <div className="col-span-full py-20">
                <EmptyState
                  title="No active paths"
                  description="You haven't enrolled in any courses yet. Start your journey by selecting a learning path."
                  icon={Map}
                  action={() => navigate('/dashboard/courses')}
                  actionLabel="Browse Courses"
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </Container>
  );
}


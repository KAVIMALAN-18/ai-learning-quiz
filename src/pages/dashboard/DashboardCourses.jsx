import React, { useState, useMemo } from 'react';
import Container from '../../components/ui/Container';
import { Title, BodyText, SectionHeader } from '../../components/ui/Typography';
import CourseCard from '../../components/course/CourseCard';
import { Search, Filter, Loader2, Sparkles, BookOpen, Layout } from 'lucide-react';
import { useCourses } from '../../context/CourseContext';
import { categories } from '../../data/courses';
import EmptyState from '../../components/ui/EmptyState';

export default function DashboardCourses() {
  const { courses, loading, error } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter courses based on search and category
  const filteredCourses = useMemo(() => {
    let filtered = courses || [];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [courses, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative">
          <div className="w-20 h-20 bg-primary-100 rounded-[2rem] animate-pulse flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
          </div>
        </div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.3em] text-slate-400">Syncing Catalog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-primary-100 pb-32">
      <Container className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Header Section with Glass Effect */}
          <div className="relative p-10 lg:p-16 bg-white rounded-[3.5rem] shadow-premium overflow-hidden group border border-white">
            <div className="absolute top-0 right-0 p-12 opacity-5 -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700">
              <BookOpen size={280} />
            </div>
            <div className="relative z-10 max-w-3xl space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary-600/20">
                  <Sparkles size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-600 italic">Academy Hub</span>
              </div>
              <div className="space-y-4">
                <Title className="text-6xl font-black text-slate-900 tracking-tight leading-tight">
                  Master the <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Industry Spectrum</span>
                </Title>
                <BodyText className="text-slate-500 text-xl font-medium leading-relaxed">
                  Access our curated laboratory of professional technical courses. Each curriculum is synthesized for real-world application and architectural mastery.
                </BodyText>
              </div>
            </div>
          </div>

          {/* Toolbar: Search + Filter */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="relative flex-1 max-w-2xl group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Identify a course or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-white border-2 border-transparent shadow-premium rounded-[2rem] focus:border-primary-600/20 focus:ring-8 focus:ring-primary-600/5 transition-all outline-none text-slate-800 placeholder-slate-400 font-bold text-lg"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
              <div className="p-3 bg-white rounded-2xl shadow-premium text-slate-400 mr-2">
                <Filter size={18} />
              </div>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border-2 ${selectedCategory === category
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105'
                    : 'bg-white text-slate-500 hover:bg-slate-50 border-white shadow-sm'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Display */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 animate-fade-in">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id || course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 bg-white rounded-[4rem] shadow-premium">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                <Layout size={48} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-3">No blueprints found</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto">Try refining your search parameters to locate specifically desired curriculum.</p>
              </div>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
              >
                Reset Parameters
              </button>
            </div>
          )}

          {/* Footer Insight */}
          <div className="text-center pt-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-premium text-slate-400 text-xs font-bold uppercase tracking-widest border border-white">
              <Sparkles size={14} className="text-primary-500" />
              Showing {filteredCourses.length} Curated Courses
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

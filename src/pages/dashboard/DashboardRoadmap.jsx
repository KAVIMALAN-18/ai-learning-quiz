import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BookOpen,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  Clock,
  Search,
  Filter,
  ArrowLeft,
  Zap,
  Layout,
  Menu,
  X,
  FolderOpen,
  Bookmark,
  Target,
  ChevronLeft,
  MoreVertical,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import courseService from '../../services/course.service';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Title, BodyText, Label, MetaText, SectionHeader } from '../../components/ui/Typography';
import { useCourses } from '../../context/CourseContext';

export default function DashboardRoadmap() {
  const { courseSlug: urlCourseSlug, topicSlug: urlTopicSlug } = useParams();
  const navigate = useNavigate();

  // State
  const { courses, loading: coursesLoading } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [courseDetailsLoading, setCourseDetailsLoading] = useState(false);
  const [topicLoading, setTopicLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch selected course details
  const fetchCourseDetails = async (slug) => {
    try {
      setCourseDetailsLoading(true);
      const data = await courseService.getDetails(slug);
      setSelectedCourse(data);

      // If no topic selected, or topic not in this course, don't auto-navigate yet
      // Navigation handled by useEffect on URL params
    } catch (err) {
      console.error("Failed to load course details:", err);
    } finally {
      setCourseDetailsLoading(false);
    }
  };

  const fetchTopicContent = async (topicId) => {
    try {
      setTopicLoading(true);
      const data = await courseService.getTopic(topicId);
      setSelectedTopic(data);
    } catch (err) {
      console.error("Failed to load topic:", err);
    } finally {
      setTopicLoading(false);
    }
  };

  // Sync with URL params
  useEffect(() => {
    if (urlCourseSlug) {
      if (!selectedCourse || selectedCourse.slug !== urlCourseSlug) {
        fetchCourseDetails(urlCourseSlug);
      }
    } else {
      setSelectedCourse(null);
      setSelectedTopic(null);
    }
  }, [urlCourseSlug]);

  useEffect(() => {
    if (selectedCourse && urlTopicSlug) {
      const topic = selectedCourse.modules?.flatMap(m => m.topics).find(t => t.slug === urlTopicSlug);
      if (topic) {
        if (!selectedTopic || selectedTopic._id !== topic._id) {
          fetchTopicContent(topic._id);
        }
      }
    }
  }, [urlTopicSlug, selectedCourse]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const progressPercent = useMemo(() => {
    if (!selectedCourse?.modules) return 0;
    const totalTopics = selectedCourse.modules.reduce((acc, m) => acc + (m.topics?.length || 0), 0);
    const completedCount = selectedCourse.userProgress?.completedTopics?.length || 0;
    return totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  }, [selectedCourse]);

  return (
    <div className="fixed inset-0 top-16 bg-surface-50 flex overflow-hidden">
      {/* COLUMN 1: COURSE EXPLORER (LEFT) */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        className="w-72 border-r border-surface-200 flex flex-col bg-white z-20"
      >
        <div className="p-6 border-b border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-surface-900 flex items-center gap-2">
              <FolderOpen size={20} className="text-primary-600" />
              Courses
            </h2>
            <Button variant="ghost" size="sx" className="p-1"><MoreVertical size={16} /></Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input
              type="text"
              placeholder="Filter paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/10 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {coursesLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-14 bg-surface-100 animate-pulse rounded-xl" />
            ))
          ) : filteredCourses.map(course => (
            <button
              key={course._id}
              onClick={() => navigate(`/dashboard/roadmap/${course.slug}`)}
              className={`w-full p-3.5 rounded-xl text-left transition-all group ${urlCourseSlug === course.slug
                ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200'
                : 'hover:bg-surface-50 text-surface-600'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${urlCourseSlug === course.slug ? 'bg-primary-600' : 'bg-surface-200'}`} />
                <h3 className="text-xs font-bold truncate uppercase tracking-tight">{course.title}</h3>
              </div>
            </button>
          ))}
        </div>
      </motion.aside>

      {/* COLUMN 2: CURRICULUM SIDEBAR (MIDDLE) */}
      <motion.aside
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        className="w-80 border-r border-surface-200 flex flex-col bg-surface-50/50 backdrop-blur-sm z-10"
      >
        {selectedCourse ? (
          <>
            <div className="p-6 border-b border-surface-200 bg-white/50">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary" className="text-[8px] font-black">{selectedCourse.category}</Badge>
                <span className="text-surface-300">/</span>
                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Syllabus</span>
              </div>
              <h3 className="text-lg font-black text-surface-900 tracking-tight leading-snug mb-4">{selectedCourse.title}</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-surface-400">
                  <span>Completion</span>
                  <span className="text-primary-600">{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-200 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-premium-gradient"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {selectedCourse.modules?.map((module, mIdx) => (
                <div key={module._id} className="space-y-2.5">
                  <div className="flex items-center gap-2 group px-2">
                    <span className="text-[10px] font-black text-primary-500">{String(mIdx + 1).padStart(2, '0')}</span>
                    <h4 className="text-[10px] font-black text-surface-500 uppercase tracking-[0.15em]">{module.title}</h4>
                  </div>
                  <div className="space-y-1">
                    {module.topics?.map((topic) => {
                      const isActive = urlTopicSlug === topic.slug;
                      const isCompleted = selectedCourse.userProgress?.completedTopics?.includes(topic._id);
                      return (
                        <button
                          key={topic._id}
                          onClick={() => navigate(`/dashboard/roadmap/${selectedCourse.slug}/${topic.slug}`)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isActive
                            ? 'bg-white shadow-premium ring-1 ring-surface-200 text-primary-600 translate-x-1'
                            : 'hover:bg-white/50 text-surface-600'
                            }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`p-1 rounded-md ${isCompleted ? 'bg-emerald-50 text-emerald-500' : isActive ? 'bg-primary-50 text-primary-600' : 'bg-surface-100 text-surface-400'}`}>
                              {isCompleted ? <CheckCircle2 size={12} /> : <PlayCircle size={12} />}
                            </div>
                            <span className={`text-[11px] font-bold truncate ${isActive ? 'text-surface-900' : 'text-surface-600'}`}>
                              {topic.title}
                            </span>
                          </div>
                          {isActive && (
                            <motion.div layoutId="active-indicator" className="w-1 h-4 bg-primary-600 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="pt-6 border-t border-surface-200 mt-6 px-2">
                <button
                  className="w-full p-4 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center justify-between group hover:shadow-primary-500/10 transition-all"
                  onClick={() => navigate('/dashboard/quizzes/start', { state: { courseId: selectedCourse._id, isFinal: true } })}
                >
                  <div className="flex items-center gap-3">
                    <Trophy size={18} className="text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Final Certification</span>
                  </div>
                  <ChevronRight size={14} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-4">
            <div className="p-5 bg-surface-100 rounded-3xl text-surface-300">
              <Layout size={32} />
            </div>
            <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Select Course Path</p>
          </div>
        )}
      </motion.aside>

      {/* COLUMN 3: FOCUSED LESSON VIEWER (RIGHT) */}
      <main className="flex-1 overflow-y-auto bg-white relative">
        <AnimatePresence mode="wait">
          {topicLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={20} className="text-primary-600" />
                </div>
              </div>
              <p className="mt-6 text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] animate-pulse">Syncing knowledge base...</p>
            </motion.div>
          ) : selectedTopic ? (
            <motion.div
              key={selectedTopic._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto py-16 px-8 md:px-12 lg:px-20 space-y-12"
            >
              {/* TOP ACTIONS */}
              <div className="flex items-center justify-between border-b border-surface-100 pb-6 mb-8">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-[10px] font-black text-surface-400 uppercase tracking-widest hover:text-primary-600 transition-colors">
                    <Bookmark size={14} /> Bookmark
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-black text-surface-400 uppercase tracking-widest hover:text-primary-600 transition-colors">
                    <Zap size={14} /> Quick Note
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{selectedTopic.estimatedTime || '15 min read'}</span>
                  <Badge variant="surface" className="text-[8px] border-surface-200">Interactive</Badge>
                </div>
              </div>

              {/* LESSON HEADER */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 text-[9px] font-black uppercase tracking-widest mb-2">
                  Topic Content
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-surface-900 tracking-tight leading-[1.1]">{selectedTopic.title}</h1>
              </div>

              {/* CORE CONCEPT */}
              <div className="prose prose-slate prose-lg max-w-none">
                <p className="text-xl text-surface-600 leading-relaxed font-medium bg-surface-50 p-8 rounded-3xl border border-surface-100 italic">
                  "{selectedTopic.explanation}"
                </p>
              </div>

              {/* DETAILED CONTENT MOCKUP (Since real content might be short) */}
              <div className="space-y-8">
                <h2 className="text-xl font-black text-surface-900 uppercase tracking-tight flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                  Key Principles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Scalability', 'Maintainability', 'Performance', 'Reliability'].map((item, i) => (
                    <div key={i} className="p-6 bg-white border border-surface-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-2 w-fit bg-surface-50 rounded-lg text-primary-600 mb-3">
                        <Target size={18} />
                      </div>
                      <h4 className="font-black text-surface-900 text-sm uppercase mb-2">{item}</h4>
                      <p className="text-xs text-surface-500 font-medium leading-relaxed">Essential foundation for building modern technical architectures at scale.</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CODE EXAMPLES */}
              {selectedTopic.examples?.length > 0 && (
                <div className="space-y-8 pt-6">
                  <h2 className="text-xl font-black text-surface-900 uppercase tracking-tight flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-secondary-600 rounded-full" />
                    Practical Implementation
                  </h2>
                  <div className="space-y-6">
                    {selectedTopic.examples.map((example, idx) => (
                      <div key={idx} className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                        <div className="px-6 py-3 bg-white/5 flex justify-between items-center border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                            </div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{example.language}</span>
                          </div>
                          <button className="text-[10px] font-black text-white/40 hover:text-white transition-colors">COPY</button>
                        </div>
                        <pre className="p-8 overflow-x-auto text-primary-300 font-mono text-sm leading-relaxed">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PRACTICE CALL TO ACTION */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative group p-1"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <Card noPadding className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden">
                  <div className="p-10 md:p-14 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 text-white text-[10px] font-black uppercase tracking-widest">
                      <Zap size={14} className="text-amber-400" /> Milestone Achievement
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tight">Challenge Your Knowledge</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">Pass the concept verification test to unlock your next learning milestone and earn progress points.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        variant="premium"
                        size="lg"
                        className="px-12 py-5"
                        onClick={() => navigate(`/dashboard/quizzes/topic-test`, { state: { topicId: selectedTopic._id, courseId: selectedCourse._id } })}
                      >
                        Launch Concept Test
                      </Button>
                      <Button
                        variant="glass"
                        size="lg"
                        className="border-white/10 text-white"
                        onClick={() => navigate(`/dashboard/quizzes/topic-test`, { state: { topicId: selectedTopic._id, courseId: selectedCourse._id } })}
                      >
                        Skip to Practice
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center p-20 text-center"
            >
              <div className="w-24 h-24 bg-surface-50 rounded-[2.5rem] flex items-center justify-center text-surface-200 mb-8 border border-surface-100">
                <Layout size={40} />
              </div>
              <h2 className="text-3xl font-black text-surface-900 mb-4 max-w-md tracking-tight">Structured Learning Workbench</h2>
              <p className="text-surface-500 max-w-sm text-lg leading-relaxed font-medium">
                Please select a course and topic from the curriculum navigation to start your learning journey.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-primary-500" /> Syllabus Driven
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-secondary-500" /> AI Guided
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Interactive
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

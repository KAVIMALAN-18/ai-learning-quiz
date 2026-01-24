import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/useAuth";
import dashboardService from "../../services/dashboard.service";
import { CheckCircle, Circle, RefreshCw, Trophy, Map, ChevronRight, Lock } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";
import { Title, SectionHeader, BodyText, MetaText, Label } from "../ui/Typography";
import Badge from "../ui/Badge";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";

const Roadmap = ({ topics = [] }) => {
  const { fetchProfile } = useAuth();

  const [selectedTopic, setSelectedTopic] = useState(topics[0] || "");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const mountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0]);
    }
    if (selectedTopic && !topics.includes(selectedTopic)) {
      setSelectedTopic(topics[0] || "");
    }
  }, [topics, selectedTopic]);

  useEffect(() => {
    if (!selectedTopic) return;

    const currentFetchId = ++fetchIdRef.current;

    const loadRoadmap = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await dashboardService.getRoadmap(selectedTopic);
        if (!mountedRef.current || currentFetchId !== fetchIdRef.current) return;
        setRoadmap(res?.roadmap || res || null);
      } catch (err) {
        if (!mountedRef.current) return;
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load roadmap"
        );
        setRoadmap(null);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    loadRoadmap();
  }, [selectedTopic]);

  const toggleStep = async (index) => {
    if (!roadmap || !roadmap.steps) return;

    setUpdating(true);
    setError("");

    try {
      const completed = !roadmap.steps[index].completed;

      const res = await dashboardService.toggleRoadmapStep(
        roadmap._id,
        index,
        completed
      );

      if (!mountedRef.current) return;
      setRoadmap(res?.roadmap || res || null);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update step"
      );
    } finally {
      if (mountedRef.current) setUpdating(false);
    }
  };

  const regenerate = async () => {
    if (!roadmap) return;

    setLoading(true);
    setError("");

    try {
      const res = await dashboardService.regenerateRoadmap(roadmap._id);
      if (!mountedRef.current) return;
      setRoadmap(res?.roadmap || res || null);
      if (typeof fetchProfile === "function") fetchProfile();
    } catch (err) {
      if (!mountedRef.current) return;
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to regenerate roadmap"
      );
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  return (
    <Card className="animate-fade-in border-neutral-100 overflow-hidden">
      <div className="p-8 border-b border-neutral-100 bg-neutral-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Label className="text-primary-600 block mb-2">
            Learning Path
          </Label>
          <SectionHeader className="mt-0 mb-1">Your {selectedTopic || 'Personalized'} Journey</SectionHeader>
          <BodyText className="text-sm">
            Follow these curated steps to master your learning goals.
          </BodyText>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={regenerate}
          disabled={loading || !roadmap}
          className="bg-white shadow-sm"
        >
          <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Roadmap
        </Button>
      </div>

      <CardContent className="p-8">
        {/* Topics Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 p-1.5 bg-neutral-100 rounded-lg">
          {topics.length > 0 ? (
            topics.map((topic) => {
              const isActive = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`flex-1 min-w-[140px] px-6 py-2.5 rounded-md text-xs font-black uppercase tracking-widest transition-all ${isActive
                    ? "bg-white text-primary-600 shadow-md ring-1 ring-neutral-200"
                    : "text-neutral-500 hover:text-neutral-900"
                    }`}
                >
                  {topic}
                </button>
              );
            })
          ) : (
            <BodyText className="p-2 italic text-neutral-400">
              No active topics found.
            </BodyText>
          )}
        </div>

        {loading ? (
          <div className="space-y-8 pl-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-6">
                <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton variant="text" className="h-6 w-1/4" />
                  <Skeleton variant="text" className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Roadmap Unavailable"
            message={error}
            onRetry={selectedTopic ? () => setSelectedTopic(selectedTopic) : null}
            className="py-12"
          />
        ) : roadmap && Array.isArray(roadmap.steps) ? (
          <div className="relative pl-12 space-y-12">
            {/* Connection Line */}
            <div className="absolute left-[15px] top-6 bottom-10 w-[2px] bg-neutral-100" />

            {roadmap.steps.map((step, index) => {
              const isCompleted = step.completed;
              const isNext = !isCompleted && (index === 0 || roadmap.steps[index - 1].completed);
              const isLocked = !isCompleted && !isNext;

              return (
                <div key={index} className={`relative group transition-all duration-300 ${isLocked ? 'opacity-60' : 'opacity-100'}`}>
                  {/* Step Marker */}
                  <div className={`absolute -left-[45px] top-1 z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted
                    ? "border-success bg-success text-white shadow-lg shadow-success/20"
                    : isNext
                      ? "border-primary-600 bg-white text-primary-600 ring-4 ring-primary-50 shadow-md"
                      : "border-neutral-200 bg-neutral-100 text-neutral-400"
                    }`}>
                    {isCompleted ? <CheckCircle size={16} /> : isLocked ? <Lock size={14} /> : <Circle size={16} />}
                  </div>

                  <div
                    className={`p-6 rounded-md border transition-all duration-300 ${isCompleted
                      ? "bg-success/5 border-success/10"
                      : isNext
                        ? "bg-white border-primary-200 shadow-xl scale-[1.01]"
                        : "bg-neutral-50/50 border-neutral-100"
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <Badge variant={isCompleted ? 'success' : 'neutral'} size="sm">
                            Step {index + 1}
                          </Badge>
                          {isNext && (
                            <Badge variant="primary" size="sm" className="animate-pulse">
                              <Trophy size={10} className="mr-1" /> Active Goal
                            </Badge>
                          )}
                        </div>
                        <h4 className={`text-xl font-black leading-tight ${isCompleted ? "text-neutral-900" : isNext ? "text-primary-900" : "text-neutral-500"}`}>
                          {step.title}
                        </h4>
                      </div>

                      <Button
                        variant={isCompleted ? "secondary" : isNext ? "primary" : "outline"}
                        size="sm"
                        onClick={() => toggleStep(index)}
                        disabled={updating || isLocked}
                        className={`min-w-[140px] ${isCompleted ? 'bg-success/10 text-success hover:bg-success/20 border-none' : ''}`}
                      >
                        {isCompleted ? "Completed" : isNext ? "Mark as Done" : "Locked"}
                      </Button>
                    </div>

                    {step.description && (
                      <BodyText className={`text-sm max-w-2xl ${isCompleted ? "text-neutral-500 line-through opacity-60" : "text-neutral-600"}`}>
                        {step.description}
                      </BodyText>
                    )}

                    {!isLocked && !isCompleted && (
                      <div className="mt-6 flex items-center gap-4 pt-6 border-t border-neutral-100">
                        <Button variant="ghost" size="sm" className="text-primary-600 p-0 hover:bg-transparent hover:underline" onClick={() => { }}>
                          Find Resources <ChevronRight size={14} className="ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10">
            <EmptyState
              title="No Path Selected"
              description="Please choose a learning topic from the tabs above to view your personalized roadmap and milestones."
              icon={Map}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Roadmap;

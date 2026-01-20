import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/useAuth";
import dashboardService from "../services/dashboard.service";
import { CheckCircle, Circle } from "lucide-react";

const Roadmap = ({ topics = [] }) => {
  const { fetchProfile } = useAuth();

  const [selectedTopic, setSelectedTopic] = useState(topics[0] || "");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const mountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  /* Track mount/unmount */
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* Ensure selected topic is valid */
  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0]);
    }
    if (selectedTopic && !topics.includes(selectedTopic)) {
      setSelectedTopic(topics[0] || "");
    }
  }, [topics, selectedTopic]);

  /* Fetch roadmap when topic changes */
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

  /* Toggle step completion */
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

  /* Regenerate roadmap */
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
    <div className="mt-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">My Roadmap</h3>
        <p className="text-sm text-gray-600">
          Track progress and regenerate plans per topic
        </p>
      </div>

      {/* Topics */}
      <div className="flex flex-wrap gap-3 mb-4">
        {topics.length > 0 ? (
          topics.map((topic, index) => {
            const gradients = [
              "from-blue-500 to-indigo-500",
              "from-purple-500 to-pink-500",
              "from-emerald-400 to-teal-500",
              "from-yellow-400 to-orange-400",
            ];
            const gradient = gradients[index % gradients.length];
            const isActive = selectedTopic === topic;

            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`rounded-xl px-4 py-3 text-white font-semibold transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${gradient} shadow-lg scale-105`
                    : `bg-gradient-to-r ${gradient} opacity-80 hover:scale-105`
                }`}
              >
                {topic}
              </button>
            );
          })
        ) : (
          <p className="text-gray-600">
            No topics found. Add goals to see roadmaps.
          </p>
        )}
      </div>

      <button
        onClick={regenerate}
        disabled={loading || !roadmap}
        className="mb-4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold disabled:opacity-50"
      >
        Regenerate Roadmap
      </button>

      {loading && <p className="text-gray-600">Loading roadmap...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && roadmap && Array.isArray(roadmap.steps) && (
        <ul className="space-y-6 mt-6">
          {roadmap.steps.map((step, index) => (
            <li key={index} className="flex gap-4 items-start">
              <button
                onClick={() => toggleStep(index)}
                disabled={updating}
              >
                {step.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </button>

              <div
                className={`flex-1 p-4 rounded-lg border ${
                  step.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex justify-between">
                  <h4 className="font-semibold">{step.title}</h4>
                  <span className="text-sm text-gray-500">
                    Step {index + 1}
                  </span>
                </div>
                {step.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Roadmap;

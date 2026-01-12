import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { CheckCircle, Circle } from 'lucide-react';

const Roadmap = ({ topics = [] }) => {
  const { token, user, fetchProfile } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(topics[0] || '');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (topics && topics.length > 0 && !selectedTopic) setSelectedTopic(topics[0]);
  }, [topics]);

  useEffect(() => {
    if (selectedTopic) fetchRoadmap(selectedTopic);
  }, [selectedTopic]);

  const fetchRoadmap = async (topic) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/roadmap?topic=${encodeURIComponent(topic)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoadmap(res.data.roadmap);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = async (index) => {
    if (!roadmap) return;
    setUpdating(true);
    setError('');
    const completed = !roadmap.steps[index].completed;
    try {
      const res = await axios.patch(`/api/roadmap/${roadmap._id}/steps/${index}`, { completed }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoadmap(res.data.roadmap);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update step');
    } finally {
      setUpdating(false);
    }
  };

  const regenerate = async () => {
    if (!roadmap) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`/api/roadmap/${roadmap._id}/regenerate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoadmap(res.data.roadmap);
      // refresh profile in case level changed elsewhere
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to regenerate roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold">My Roadmap</h3>
        <p className="text-sm text-gray-600">Track progress and regenerate plans per topic</p>
      </div>

      {/* Topics + Regenerate Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div className="flex-1">
          {topics && topics.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {topics.map((t, i) => {
                // simple color palette rotation
                const gradients = [
                  'from-blue-500 to-indigo-500',
                  'from-purple-500 to-pink-500',
                  'from-emerald-400 to-teal-500',
                  'from-yellow-400 to-orange-400',
                ];
                const grad = gradients[i % gradients.length];
                const active = selectedTopic === t;

                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTopic(t)}
                    className={`relative overflow-hidden rounded-xl px-4 py-3 text-white font-semibold transform transition-all duration-200 focus:outline-none flex items-center gap-3 ${active ? `bg-gradient-to-r ${grad} shadow-lg scale-105` : `bg-gradient-to-r ${grad} bg-opacity-80 hover:scale-105 hover:shadow`} `}
                  >
                    <span className="truncate max-w-xs">{t}</span>
                    {active && <CheckCircle className="w-5 h-5 text-white/90 opacity-95" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">No topics found. Add goals to see roadmaps.</p>
          )}
        </div>

        <div className="flex-shrink-0">
          <button onClick={regenerate} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 transition-shadow shadow">
            Regenerate Roadmap
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-600">Loading roadmap...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && roadmap && (
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
          <ul className="space-y-6">
            {roadmap.steps.map((s, idx) => (
              <li key={idx} className={`flex items-start gap-4 transition-transform ${s.completed ? 'opacity-80' : ''}`}>
                <button onClick={() => toggleStep(idx)} disabled={updating} className="flex-shrink-0">
                  {s.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>

                <div className={`flex-1 p-4 rounded-lg transition ${s.completed ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-100 hover:shadow'} `}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${s.completed ? 'text-green-800' : 'text-gray-900'}`}>{s.title}</h4>
                    <span className="text-sm text-gray-500">Step {idx + 1}</span>
                  </div>
                  {s.description && <p className="text-sm text-gray-600 mt-2">{s.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Roadmap;

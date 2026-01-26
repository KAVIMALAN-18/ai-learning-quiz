import React, { useEffect, useState } from 'react';
import api from '../../services/api.client';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Sparkles, ArrowRight, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SmartRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await api.get('/recommendations');
        setRecommendations(res.data.recommendations || []);
      } catch (err) {
        console.error("Failed to load AI recommendations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-40 bg-slate-100 rounded-xl"></div>
    </div>
  );

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-10 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-primary-500 fill-primary-500" size={20} />
        <h2 className="text-xl font-bold text-slate-900">Recommended For You</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec, i) => (
          <Card key={i} className="p-6 relative overflow-hidden group hover:shadow-xl transition-shadow border-t-4 border-t-primary-500">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target size={80} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-primary-50 text-primary-700 rounded">
                  {rec.type}
                </span>
                {rec.difficulty && (
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {rec.difficulty}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                {rec.title}
              </h3>

              <p className="text-sm text-slate-500 mb-6 flex-grow">
                {rec.reason}
              </p>

              <Button
                size="sm"
                variant="outline"
                className="w-full justify-between group-hover:bg-primary-50 group-hover:border-primary-200 group-hover:text-primary-700"
                onClick={() => navigate(rec.type === 'QUIZ' ? `/quiz/start?topic=${rec.actionTopic}` : '/dashboard/roadmap')}
              >
                Start Now <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SmartRecommendations;

import React from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

function List({ title, items, variant = 'strength' }) {
  const isStrength = variant === 'strength';
  const Icon = isStrength ? TrendingUp : AlertCircle;
  const bgColor = isStrength ? 'bg-emerald-50/50' : 'bg-amber-50/50';
  const iconColor = isStrength ? 'text-emerald-500' : 'text-amber-500';

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className={iconColor} />
        <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.1em]">{title}</div>
      </div>
      <ul className="space-y-3">
        {items.length === 0 && <li className="text-sm text-slate-400 italic px-2">No insights ready yet...</li>}
        {items.map((it) => (
          <li key={it.topic} className={`p-4 ${bgColor} rounded-2xl border border-white/50 transition-all hover:scale-[1.02] cursor-default`}>
            <div className="text-[13px] font-bold text-slate-800">{it.topic}</div>
            <div className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">{it.note}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InsightsPanel({ strengths = [], needs = [] }) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="flex items-center gap-2 text-primary-600 mb-1">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Personalized AI Engine</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Learning Insights</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-400 hover:text-primary-600">
          View Report
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <List title="Core Strengths" items={strengths} variant="strength" />
        <List title="Opportunity Areas" items={needs} variant="need" />
      </div>
    </div>
  );
}

InsightsPanel.propTypes = {
  strengths: PropTypes.array,
  needs: PropTypes.array,
};

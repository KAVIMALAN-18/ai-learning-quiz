import React from 'react';
import PropTypes from 'prop-types';

export default function StatCard({ label, value, hint, percent }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <div className="text-2xl font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors uppercase">{value}</div>
          {hint && <p className="mt-1.5 text-[11px] text-slate-400 font-medium leading-tight">{hint}</p>}
        </div>
        {typeof percent === 'number' && (
          <div className="flex-shrink-0 relative">
            <svg width="64" height="64" className="transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="5" fill="none" />
              <circle
                cx="32" cy="32" r="28"
                stroke="currentColor"
                strokeWidth="5"
                fill="none"
                strokeDasharray={`${(2 * Math.PI * 28 * percent) / 100} ${2 * Math.PI * 28}`}
                strokeLinecap="round"
                className="text-primary-500 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary-700">
              {Math.round(percent)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hint: PropTypes.string,
  percent: PropTypes.number,
};

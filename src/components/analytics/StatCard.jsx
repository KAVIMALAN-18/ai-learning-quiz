import React from 'react';
import PropTypes from 'prop-types';

export default function StatCard({ label, value, hint, percent }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-xl font-bold text-gray-900">{value}</div>
        </div>
        {typeof percent === 'number' && (
          <div className="w-20 h-20 flex items-center justify-center">
            <svg width="56" height="56">
              <circle cx="28" cy="28" r="24" stroke="#f3f4f6" strokeWidth="6" fill="none" />
              <circle cx="28" cy="28" r="24" stroke="#4f46e5" strokeWidth="6" fill="none" strokeDasharray={`${(2*Math.PI*24*percent)/100} ${2*Math.PI*24}`} transform="rotate(-90 28 28)" />
              <text x="28" y="32" fontSize="12" textAnchor="middle" fill="#111827" fontWeight="600">{Math.round(percent)}%</text>
            </svg>
          </div>
        )}
      </div>
      {hint && <div className="mt-2 text-sm text-gray-500">{hint}</div>}
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hint: PropTypes.string,
  percent: PropTypes.number,
};

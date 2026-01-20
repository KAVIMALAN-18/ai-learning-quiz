import React from "react";
import PropTypes from "prop-types";

export default function ProgressRing({ value = 0, size = 80, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="#6366f1"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        className="text-sm font-semibold fill-gray-700"
      >
        {value}%
      </text>
    </svg>
  );
}

ProgressRing.propTypes = {
  value: PropTypes.number,
  size: PropTypes.number,
  stroke: PropTypes.number,
};

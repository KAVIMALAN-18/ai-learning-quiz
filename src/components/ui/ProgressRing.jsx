import React from "react";
import PropTypes from "prop-types";

export default function ProgressRing({ value = 0, size = 80, stroke = 8, color = "#4f46e5" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        stroke="#f1f5f9"
        fill="transparent"
        strokeWidth={stroke}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

ProgressRing.propTypes = {
  value: PropTypes.number,
  size: PropTypes.number,
  stroke: PropTypes.number,
};

import React from "react";
import PropTypes from "prop-types";

export default function LoadingSpinner({ size = "md" }) {
  const sizeMap = {
    sm: 16,
    md: 32,
    lg: 48,
    xl: 64
  };

  const pixelSize = typeof size === "number" ? size : (sizeMap[size] || 32);

  return (
    <div className="flex items-center justify-center">
      <svg
        className="animate-spin"
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loading"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <path
          d="M4 12a8 8 0 018-8"
          stroke="#6366f1"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.number,
};

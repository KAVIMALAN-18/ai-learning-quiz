import React from "react";
import PropTypes from "prop-types";

export function Card({ children, className = "", noPadding = false }) {
  return (
    <div className={`bg-white rounded-md shadow-premium transition-all duration-300 hover:shadow-premium-hover ${noPadding ? "" : "p-6"} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-lg font-bold text-neutral-900 ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`${className}`}>{children}</div>;
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  noPadding: PropTypes.bool,
};

// Default export for backward compatibility
export default Card;

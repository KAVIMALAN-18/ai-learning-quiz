import React from "react";
import PropTypes from "prop-types";

export function Card({ children, className = "", noPadding = false, variant = "default", interactive = false }) {
  const variants = {
    default: "bg-white border border-surface-200",
    glass: "glass-panel",
    premium: "bg-white shadow-premium border-none relative overflow-hidden",
    outline: "bg-transparent border-2 border-surface-200",
    surface: "bg-surface-50 border border-surface-200",
  };

  const baseClasses = "rounded-3xl transition-all duration-300";
  const interactiveClasses = interactive ? "interactive-hover" : "";
  const variantClass = variants[variant] || variants.default;

  return (
    <div className={`${baseClasses} ${variantClass} ${interactiveClasses} ${noPadding ? "" : "p-6 md:p-8"} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-xl font-bold text-surface-900 tracking-tight ${className}`}>{children}</h3>;
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

import React from "react";
import PropTypes from "prop-types";

const VARIANTS = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:shadow-inner",
  secondary: "bg-secondary-600 text-white hover:bg-secondary-700 shadow-lg shadow-secondary-500/20",
  outline: "bg-transparent border-2 border-primary-200 text-primary-700 hover:bg-primary-50",
  glass: "glass-panel bg-white/40 hover:bg-white/60",
  ghost: "bg-transparent text-surface-600 hover:bg-surface-100 hover:text-surface-900",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
  premium: "bg-premium-gradient text-white shadow-premium hover:opacity-90 interactive-hover",
  white: "bg-white text-surface-900 hover:bg-surface-50 shadow-sm border border-surface-200",
};

const SIZES = {
  sx: "px-2 py-1 text-[10px] tracking-widest uppercase font-black",
  sm: "px-4 py-2 text-xs tracking-wide font-bold",
  md: "px-6 py-3 text-sm tracking-normal font-black",
  lg: "px-10 py-4 text-base tracking-tight font-black",
  xl: "px-12 py-5 text-lg tracking-tighter font-black",
};

import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  disabled = false,
  isLoading = false,
  fullWidth = false,
  ...props
}) {
  const base = "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  const isDisabled = disabled || isLoading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${base} ${variantClass} ${sizeClass} ${fullWidth ? "w-full" : ""
        } ${isDisabled ? "opacity-60 cursor-not-allowed grayscale-[0.2]" : ""} ${className}`}
      {...props}
    >
      {isLoading && (
        <Loader2 size={16} className="mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
}


Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "ghost", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

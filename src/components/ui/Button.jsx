import React from "react";
import PropTypes from "prop-types";

const VARIANTS = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/10",
  secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
  outline: "bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50",
  ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100",
  danger: "bg-error text-white hover:bg-error/90 shadow-md shadow-error/10",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
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
  const base = "inline-flex items-center justify-center rounded-md font-bold transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

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

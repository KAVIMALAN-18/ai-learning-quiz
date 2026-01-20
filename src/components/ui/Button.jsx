import React from "react";
import PropTypes from "prop-types";

const VARIANTS = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  ghost: "bg-gray-50 text-gray-700 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  fullWidth = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const variantClass = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variantClass} ${
        fullWidth ? "w-full" : ""
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["primary", "ghost", "danger"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

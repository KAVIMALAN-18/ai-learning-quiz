import React from "react";

const variants = {
    primary: "bg-primary-50 text-primary-700 border-primary-100",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-error/10 text-error border-error/20",
    neutral: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
};

export default function Badge({
    children,
    variant = "neutral",
    size = "md",
    className = "",
    rounded = "full"
}) {
    const variantClasses = variants[variant] || variants.neutral;
    const sizeClasses = sizes[size] || sizes.md;
    const roundedClasses = rounded === "full" ? "rounded-full" : "rounded-md";

    return (
        <span className={`inline-flex items-center font-bold uppercase tracking-wider border ${variantClasses} ${sizeClasses} ${roundedClasses} ${className}`}>
            {children}
        </span>
    );
}

import React from "react";
import PropTypes from "prop-types";

export default function Skeleton({ className = "", variant = "rect" }) {
    const baseClass = "animate-pulse bg-neutral-200";
    const variantClasses = {
        rect: "rounded-md",
        circle: "rounded-full",
        text: "rounded-md h-4 w-full",
    };

    return (
        <div
            className={`${baseClass} ${variantClasses[variant] || variantClasses.rect} ${className}`}
        />
    );
}

Skeleton.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.oneOf(["rect", "circle", "text"]),
};

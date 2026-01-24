import React from "react";

/**
 * Container component that enforces a consistent max‑width and horizontal padding.
 * Uses Tailwind's `container` utility which respects the custom `maxWidth` set in the config.
 */
export default function Container({ children, className = "" }) {
    return (
        <div className={`container mx-auto px-4 ${className}`}>
            {children}
        </div>
    );
}

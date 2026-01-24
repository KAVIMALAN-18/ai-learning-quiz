import React from "react";

/**
 * Title – page level heading
 */
export const Title = ({ children, className = "" }) => (
    <h1 className={`text-2xl md:text-3xl font-black text-neutral-900 tracking-tight ${className}`}>
        {children}
    </h1>
);

/**
 * SectionHeader – subsection heading
 */
export const SectionHeader = ({ children, className = "" }) => (
    <h2 className={`text-xl font-bold text-neutral-800 ${className}`}>
        {children}
    </h2>
);

/**
 * BodyText – regular paragraph text
 */
export const BodyText = ({ children, className = "" }) => (
    <p className={`text-base text-neutral-600 leading-relaxed font-medium ${className}`}>
        {children}
    </p>
);

/**
 * MetaText – secondary information, timestamps, etc.
 */
export const MetaText = ({ children, className = "" }) => (
    <span className={`text-sm text-neutral-500 font-medium ${className}`}>
        {children}
    </span>
);

/**
 * Label - form labels or very small meta info
 */
export const Label = ({ children, className = "" }) => (
    <span className={`text-xs font-bold uppercase tracking-wider text-neutral-400 ${className}`}>
        {children}
    </span>
);


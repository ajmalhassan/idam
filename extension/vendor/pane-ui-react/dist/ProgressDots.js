"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, } from "react";
/** Indeterminate activity. Decorative mode is for an already-labelled busy control. */
export const ProgressDots = forwardRef(function ProgressDots({ decorative = false, label, className = "", ...props }, ref) {
    return (_jsx("span", { ...props, ref: ref, className: `wp-progress-dots ${className}`, role: decorative ? undefined : "progressbar", "aria-label": decorative ? undefined : label, "aria-hidden": decorative ? true : props["aria-hidden"], children: [0, 1, 2, 3, 4].map((index) => (_jsx("span", { className: "wp-progress-dot", "aria-hidden": "true", style: { "--wp-dot-index": index } }, index))) }));
});

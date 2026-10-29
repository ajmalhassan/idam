"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, } from "react";
import { ProgressDots } from "./ProgressDots.js";
/** One normalized value feeds both the visual and accessibility representations. */
function progressState(value, maximum) {
    const max = Number.isFinite(maximum) && maximum > 0 ? maximum : 100;
    const current = value !== undefined && Number.isFinite(value)
        ? Math.min(max, Math.max(0, value))
        : undefined;
    return {
        max,
        current,
        fraction: current === undefined ? undefined : current / max,
    };
}
function progressAttributes(decorative, label, state) {
    return {
        role: decorative ? undefined : "progressbar",
        "aria-label": decorative ? undefined : label,
        "aria-hidden": decorative ? true : undefined,
        "aria-valuemin": decorative ? undefined : 0,
        "aria-valuemax": decorative ? undefined : state.max,
        "aria-valuenow": decorative ? undefined : state.current,
        "data-indeterminate": state.current === undefined || undefined,
    };
}
export const Progress = forwardRef(function Progress({ value, max = 100, decorative = false, label, className = "", ...props }, ref) {
    const state = progressState(value, max);
    return (_jsx("span", { ...props, ...progressAttributes(decorative, label, state), "aria-hidden": decorative ? true : props["aria-hidden"], ref: ref, className: `wp-progress ${className}`, children: state.fraction === undefined ? (_jsx(ProgressDots, { decorative: true })) : (_jsx("span", { className: "wp-progress-track", "aria-hidden": "true", children: _jsx("span", { className: "wp-progress-fill", style: { width: `${state.fraction * 100}%` } }) })) }));
});
export const ProgressRing = forwardRef(function ProgressRing({ value, max = 100, decorative = false, label, size = "medium", className = "", ...props }, ref) {
    const state = progressState(value, max);
    return (_jsx("span", { ...props, ...progressAttributes(decorative, label, state), "aria-hidden": decorative ? true : props["aria-hidden"], ref: ref, className: `wp-progress-ring ${className}`, "data-size": size, children: _jsx("svg", { viewBox: "0 0 48 48", "aria-hidden": "true", focusable: "false", children: state.fraction === undefined ? ([0, 1, 2, 3, 4].map((index) => (_jsx("g", { className: "wp-ring-orbit", style: { "--wp-orbit-index": index }, children: _jsx("circle", { cx: "24", cy: "5", r: "2", fill: "currentColor" }) }, index)))) : (_jsxs(_Fragment, { children: [_jsx("circle", { className: "wp-ring-track", cx: "24", cy: "24", r: "20", fill: "none", strokeWidth: "3" }), _jsx("circle", { className: "wp-ring-value", cx: "24", cy: "24", r: "20", fill: "none", strokeWidth: "3", pathLength: "100", strokeDasharray: `${state.fraction * 100} 100`, transform: "rotate(-90 24 24)" })] })) }) }));
});

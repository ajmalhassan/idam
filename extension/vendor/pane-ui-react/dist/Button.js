"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, } from "react";
import { ProgressDots } from "./ProgressDots.js";
import { usePressTilt } from "./usePressTilt.js";
export const Button = forwardRef(function Button({ type = "button", variant = "outlined", loading = false, disabled, className = "", children, onClick, ...props }, ref) {
    const tilt = usePressTilt(props, disabled || loading);
    return (_jsxs("button", { ...props, ...tilt, ref: ref, type: type, disabled: disabled, className: `wp-pressable wp-button ${className}`, "data-variant": variant, "data-loading": loading || undefined, "aria-busy": loading || props["aria-busy"], "aria-disabled": loading || props["aria-disabled"], onClick: (event) => {
            if (loading) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            onClick?.(event);
        }, children: [children, loading && _jsx(ProgressDots, { decorative: true, className: "wp-button-progress" })] }));
});
export const IconButton = forwardRef(function IconButton({ label, icon, className = "", ...props }, ref) {
    return (_jsx(Button, { ...props, ref: ref, className: `wp-icon-button ${className}`, "aria-label": props["aria-label"] ?? label, title: props.title ?? label, children: _jsx("span", { "aria-hidden": "true", children: icon }) }));
});
/** Circular navigation command. The application owns history and navigation. */
export const BackButton = forwardRef(function BackButton({ label = "Back", className = "", ...props }, ref) {
    return (_jsx(IconButton, { ...props, ref: ref, label: label, className: `wp-back-button ${className}`, icon: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", focusable: "false", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "1.6" }), _jsx("path", { d: "M17.5 11.2H8.9l3.5-3.5-1.1-1.1L5.9 12l5.4 5.4 1.1-1.1-3.5-3.5h8.6v-1.6Z", fill: "currentColor" })] }) }));
});

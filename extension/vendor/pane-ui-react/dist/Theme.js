"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
export const Theme = forwardRef(function Theme({ mode = "dark", accent = "blue", className = "", ...props }, ref) {
    return (_jsx("div", { ...props, ref: ref, className: `wp-theme ${className}`, "data-mode": mode, "data-accent": accent }));
});

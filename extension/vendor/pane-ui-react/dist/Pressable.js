"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { usePressTilt } from "./usePressTilt.js";
/** Native button: keyboard activation, form ownership, and disabled semantics stay native. */
export const Pressable = forwardRef(function Pressable({ type = "button", className = "", ...props }, ref) {
    const tilt = usePressTilt(props, props.disabled);
    return (_jsx("button", { ...props, ...tilt, type: type, ref: ref, className: `wp-pressable ${className}` }));
});

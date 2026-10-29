"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useId, useRef, useImperativeHandle, useState, } from "react";
import { usePressTilt } from "./usePressTilt.js";
import { Pressable } from "./Pressable.js";
import { useEnvironment } from "./useEnvironment.js";
const tileClass = (className) => `wp-tile ${className}`;
function TileContent({ label, children, }) {
    return (_jsxs(_Fragment, { children: [_jsx("span", { className: "wp-tile-content", children: children }), " ", _jsx("span", { className: "wp-tile-label", children: label })] }));
}
export const Tile = forwardRef(function Tile({ label, size = "small", accent = "accent", children, className = "", ...props }, ref) {
    return (_jsx("div", { ...props, ref: ref, className: tileClass(className), "data-size": size, "data-accent": accent, children: _jsx(TileContent, { label: label, children: children }) }));
});
export const TileLink = forwardRef(function TileLink({ label, size = "small", accent = "accent", children, className = "", ...props }, ref) {
    const tilt = usePressTilt(props);
    return (_jsx("a", { ...props, ...tilt, ref: ref, className: tileClass(`wp-pressable ${className}`), "data-size": size, "data-accent": accent, children: _jsx(TileContent, { label: label, children: children }) }));
});
/** Faces must contain presentational content, because the owner is a native button. */
export const RevealTile = forwardRef(function RevealTile({ label, size = "small", accent = "accent", front, back, revealed, defaultRevealed = false, onRevealedChange, onClick, className = "", ...props }, ref) {
    const [internal, setInternal] = useState(defaultRevealed);
    const open = revealed ?? internal;
    const id = useId();
    return (_jsxs(Pressable, { ...props, ref: ref, className: tileClass(`wp-reveal-tile ${className}`), "data-size": size, "data-accent": accent, "data-revealed": open, "aria-pressed": open, "aria-labelledby": props["aria-labelledby"] ??
            (props["aria-label"] ? undefined : `${id}-label`), "aria-describedby": [
            `${id}-${open ? "back" : "front"}`,
            props["aria-describedby"],
        ]
            .filter(Boolean)
            .join(" "), onClick: (event) => {
            onClick?.(event);
            if (event.defaultPrevented)
                return;
            if (revealed === undefined)
                setInternal(!open);
            onRevealedChange?.(!open);
        }, children: [_jsxs("span", { className: "wp-reveal-faces", children: [_jsx("span", { id: `${id}-front`, className: "wp-reveal-front", "aria-hidden": open, children: front }), _jsx("span", { id: `${id}-back`, className: "wp-reveal-back", "aria-hidden": !open, children: back })] }), " ", _jsx("span", { id: `${id}-label`, className: "wp-tile-label", children: label })] }));
});
/** Provide a stable summary in accessibleLabel. Items are decorative; use plain presentational content. */
export const LiveTile = forwardRef(function LiveTile({ label, size = "wide", accent = "accent", items, accessibleLabel, intervalMs = 5000, paused, defaultPaused = false, onPausedChange, className = "", onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) {
    const [internalPaused, setInternalPaused] = useState(defaultPaused);
    const [index, setIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const { reduced, hidden } = useEnvironment();
    const stopped = paused ?? internalPaused;
    const count = items.length;
    const root = useRef(null);
    useImperativeHandle(ref, () => root.current, []);
    useEffect(() => {
        // Removing a focused control does not reliably emit blur.
        setFocused(Boolean(root.current?.contains(document.activeElement)));
    }, [count]);
    const current = count ? index % count : 0;
    const controlName = typeof label === "string" ? label : accessibleLabel;
    const delay = Number.isFinite(intervalMs)
        ? Math.max(1000, intervalMs)
        : 5000;
    useEffect(() => {
        if (stopped || reduced || hidden || hovered || focused || count < 2)
            return;
        const timer = window.setInterval(() => setIndex((value) => (value + 1) % count), delay);
        return () => window.clearInterval(timer);
    }, [stopped, reduced, hidden, hovered, focused, count, delay]);
    return (_jsxs("div", { ...props, ref: root, className: tileClass(`wp-live-tile ${className}`), "data-size": size, "data-accent": accent, "data-paused": stopped || reduced || hidden || hovered || focused, onMouseEnter: (event) => {
            onMouseEnter?.(event);
            setHovered(true);
        }, onMouseLeave: (event) => {
            onMouseLeave?.(event);
            setHovered(false);
        }, onFocus: (event) => {
            onFocus?.(event);
            setFocused(true);
        }, onBlur: (event) => {
            onBlur?.(event);
            if (!event.currentTarget.contains(event.relatedTarget))
                setFocused(false);
        }, children: [_jsx("div", { className: "wp-live-visual", role: "img", "aria-label": accessibleLabel, children: _jsx("span", { "aria-hidden": "true", className: "wp-live-frame", children: items[current] }, current) }), _jsxs("div", { className: "wp-live-footer", children: [_jsx("span", { className: "wp-tile-label", children: label }), count > 1 && (_jsxs("div", { className: "wp-live-controls", children: [_jsx(Pressable, { "aria-label": `${stopped ? "Resume" : "Pause"} ${controlName}`, "aria-pressed": stopped, onClick: () => {
                                    if (paused === undefined)
                                        setInternalPaused(!stopped);
                                    onPausedChange?.(!stopped);
                                }, children: stopped ? "▶" : "Ⅱ" }), _jsx(Pressable, { "aria-label": `Next ${controlName}`, onClick: () => setIndex((value) => (value + 1) % count), children: "\u2192" })] }))] })] }));
});

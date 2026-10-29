"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId, useRef, useState, useEffect, useLayoutEffect, } from "react";
import { usePressTilt } from "./usePressTilt.js";
import { Button } from "./Button.js";
import { Pressable } from "./Pressable.js";
export const AppBar = forwardRef(function AppBar({ className = "", ...props }, ref) {
    return _jsx("div", { ...props, ref: ref, className: `wp-app-bar ${className}` });
});
export const AppBarAction = forwardRef(function AppBarAction({ icon, label, className = "", ...props }, ref) {
    return (_jsxs(Pressable, { ...props, ref: ref, className: `wp-app-bar-action ${className}`, children: [_jsx("span", { className: "wp-app-bar-icon", "aria-hidden": "true", children: icon }), _jsx("span", { children: label })] }));
});
export const AppBarLink = forwardRef(function AppBarLink({ icon, label, className = "", ...props }, ref) {
    const tilt = usePressTilt(props);
    return (_jsxs("a", { ...props, ...tilt, ref: ref, className: `wp-pressable wp-app-bar-action wp-app-bar-link ${className}`, children: [_jsx("span", { className: "wp-app-bar-icon", "aria-hidden": "true", children: icon }), _jsx("span", { children: label })] }));
});
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
/** An inline disclosure of commands. Ordinary Tab order; no popup-menu semantics. */
export const AppBarOverflow = forwardRef(function AppBarOverflow({ open: controlled, defaultOpen = false, onOpenChange, label = "More commands", children, className = "", onKeyDown, ...props }, ref) {
    const [internal, setInternal] = useState(defaultOpen);
    const open = controlled ?? internal;
    const id = useId();
    const trigger = useRef(null);
    const panel = useRef(null);
    const wasOpen = useRef(open);
    const focusedInside = useRef(false);
    useBrowserLayoutEffect(() => {
        const active = document.activeElement;
        // Hiding a focused panel can move focus to body before this effect runs.
        // Never reclaim it from an outside control, even after a child is removed
        // without dispatching blur and leaves our last-focus flag stale.
        const canRestore = panel.current?.contains(active) ||
            (focusedInside.current && active === document.body);
        if (wasOpen.current && !open && canRestore)
            trigger.current?.focus({ preventScroll: true });
        wasOpen.current = open;
    }, [open]);
    const change = (next) => {
        if (controlled === undefined)
            setInternal(next);
        onOpenChange?.(next);
    };
    return (_jsxs("div", { ...props, ref: ref, className: `wp-app-bar-overflow ${className}`, onKeyDown: (event) => {
            onKeyDown?.(event);
            if (!event.defaultPrevented && event.key === "Escape" && open) {
                event.preventDefault();
                change(false);
            }
        }, children: [_jsxs(Button, { ref: trigger, className: "wp-app-bar-more", variant: "subtle", "aria-expanded": open, "aria-controls": id, onClick: () => change(!open), children: [_jsx("span", { "aria-hidden": "true", children: "\u2022\u2022\u2022" }), _jsx("span", { children: label })] }), _jsx("div", { ref: panel, id: id, className: "wp-app-bar-extra", hidden: !open, onFocusCapture: () => {
                    focusedInside.current = true;
                }, onBlurCapture: (event) => {
                    focusedInside.current = event.currentTarget.contains(event.relatedTarget);
                }, children: children })] }));
});

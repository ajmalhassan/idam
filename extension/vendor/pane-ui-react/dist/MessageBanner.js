"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, } from "react";
import { IconButton } from "./Button.js";
/** Persistent feedback. The owner manages visibility and any focus restoration on removal. */
export const MessageBanner = forwardRef(function MessageBanner({ tone = "info", heading, announcement = "off", actions, onDismiss, dismissLabel, children, className = "", ...props }, ref) {
    return (_jsxs("div", { ...props, ref: ref, className: `wp-message-banner ${className}`, "data-tone": tone, children: [_jsx("span", { className: "wp-message-symbol", "aria-hidden": "true", children: _jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", focusable: "false", children: [tone === "info" && (_jsx("circle", { cx: "12", cy: "12", r: "9", stroke: "currentColor", strokeWidth: "1.5" })), _jsx("path", { d: {
                                info: "M12 11v6M12 7v.5",
                                success: "m5 12 4 4L19 6",
                                warning: "M12 5v9M12 18v1",
                                error: "m6 6 12 12M18 6 6 18",
                            }[tone], stroke: "currentColor", strokeWidth: "2", strokeLinecap: "square", strokeLinejoin: "miter" })] }) }), _jsxs("div", { className: "wp-message-main", children: [_jsxs("div", { role: announcement === "assertive"
                            ? "alert"
                            : announcement === "polite"
                                ? "status"
                                : undefined, "aria-atomic": announcement === "off" ? undefined : true, children: [heading && _jsx("div", { className: "wp-message-heading", children: heading }), _jsx("div", { className: "wp-message-content", children: children })] }), actions && _jsx("div", { className: "wp-message-actions", children: actions })] }), onDismiss && (_jsx(IconButton, { className: "wp-message-dismiss", variant: "subtle", label: dismissLabel, onClick: onDismiss, icon: _jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", children: _jsx("path", { d: "m6 6 12 12M18 6 6 18", stroke: "currentColor", strokeWidth: "2" }) }) }))] }));
});

"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useId, } from "react";
export const List = forwardRef(function List({ animate = false, className = "", ...props }, ref) {
    return (_jsx("ul", { ...props, ref: ref, role: props.role ?? "list", className: `wp-list ${className}`, "data-animate": animate || undefined }));
});
/** Main action and secondary controls are siblings: never nest interactive elements. */
export const ListItem = forwardRef(function ListItem({ title, description, leading, meta, action, actions, className = "", ...props }, ref) {
    const content = (_jsxs(_Fragment, { children: [leading && _jsx("span", { className: "wp-list-leading", children: leading }), _jsxs("span", { className: "wp-list-copy", children: [_jsx("span", { className: "wp-list-title", children: title }), description && (_jsx("span", { className: "wp-list-description", children: description })), meta && _jsx("span", { className: "wp-list-meta", children: meta })] })] }));
    return (_jsxs("li", { ...props, ref: ref, className: `wp-list-item ${className}`, children: [action?.type === "link" ? (_jsx("a", { ...action.props, href: action.href, className: `wp-list-primary wp-list-interactive ${action.props?.className ?? ""}`, children: content })) : action?.type === "button" ? (_jsx("button", { ...action.props, type: action.props?.type ?? "button", className: `wp-list-primary wp-list-interactive ${action.props?.className ?? ""}`, children: content })) : (_jsx("div", { className: "wp-list-primary", children: content })), actions && _jsx("div", { className: "wp-list-actions", children: actions })] }));
});
export const SectionHeader = forwardRef(function SectionHeader({ level = 2, meta, children, className = "", ...props }, ref) {
    const Heading = level === 2 ? "h2" : level === 3 ? "h3" : "h4";
    return (_jsxs(Heading, { ...props, ref: ref, className: `wp-section-header ${className}`, children: [_jsx("span", { children: children }), " ", meta && _jsx("span", { className: "wp-section-meta", children: meta })] }));
});
export const EmptyState = forwardRef(function EmptyState({ title, description, actions, icon, headingLevel = 3, className = "", ...props }, ref) {
    const id = useId();
    const Heading = headingLevel === 2 ? "h2" : headingLevel === 3 ? "h3" : "h4";
    return (_jsxs("section", { ...props, ref: ref, "aria-labelledby": props["aria-labelledby"] ?? id, className: `wp-empty-state ${className}`, children: [icon && (_jsx("div", { className: "wp-empty-icon", "aria-hidden": "true", children: icon })), _jsx(Heading, { id: id, children: title }), description && (_jsx("div", { className: "wp-empty-description", children: description })), actions && _jsx("div", { className: "wp-empty-actions", children: actions })] }));
});

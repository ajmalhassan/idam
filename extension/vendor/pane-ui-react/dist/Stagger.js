"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Children, forwardRef, isValidElement, } from "react";
/** Keyed wrappers preserve child identity. Hiding is immediate; entrances stagger. */
export const Stagger = forwardRef(function Stagger({ show, interval = 35, children, className, ...props }, ref) {
    const spacing = Number.isFinite(interval) ? Math.max(0, interval) : 35;
    return (_jsx("div", { ...props, ref: ref, className: ["wp-stagger", className].filter(Boolean).join(" "), "data-show": show, hidden: !show || props.hidden, inert: !show || props.inert, "aria-hidden": !show ? true : props["aria-hidden"], children: Children.toArray(children).map((child, index) => (_jsx("div", { className: "wp-stagger-item", style: {
                "--wp-stagger-delay": `${Math.min(index * spacing, 240)}ms`,
            }, children: child }, isValidElement(child) ? child.key : index))) }));
});

"use client";
import { useEffect, useRef, } from "react";
/** Shared contact-point math for native buttons and anchors; never captures touch scrolling. */
export function usePressTilt(props, disabled = false) {
    const target = useRef(null);
    const box = useRef(null);
    const reduced = useRef(true);
    const clear = () => {
        target.current?.style.removeProperty("--wp-press-rotate-x");
        target.current?.style.removeProperty("--wp-press-rotate-y");
        target.current = null;
        box.current = null;
    };
    useEffect(() => {
        const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        const update = () => {
            reduced.current = media?.matches ?? false;
            if (reduced.current)
                clear();
        };
        update();
        media?.addEventListener?.("change", update);
        window.addEventListener("pointerup", clear);
        window.addEventListener("pointercancel", clear);
        window.addEventListener("blur", clear);
        return () => {
            clear();
            media?.removeEventListener?.("change", update);
            window.removeEventListener("pointerup", clear);
            window.removeEventListener("pointercancel", clear);
            window.removeEventListener("blur", clear);
        };
    }, []);
    useEffect(() => {
        if (disabled)
            clear();
    }, [disabled]);
    const write = (event, fresh) => {
        if (disabled || reduced.current || event.defaultPrevented)
            return;
        target.current = event.currentTarget;
        const bounds = fresh || !box.current
            ? event.currentTarget.getBoundingClientRect()
            : box.current;
        box.current = bounds;
        if (!bounds.width || !bounds.height)
            return;
        const x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
        const y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
        event.currentTarget.style.setProperty("--wp-press-rotate-x", `${-y * 4}deg`);
        event.currentTarget.style.setProperty("--wp-press-rotate-y", `${x * 4}deg`);
    };
    return {
        onPointerDown(event) {
            props.onPointerDown?.(event);
            if (event.button === 0)
                write(event, true);
        },
        onPointerMove(event) {
            props.onPointerMove?.(event);
            if (event.pointerType !== "touch")
                write(event, false);
        },
        onPointerEnter(event) {
            props.onPointerEnter?.(event);
            if (!disabled &&
                !reduced.current &&
                !event.defaultPrevented &&
                event.pointerType !== "touch") {
                target.current = event.currentTarget;
                box.current = event.currentTarget.getBoundingClientRect();
            }
        },
        onPointerUp(event) {
            props.onPointerUp?.(event);
            clear();
        },
        onPointerCancel(event) {
            props.onPointerCancel?.(event);
            clear();
        },
        onPointerLeave(event) {
            props.onPointerLeave?.(event);
            clear();
        },
        onLostPointerCapture(event) {
            props.onLostPointerCapture?.(event);
            clear();
        },
    };
}

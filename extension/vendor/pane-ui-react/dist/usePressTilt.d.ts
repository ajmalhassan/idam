import { type HTMLAttributes, type PointerEvent } from "react";
/** Shared contact-point math for native buttons and anchors; never captures touch scrolling. */
export declare function usePressTilt<T extends HTMLElement>(props: HTMLAttributes<T>, disabled?: boolean): {
    onPointerDown(event: PointerEvent<T>): void;
    onPointerMove(event: PointerEvent<T>): void;
    onPointerEnter(event: PointerEvent<T>): void;
    onPointerUp(event: PointerEvent<T>): void;
    onPointerCancel(event: PointerEvent<T>): void;
    onPointerLeave(event: PointerEvent<T>): void;
    onLostPointerCapture(event: PointerEvent<T>): void;
};

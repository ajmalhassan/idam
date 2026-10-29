import { type HTMLAttributes } from "react";
export type TransitionPreset = "turnstile" | "slide" | "continuum" | "fade";
export type TransitionDirection = "forward" | "backward";
export interface TransitionProps extends HTMLAttributes<HTMLDivElement> {
    show: boolean;
    preset?: TransitionPreset;
    direction?: TransitionDirection;
    /** Duration in milliseconds. Zero disables motion. */
    duration?: number;
    onEntered?: () => void;
    onExited?: () => void;
}
/** Router-independent presence. Initial visible content is immediately readable. */
export declare const Transition: import("react").ForwardRefExoticComponent<TransitionProps & import("react").RefAttributes<HTMLDivElement>>;

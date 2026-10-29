import { type HTMLAttributes } from "react";
export interface StaggerProps extends HTMLAttributes<HTMLDivElement> {
    show: boolean;
    /** Entrance spacing in milliseconds; cumulative delay is capped at 240ms. */
    interval?: number;
}
/** Keyed wrappers preserve child identity. Hiding is immediate; entrances stagger. */
export declare const Stagger: import("react").ForwardRefExoticComponent<StaggerProps & import("react").RefAttributes<HTMLDivElement>>;

import { type ComponentPropsWithoutRef } from "react";
type ProgressNativeProps = Omit<ComponentPropsWithoutRef<"span">, "children" | "role" | "aria-valuemin" | "aria-valuemax" | "aria-valuenow">;
export type ProgressProps = ProgressNativeProps & {
    /** Omit for indeterminate activity. Nonfinite values are also indeterminate. */
    value?: number;
    /** Positive finite maximum; defaults to 100 for missing or invalid values. */
    max?: number;
} & ({
    decorative: true;
    label?: never;
} | {
    decorative?: false;
    label: string;
});
export type ProgressRingProps = ProgressProps & {
    size?: "small" | "medium" | "large";
};
export declare const Progress: import("react").ForwardRefExoticComponent<ProgressProps & import("react").RefAttributes<HTMLSpanElement>>;
export declare const ProgressRing: import("react").ForwardRefExoticComponent<ProgressRingProps & import("react").RefAttributes<HTMLSpanElement>>;
export {};

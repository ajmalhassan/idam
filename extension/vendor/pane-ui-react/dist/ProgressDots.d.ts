import { type ComponentPropsWithoutRef } from "react";
type NativeProps = Omit<ComponentPropsWithoutRef<"span">, "children" | "role" | "aria-valuenow" | "aria-valuemin" | "aria-valuemax">;
export type ProgressDotsProps = NativeProps & ({
    decorative: true;
    label?: never;
} | {
    decorative?: false;
    label: string;
});
/** Indeterminate activity. Decorative mode is for an already-labelled busy control. */
export declare const ProgressDots: import("react").ForwardRefExoticComponent<ProgressDotsProps & import("react").RefAttributes<HTMLSpanElement>>;
export {};

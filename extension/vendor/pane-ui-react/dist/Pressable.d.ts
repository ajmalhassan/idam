import { type ComponentPropsWithoutRef } from "react";
export type PressableProps = ComponentPropsWithoutRef<"button">;
/** Native button: keyboard activation, form ownership, and disabled semantics stay native. */
export declare const Pressable: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;

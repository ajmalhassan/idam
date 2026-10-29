import { type ComponentPropsWithoutRef, type ReactNode } from "react";
export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
    variant?: "outlined" | "accent" | "subtle";
    /** Keeps focus and the accessible name while blocking repeated activation. */
    loading?: boolean;
}
export declare const Button: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
export interface IconButtonProps extends Omit<ButtonProps, "children"> {
    label: string;
    icon: ReactNode;
}
export declare const IconButton: import("react").ForwardRefExoticComponent<IconButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
export interface BackButtonProps extends Omit<IconButtonProps, "icon" | "label" | "variant"> {
    /** Localize or describe the destination. Defaults to "Back". */
    label?: string;
}
/** Circular navigation command. The application owns history and navigation. */
export declare const BackButton: import("react").ForwardRefExoticComponent<BackButtonProps & import("react").RefAttributes<HTMLButtonElement>>;

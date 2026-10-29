import { type ComponentPropsWithoutRef, type ReactNode } from "react";
export interface PanoramaItem {
    id: string;
    label: string;
    children: ReactNode;
}
export interface PanoramaProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    items: readonly PanoramaItem[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    duration?: number;
    dir?: "ltr" | "rtl";
}
/** Finite spatial tabs. Supply aria-label or aria-labelledby to name the tablist. */
export declare const Panorama: import("react").ForwardRefExoticComponent<PanoramaProps & import("react").RefAttributes<HTMLDivElement>>;

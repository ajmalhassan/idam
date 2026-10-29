import { type ComponentPropsWithoutRef } from "react";
export interface ThemeProps extends ComponentPropsWithoutRef<"div"> {
    mode?: "dark" | "light" | "system";
    accent?: "blue" | "violet" | "magenta" | "orange" | "green";
}
export declare const Theme: import("react").ForwardRefExoticComponent<ThemeProps & import("react").RefAttributes<HTMLDivElement>>;

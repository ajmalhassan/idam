import { type ComponentPropsWithoutRef } from "react";
export interface PivotProps extends ComponentPropsWithoutRef<"div"> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    activationMode?: "automatic" | "manual";
    orientation?: "horizontal" | "vertical";
    dir?: "ltr" | "rtl";
}
export type PivotListProps = ComponentPropsWithoutRef<"div">;
export interface PivotTriggerProps extends Omit<ComponentPropsWithoutRef<"button">, "value"> {
    value: string;
}
export interface PivotPanelProps extends ComponentPropsWithoutRef<"div"> {
    value: string;
}
export declare const Pivot: import("react").ForwardRefExoticComponent<PivotProps & import("react").RefAttributes<HTMLDivElement>>;
export declare const PivotList: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
export declare const PivotTrigger: import("react").ForwardRefExoticComponent<PivotTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
export declare const PivotPanel: import("react").ForwardRefExoticComponent<PivotPanelProps & import("react").RefAttributes<HTMLDivElement>>;

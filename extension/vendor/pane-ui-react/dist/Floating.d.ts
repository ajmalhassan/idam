import { type ReactNode, type MouseEvent } from "react";
import { type Placement } from "@floating-ui/react";
import { type ButtonProps } from "./Button.js";
type Ownership = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultOpen?: never;
} | {
    open?: never;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
};
type PopupProps = Ownership & {
    label: string;
    placement?: Placement;
    triggerProps?: Omit<ButtonProps, "children" | "aria-haspopup" | "aria-expanded" | "aria-controls">;
};
export interface MenuItem {
    id: string;
    label: string;
    disabled?: boolean;
    destructive?: boolean;
    onSelect: (event: MouseEvent<HTMLButtonElement>) => void;
}
export type MenuProps = PopupProps & {
    items: MenuItem[];
};
export type PopoverProps = PopupProps & {
    title: string;
    children: ReactNode | ((controls: {
        close: () => void;
    }) => ReactNode);
};
export declare const Menu: import("react").ForwardRefExoticComponent<MenuProps & import("react").RefAttributes<HTMLButtonElement>>;
export declare const Popover: import("react").ForwardRefExoticComponent<PopoverProps & import("react").RefAttributes<HTMLButtonElement>>;
export {};

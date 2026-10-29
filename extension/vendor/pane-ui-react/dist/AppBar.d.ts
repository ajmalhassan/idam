import { type ComponentPropsWithoutRef, type ReactNode } from "react";
export type AppBarProps = ComponentPropsWithoutRef<"div">;
export declare const AppBar: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
export interface AppBarActionProps extends ComponentPropsWithoutRef<"button"> {
    icon: ReactNode;
    label: string;
}
export declare const AppBarAction: import("react").ForwardRefExoticComponent<AppBarActionProps & import("react").RefAttributes<HTMLButtonElement>>;
export interface AppBarLinkProps extends Omit<ComponentPropsWithoutRef<"a">, "children"> {
    href: string;
    icon: ReactNode;
    label: string;
}
export declare const AppBarLink: import("react").ForwardRefExoticComponent<AppBarLinkProps & import("react").RefAttributes<HTMLAnchorElement>>;
export interface AppBarOverflowProps extends ComponentPropsWithoutRef<"div"> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    label?: string;
}
/** An inline disclosure of commands. Ordinary Tab order; no popup-menu semantics. */
export declare const AppBarOverflow: import("react").ForwardRefExoticComponent<AppBarOverflowProps & import("react").RefAttributes<HTMLDivElement>>;

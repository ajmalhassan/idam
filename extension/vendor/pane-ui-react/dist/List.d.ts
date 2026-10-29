import { type ComponentPropsWithoutRef, type ReactNode } from "react";
export interface ListProps extends ComponentPropsWithoutRef<"ul"> {
    /** Opt-in entrance using the shared stagger motion, capped at 240ms delay. */
    animate?: boolean;
}
export declare const List: import("react").ForwardRefExoticComponent<ListProps & import("react").RefAttributes<HTMLUListElement>>;
export type ListItemAction = {
    type: "link";
    href: string;
    props?: Omit<ComponentPropsWithoutRef<"a">, "children" | "href">;
} | {
    type: "button";
    props?: Omit<ComponentPropsWithoutRef<"button">, "children">;
};
export interface ListItemProps extends Omit<ComponentPropsWithoutRef<"li">, "children" | "title"> {
    title: ReactNode;
    description?: ReactNode;
    leading?: ReactNode;
    meta?: ReactNode;
    action?: ListItemAction;
    actions?: ReactNode;
}
/** Main action and secondary controls are siblings: never nest interactive elements. */
export declare const ListItem: import("react").ForwardRefExoticComponent<ListItemProps & import("react").RefAttributes<HTMLLIElement>>;
export interface SectionHeaderProps extends ComponentPropsWithoutRef<"h2"> {
    level?: 2 | 3 | 4;
    meta?: ReactNode;
}
export declare const SectionHeader: import("react").ForwardRefExoticComponent<SectionHeaderProps & import("react").RefAttributes<HTMLHeadingElement>>;
export interface EmptyStateProps extends Omit<ComponentPropsWithoutRef<"section">, "title" | "children"> {
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    icon?: ReactNode;
    headingLevel?: 2 | 3 | 4;
}
export declare const EmptyState: import("react").ForwardRefExoticComponent<EmptyStateProps & import("react").RefAttributes<HTMLElement>>;

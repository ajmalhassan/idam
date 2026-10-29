import { type ComponentPropsWithoutRef, type ReactNode } from "react";
export interface TileAppearance {
    label: ReactNode;
    size?: "small" | "wide" | "large" | "hero";
    accent?: "accent" | "subtle" | "strong";
}
export interface TileProps extends ComponentPropsWithoutRef<"div">, TileAppearance {
}
export interface TileLinkProps extends ComponentPropsWithoutRef<"a">, TileAppearance {
}
export declare const Tile: import("react").ForwardRefExoticComponent<TileProps & import("react").RefAttributes<HTMLDivElement>>;
export declare const TileLink: import("react").ForwardRefExoticComponent<TileLinkProps & import("react").RefAttributes<HTMLAnchorElement>>;
export interface RevealTileProps extends Omit<ComponentPropsWithoutRef<"button">, "children">, TileAppearance {
    front: ReactNode;
    back: ReactNode;
    revealed?: boolean;
    defaultRevealed?: boolean;
    onRevealedChange?: (revealed: boolean) => void;
}
/** Faces must contain presentational content, because the owner is a native button. */
export declare const RevealTile: import("react").ForwardRefExoticComponent<RevealTileProps & import("react").RefAttributes<HTMLButtonElement>>;
export interface LiveTileProps extends Omit<ComponentPropsWithoutRef<"div">, "children">, TileAppearance {
    items: readonly ReactNode[];
    accessibleLabel: string;
    intervalMs?: number;
    paused?: boolean;
    defaultPaused?: boolean;
    onPausedChange?: (paused: boolean) => void;
}
/** Provide a stable summary in accessibleLabel. Items are decorative; use plain presentational content. */
export declare const LiveTile: import("react").ForwardRefExoticComponent<LiveTileProps & import("react").RefAttributes<HTMLDivElement>>;

import { type HTMLAttributes, type ReactNode } from "react";
import type { TileAppearance } from "./Tile.js";
export interface TileSequenceItem {
    /** Stable, unique identity, preserved when tiles reorder. */
    id: string;
    content: ReactNode;
    size?: TileAppearance["size"];
}
export interface TileSequenceProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    items: readonly TileSequenceItem[];
    show: boolean;
    /** A tile wave in a shared perspective by default. */
    mode?: "layered" | "group" | "individual";
    /** Used only by individual mode. */
    selectedId?: string;
    duration?: number;
    interval?: number;
    direction?: "forward" | "backward";
    onEntered?: () => void;
    onExited?: () => void;
}
/** Coordinated presence; focus and navigation remain controlled by the owner. */
export declare const TileSequence: import("react").ForwardRefExoticComponent<TileSequenceProps & import("react").RefAttributes<HTMLDivElement>>;

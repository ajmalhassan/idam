import { type ComponentPropsWithoutRef } from "react";
export type TileGridProps = ComponentPropsWithoutRef<"div">;
/** CSS grid accepts any direct layout child; wrappers may use data-size for spanning. */
export declare const TileGrid: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;

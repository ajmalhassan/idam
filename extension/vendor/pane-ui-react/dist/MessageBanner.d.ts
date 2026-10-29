import { type ComponentPropsWithoutRef, type ReactNode } from "react";
export type MessageBannerProps = Omit<ComponentPropsWithoutRef<"div">, "role" | "aria-live" | "aria-atomic"> & {
    tone?: "info" | "success" | "warning" | "error";
    heading?: ReactNode;
    /** Announcements are opt-in, independent of visual tone. */
    announcement?: "off" | "polite" | "assertive";
    actions?: ReactNode;
} & ({
    onDismiss: () => void;
    dismissLabel: string;
} | {
    onDismiss?: never;
    dismissLabel?: never;
});
/** Persistent feedback. The owner manages visibility and any focus restoration on removal. */
export declare const MessageBanner: import("react").ForwardRefExoticComponent<MessageBannerProps & import("react").RefAttributes<HTMLDivElement>>;

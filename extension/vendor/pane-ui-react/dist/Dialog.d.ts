import { type ComponentPropsWithoutRef, type ReactNode, type RefObject } from "react";
export type DialogCloseReason = "escape" | "backdrop" | "native";
export interface DialogProps extends Omit<ComponentPropsWithoutRef<"dialog">, "open" | "title" | "role" | "aria-label" | "aria-labelledby" | "aria-modal"> {
    open: boolean;
    onOpenChange: (open: boolean, reason: DialogCloseReason) => void;
    title: ReactNode;
    description?: string;
    dismissOnEscape?: boolean;
    dismissOnBackdrop?: boolean;
    initialFocusRef?: RefObject<HTMLElement | null>;
    /** Optional surviving focus destination, otherwise native opener restoration applies. */
    finalFocusRef?: RefObject<HTMLElement | null>;
    duration?: number;
}
export type AlertDialogProps = Omit<DialogProps, "dismissOnBackdrop" | "description"> & {
    description: string;
};
export declare const Dialog: import("react").ForwardRefExoticComponent<DialogProps & import("react").RefAttributes<HTMLDialogElement>>;
export declare const AlertDialog: import("react").ForwardRefExoticComponent<Omit<DialogProps, "description" | "dismissOnBackdrop"> & {
    description: string;
} & import("react").RefAttributes<HTMLDialogElement>>;

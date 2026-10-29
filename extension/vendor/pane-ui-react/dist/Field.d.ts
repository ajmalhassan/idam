import { type ComponentPropsWithoutRef, type ReactNode } from "react";
export interface FieldProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    label: ReactNode;
    description?: ReactNode;
    error?: ReactNode;
    /** Identifies the single native control inside this field. */
    controlId?: string;
    required?: boolean;
    disabled?: boolean;
    children: ReactNode;
}
export type LabelProps = ComponentPropsWithoutRef<"label">;
export declare const Label: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>, "ref"> & import("react").RefAttributes<HTMLLabelElement>>;
export type FieldDescriptionProps = ComponentPropsWithoutRef<"p">;
export declare const FieldDescription: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>, "ref"> & import("react").RefAttributes<HTMLParagraphElement>>;
export type FieldErrorProps = ComponentPropsWithoutRef<"p">;
export declare const FieldError: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>, "ref"> & import("react").RefAttributes<HTMLParagraphElement>>;
export declare const Field: import("react").ForwardRefExoticComponent<FieldProps & import("react").RefAttributes<HTMLDivElement>>;
export interface TextFieldProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
    type?: "text" | "email" | "password" | "search" | "tel" | "url" | "number";
}
export declare const TextField: import("react").ForwardRefExoticComponent<TextFieldProps & import("react").RefAttributes<HTMLInputElement>>;
export type TextAreaProps = ComponentPropsWithoutRef<"textarea">;
export declare const TextArea: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "ref"> & import("react").RefAttributes<HTMLTextAreaElement>>;
export type SelectProps = ComponentPropsWithoutRef<"select">;
/** Native options and optgroups; the browser owns the picker and keyboard model. */
export declare const Select: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, "ref"> & import("react").RefAttributes<HTMLSelectElement>>;
export type SliderProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "children" | "checked" | "defaultChecked">;
/** Native range input; bounds, steps, dragging and reset stay with the browser. */
export declare const Slider: import("react").ForwardRefExoticComponent<SliderProps & import("react").RefAttributes<HTMLInputElement>>;

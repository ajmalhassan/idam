import { type ComponentPropsWithoutRef, type ReactNode } from "react";
export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "type" | "children" | "size"> {
    label: ReactNode;
    description?: ReactNode;
    error?: ReactNode;
}
export type SwitchProps = CheckboxProps;
export declare const Checkbox: import("react").ForwardRefExoticComponent<CheckboxProps & import("react").RefAttributes<HTMLInputElement>>;
export declare const Switch: import("react").ForwardRefExoticComponent<CheckboxProps & import("react").RefAttributes<HTMLInputElement>>;
export interface RadioOption {
    value: string;
    label: ReactNode;
    description?: ReactNode;
    disabled?: boolean;
}
export interface RadioGroupProps extends Omit<ComponentPropsWithoutRef<"fieldset">, "children" | "name" | "defaultValue"> {
    label: ReactNode;
    name: string;
    options: readonly RadioOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    description?: ReactNode;
    error?: ReactNode;
    required?: boolean;
}
export declare const RadioGroup: import("react").ForwardRefExoticComponent<RadioGroupProps & import("react").RefAttributes<HTMLFieldSetElement>>;

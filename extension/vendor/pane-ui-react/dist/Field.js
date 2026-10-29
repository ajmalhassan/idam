"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, forwardRef, useContext, useId, } from "react";
const FieldContext = createContext(null);
export const Label = forwardRef(function Label({ className = "", ...props }, ref) {
    return _jsx("label", { ...props, ref: ref, className: `wp-label ${className}` });
});
export const FieldDescription = forwardRef(function FieldDescription({ className = "", ...props }, ref) {
    return (_jsx("p", { ...props, ref: ref, className: `wp-field-description ${className}` }));
});
export const FieldError = forwardRef(function FieldError({ className = "", ...props }, ref) {
    return _jsx("p", { ...props, ref: ref, className: `wp-field-error ${className}` });
});
export const Field = forwardRef(function Field({ label, description, error, controlId, required, disabled, children, className = "", ...props }, ref) {
    const generated = useId();
    const id = controlId ?? `${generated}-control`;
    const hasDescription = description !== undefined &&
        description !== null &&
        description !== false &&
        description !== "";
    const invalid = error !== undefined && error !== null && error !== false && error !== "";
    const descriptionId = hasDescription ? `${id}-description` : undefined;
    const errorId = invalid ? `${id}-error` : undefined;
    return (_jsx(FieldContext.Provider, { value: {
            controlId: id,
            descriptionId,
            errorId,
            invalid,
            required,
            disabled,
        }, children: _jsxs("div", { ...props, ref: ref, className: `wp-field ${className}`, "data-invalid": invalid || undefined, "data-disabled": disabled || undefined, children: [_jsxs(Label, { htmlFor: id, children: [label, required && _jsx("span", { "aria-hidden": "true", children: " *" })] }), children, hasDescription && (_jsx(FieldDescription, { id: descriptionId, children: description })), invalid && _jsx(FieldError, { id: errorId, children: error })] }) }));
});
function useFieldAttributes(props) {
    const field = useContext(FieldContext);
    const describedBy = [
        props["aria-describedby"],
        field?.descriptionId,
        field?.errorId,
    ]
        .filter(Boolean)
        .join(" ")
        .split(/\s+/)
        .filter(Boolean);
    return {
        id: field?.controlId ?? props.id,
        required: field?.required ?? props.required,
        disabled: field?.disabled || props.disabled,
        "aria-invalid": field?.invalid ? true : props["aria-invalid"],
        "aria-describedby": describedBy.length
            ? [...new Set(describedBy)].join(" ")
            : undefined,
    };
}
export const TextField = forwardRef(function TextField({ className = "", type = "text", ...props }, ref) {
    const field = useFieldAttributes(props);
    return (_jsx("input", { ...props, ...field, type: type, ref: ref, className: `wp-text-field ${className}` }));
});
export const TextArea = forwardRef(function TextArea({ className = "", rows = 4, ...props }, ref) {
    const field = useFieldAttributes(props);
    return (_jsx("textarea", { ...props, ...field, rows: rows, ref: ref, className: `wp-text-field wp-text-area ${className}` }));
});
/** Native options and optgroups; the browser owns the picker and keyboard model. */
export const Select = forwardRef(function Select({ className = "", ...props }, ref) {
    const field = useFieldAttributes(props);
    return (_jsx("select", { ...props, ...field, ref: ref, className: `wp-text-field wp-select ${className}` }));
});
/** Native range input; bounds, steps, dragging and reset stay with the browser. */
export const Slider = forwardRef(function Slider({ className = "", ...props }, ref) {
    const field = useFieldAttributes(props);
    return (_jsx("input", { ...props, ...field, type: "range", ref: ref, className: `wp-slider ${className}` }));
});

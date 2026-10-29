"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId, } from "react";
import { FieldDescription, FieldError } from "./Field.js";
const present = (value) => value !== undefined && value !== null && value !== false && value !== "";
const descriptions = (...values) => [
    ...new Set(values.filter(Boolean).join(" ").split(/\s+/).filter(Boolean)),
].join(" ") || undefined;
const SelectionControl = forwardRef(function SelectionControl({ kind, label, description, error, id, className = "", ...props }, ref) {
    const generated = useId();
    const controlId = id ?? `${generated}-selection`;
    const descriptionId = present(description)
        ? `${controlId}-description`
        : undefined;
    const errorId = present(error) ? `${controlId}-error` : undefined;
    return (_jsxs("div", { className: "wp-selection", hidden: props.hidden, children: [_jsxs("label", { className: "wp-selection-label", htmlFor: controlId, children: [_jsxs("span", { className: `wp-selection-control wp-selection-${kind}`, children: [_jsx("input", { ...props, ref: ref, id: controlId, type: "checkbox", role: kind === "switch" ? "switch" : props.role, className: `wp-selection-input ${className}`, "aria-invalid": errorId ? true : props["aria-invalid"], "aria-describedby": descriptions(props["aria-describedby"], descriptionId, errorId) }), _jsx("span", { className: "wp-selection-visual", "aria-hidden": "true", children: kind === "checkbox" && (_jsx("svg", { className: "wp-checkbox-mark", viewBox: "0 0 24 24", focusable: "false", children: _jsx("path", { d: "M6 12 10 16 18 8" }) })) })] }), _jsxs("span", { children: [label, props.required && _jsx("span", { "aria-hidden": "true", children: " *" })] })] }), descriptionId && (_jsx(FieldDescription, { id: descriptionId, children: description })), errorId && _jsx(FieldError, { id: errorId, children: error })] }));
});
export const Checkbox = forwardRef(function Checkbox(props, ref) {
    return _jsx(SelectionControl, { ...props, kind: "checkbox", ref: ref });
});
export const Switch = forwardRef(function Switch(props, ref) {
    return _jsx(SelectionControl, { ...props, kind: "switch", ref: ref });
});
export const RadioGroup = forwardRef(function RadioGroup({ label, name, options, value, defaultValue, onValueChange, description, error, required, className = "", onChange, ...props }, ref) {
    const id = useId();
    const descriptionId = present(description)
        ? `${id}-description`
        : undefined;
    const errorId = present(error) ? `${id}-error` : undefined;
    return (_jsxs("fieldset", { ...props, ref: ref, className: `wp-radio-group ${className}`, "aria-describedby": descriptions(props["aria-describedby"], descriptionId, errorId), "aria-invalid": errorId ? true : props["aria-invalid"], onChange: (event) => {
            onChange?.(event);
            if (event.defaultPrevented)
                return;
            const target = event.target;
            if (target instanceof HTMLInputElement &&
                target.type === "radio" &&
                target.name === name &&
                target.checked)
                onValueChange?.(target.value);
        }, children: [_jsxs("legend", { className: "wp-label", children: [label, required && _jsx("span", { "aria-hidden": "true", children: " *" })] }), descriptionId && (_jsx(FieldDescription, { id: descriptionId, children: description })), _jsx("div", { className: "wp-radio-options", children: options.map((option, index) => {
                    const optionId = `${id}-option-${index}`;
                    const hintId = present(option.description)
                        ? `${optionId}-description`
                        : undefined;
                    return (_jsxs("div", { className: "wp-selection", children: [_jsxs("label", { htmlFor: optionId, className: "wp-selection-label", children: [_jsxs("span", { className: "wp-selection-control wp-selection-radio", children: [_jsx("input", { id: optionId, type: "radio", name: name, value: option.value, form: props.form, required: required, disabled: props.disabled || option.disabled, className: "wp-selection-input", checked: value === undefined ? undefined : value === option.value, defaultChecked: value === undefined
                                                    ? defaultValue === option.value
                                                    : undefined, onChange: () => { }, "aria-describedby": descriptions(hintId, errorId) }), _jsx("span", { className: "wp-selection-visual", "aria-hidden": "true" })] }), _jsx("span", { children: option.label })] }), hintId && (_jsx(FieldDescription, { id: hintId, children: option.description }))] }, option.value));
                }) }), errorId && _jsx(FieldError, { id: errorId, children: error })] }));
});

"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
/** CSS grid accepts any direct layout child; wrappers may use data-size for spanning. */
export const TileGrid = forwardRef(function TileGrid({ className = "", ...props }, ref) {
    return _jsx("div", { ...props, ref: ref, className: `wp-tile-grid ${className}` });
});

"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const INK = "#3F220F";

export const NameTagInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, onFocus, onBlur, ...props }, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative mt-2">
      <div
        className={cn(
          "absolute -inset-1 rounded-md border-[2.5px] border-dashed opacity-0 transition-opacity duration-200 pointer-events-none filter-hand-drawn",
          focused && "opacity-100"
        )}
        style={{ borderColor: "#FCD34D", backgroundColor: "rgba(252,211,77,0.15)" }}
        aria-hidden
      />
      <div
        className="relative border-[2.5px] px-4 py-3 filter-hand-drawn shadow-sm"
        style={{
          borderColor: `${INK}88`,
          backgroundColor: "rgba(254,243,199,0.65)",
          transform: "rotate(-0.6deg)",
        }}
      >
        <div
          className="absolute -top-2 left-4 h-4 w-10 border-2 opacity-80 -rotate-2"
          style={{ borderColor: INK, backgroundColor: "rgba(252,211,77,0.75)" }}
          aria-hidden
        />
        <input
          ref={ref}
          className={cn(
            "w-full bg-transparent font-display text-lg font-bold outline-none min-h-[44px] placeholder:opacity-50 sketchy-focus",
            className
          )}
          style={{ color: INK }}
          placeholder="Write your name…"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </div>
    </div>
  );
});
NameTagInput.displayName = "NameTagInput";

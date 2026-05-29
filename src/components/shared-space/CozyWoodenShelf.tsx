"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const INK = "#2F1A0C";

export function CozyWoodenShelf({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto w-full max-w-3xl px-2 sm:px-6 pb-6", className)}>
      {/* Items + labels (labels sit above; only icons overlap shelf) */}
      <div className="relative z-20 mb-[-4px] flex min-h-[148px] items-end justify-center gap-1 sm:gap-3">
        {children}
      </div>

      {/* Flat hand-drawn shelf plank */}
      <div className="relative z-10">
        <div
          className="relative h-7 sm:h-8 w-full filter-hand-drawn shadow-[0_6px_0_rgba(47,26,12,0.25)]"
          style={{
            backgroundColor: "#78350f",
            border: `3px solid ${INK}`,
            boxShadow: `inset 0 1px 0 rgba(255,248,240,0.15), 0 8px 16px rgba(47,26,12,0.22)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, transparent, transparent 3px, rgba(47,26,12,0.15) 3px, rgba(47,26,12,0.15) 4px)",
            }}
          />
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(0,0,0,0.06) 24px, rgba(0,0,0,0.06) 26px)",
            }}
          />
        </div>

        <div className="absolute -bottom-2 left-[6%] right-[6%] h-5 rounded-[50%] bg-black/20 blur-md pointer-events-none" />
      </div>

      {/* Left bracket */}
      <svg
        className="absolute left-[8%] sm:left-[12%] top-[calc(100%-1.75rem)] h-14 w-9 filter-hand-drawn pointer-events-none"
        viewBox="0 0 40 64"
        fill="none"
        aria-hidden
      >
        <path
          d="M34 6 L34 52 L8 52 L8 44 L26 44 L26 6 Z"
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path d="M8 44 L18 34" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {/* Right bracket */}
      <svg
        className="absolute right-[8%] sm:right-[12%] top-[calc(100%-1.75rem)] h-14 w-9 filter-hand-drawn pointer-events-none scale-x-[-1]"
        viewBox="0 0 40 64"
        fill="none"
        aria-hidden
      >
        <path
          d="M34 6 L34 52 L8 52 L8 44 L26 44 L26 6 Z"
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path d="M8 44 L18 34" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

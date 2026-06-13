"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const INK = "#3F220F";

export function SettingsClipboard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-[2.5px] p-6 sm:p-8 filter-hand-drawn shadow-lg",
        className
      )}
      style={{
        borderColor: INK,
        backgroundColor: "#c9956a",
        backgroundImage:
          "radial-gradient(circle at 20% 25%, rgba(139,90,43,0.12) 0%, transparent 45%), radial-gradient(circle at 80% 75%, rgba(63,34,15,0.08) 0%, transparent 40%), repeating-linear-gradient(45deg, rgba(63,34,15,0.03) 0px, rgba(63,34,15,0.03) 2px, transparent 2px, transparent 8px)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-3 rounded-xl border border-dashed opacity-35"
        style={{ borderColor: INK }}
      />

      {/* Clipboard clip */}
      <div
        className="absolute left-1/2 top-0 z-20 h-8 w-24 -translate-x-1/2 rounded-b-lg border-x-[2.5px] border-b-[2.5px] filter-hand-drawn"
        style={{
          borderColor: INK,
          backgroundColor: "#E8DCC8",
          boxShadow: "0 4px 8px rgba(63,34,15,0.2)",
        }}
        aria-hidden
      />

      <div className="relative z-10 space-y-5 pt-6">{children}</div>
    </div>
  );
}

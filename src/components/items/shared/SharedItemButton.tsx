"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SharedItemButton({
  children,
  label,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "group relative flex flex-col items-center gap-1.5 rounded-2xl border border-white/60 bg-white/70 p-3 shadow-md backdrop-blur-sm transition-all min-h-[88px] min-w-[88px]",
        "hover:-translate-y-1 hover:border-amber-300/80 hover:bg-white hover:shadow-lg active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
        disabled && "cursor-not-allowed opacity-40 hover:translate-y-0 hover:shadow-md",
        className
      )}
    >
      <span className="transition-transform group-hover:scale-105">{children}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-stone-600 group-hover:text-amber-900">
        Tap to open
      </span>
    </button>
  );
}

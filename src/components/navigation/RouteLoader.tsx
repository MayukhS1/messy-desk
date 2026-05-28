"use client";

import { cn } from "@/lib/utils";

export function RouteLoader({
  message = "Opening…",
  overlay = false,
  className,
}: {
  message?: string;
  overlay?: boolean;
  className?: string;
}) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative h-14 w-14">
        <div
          className="absolute inset-0 rounded-full border-2 border-amber-800/20 border-t-accent-sunflower animate-spin"
          aria-hidden
        />
        <svg
          className="absolute inset-2 filter-hand-drawn"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden
        >
          <rect
            x="8"
            y="14"
            width="24"
            height="4"
            rx="1"
            fill="#92400e"
            opacity="0.7"
          />
          <rect
            x="10"
            y="8"
            width="8"
            height="6"
            rx="1"
            fill="#fef3c7"
            stroke="#78350f"
            strokeWidth="0.5"
          />
        </svg>
      </div>
      <p className="font-display text-sm text-foreground">{message}</p>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 backdrop-blur-[2px]">
        <div className="rounded-xl border-2 border-amber-800/30 bg-surface/95 px-8 py-6 shadow-lg filter-hand-drawn">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center py-16">
      {content}
    </div>
  );
}

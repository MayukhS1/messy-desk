"use client";

import { cn } from "@/lib/utils";

function SketchHeart({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-7 w-7 shrink-0", className)}
      aria-hidden
    >
      <path
        d="M12 20 C12 20 4 14 4 8.5 C4 5.5 6.5 3.5 9 3.5 C10.5 3.5 12 4.5 12 4.5 C12 4.5 13.5 3.5 15 3.5 C17.5 3.5 20 5.5 20 8.5 C20 14 12 20 12 20"
        fill={filled ? "#FCD34D" : "none"}
        stroke="#78350F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(filled && "opacity-90")}
      />
      {filled && (
        <path
          d="M8 9 Q10 7 12 10 Q14 7 16 9"
          stroke="#FDBA74"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
      )}
    </svg>
  );
}

export function HuntProgress({ found, total }: { found: number; total: number }) {
  const slots = Math.max(total, 1);

  return (
    <div className="space-y-2" role="group" aria-label={`Hunt progress: ${found} of ${total} found`}>
      <div className="flex justify-between text-xs text-muted font-sans">
        <span className="font-display">Hunt progress</span>
        <span>
          {found}/{total} found
        </span>
      </div>

      <div className="relative flex items-center justify-center gap-3 py-2 px-1">
        <div
          className="pointer-events-none absolute left-6 right-6 top-1/2 border-t-2 border-dashed border-amber-800/30"
          aria-hidden
        />

        {Array.from({ length: slots }).map((_, index) => (
          <SketchHeart key={index} filled={index < found} />
        ))}
      </div>
    </div>
  );
}

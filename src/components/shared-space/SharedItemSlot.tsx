"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const INK = "#2F1A0C";

/** Per-slot tilt */
const SLOT_LAYOUT: Record<string, { rotate: number; offsetY: number }> = {
  slot_journal: { rotate: 2, offsetY: 2 },
  slot_record_player: { rotate: -1.2, offsetY: 0 },
  slot_flora_vase: { rotate: 1.5, offsetY: 1 },
  slot_haptic_frame: { rotate: -2.5, offsetY: 3 },
};

export function SharedItemSlot({
  slotId,
  label,
  tooltip,
  children,
}: {
  slotId: string;
  label: string;
  tooltip: string;
  children: ReactNode;
}) {
  const layout = SLOT_LAYOUT[slotId] ?? { rotate: 0, offsetY: 0 };

  return (
    <div
      className="group/slot relative flex w-[4.75rem] shrink-0 flex-col items-center sm:w-[5.75rem]"
      style={{
        transform: `rotate(${layout.rotate}deg) translateY(${layout.offsetY}px)`,
      }}
    >
      {/* Label on cream wall — always above the shelf */}
      <span
        className="mb-1.5 w-full rounded-md px-1 py-0.5 text-center text-[11px] font-bold leading-tight font-display shadow-sm sm:text-xs sm:leading-snug"
        style={{
          color: INK,
          backgroundColor: "rgba(253, 251, 247, 0.95)",
          border: `1.5px solid ${INK}22`,
        }}
      >
        {label}
      </span>

      {/* Item seated on shelf lip */}
      <div className="relative z-20">
        {/* Hover tooltip — CSS-only; hidden on touch to avoid sticky tap-hover */}
        <div
          role="tooltip"
          className={cn(
            "pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2",
            "opacity-0 transition-opacity duration-150",
            "[@media(hover:hover)]:group-hover/slot:opacity-100"
          )}
        >
          <div
            className="relative whitespace-nowrap border-2 bg-yellow-100 px-2.5 py-1.5 shadow-md filter-hand-drawn sm:px-3 sm:py-2"
            style={{ borderColor: INK, transform: "rotate(-2deg)" }}
          >
            <div
              className="absolute -top-2 left-1/2 h-3 w-10 -translate-x-1/2 border bg-stone-300/80 -rotate-1"
              style={{ borderColor: `${INK}66` }}
              aria-hidden
            />
            <span
              className="text-xs font-bold font-display sm:text-sm"
              style={{ color: INK }}
            >
              {tooltip}
            </span>
          </div>
        </div>

        <div
          className="absolute -bottom-0.5 left-1/2 h-2 w-[80%] -translate-x-1/2 translate-y-full rounded-[50%] bg-[#2F1A0C]/20 blur-[2px] pointer-events-none"
          aria-hidden
        />
        <div className="relative drop-shadow-[0_4px_6px_rgba(47,26,12,0.35)]">
          {children}
        </div>
      </div>
    </div>
  );
}

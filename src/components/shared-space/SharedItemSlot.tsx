"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SharedItemSlot({
  slotId,
  label,
  children,
}: {
  slotId: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0.5 shrink-0 z-10",
        slotId === "slot_journal" && "order-1",
        slotId === "slot_record_player" && "order-2",
        slotId === "slot_flora_vase" && "order-3",
        slotId === "slot_haptic_frame" && "order-4"
      )}
    >
      {children}
      <span className="text-[9px] font-display text-amber-900/50 pointer-events-none">
        {label}
      </span>
    </div>
  );
}

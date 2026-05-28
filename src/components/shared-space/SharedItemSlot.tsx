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
        "flex flex-col items-center gap-1 shrink-0",
        slotId === "slot_journal" && "order-1",
        slotId === "slot_record_player" && "order-2",
        slotId === "slot_flora_vase" && "order-3",
        slotId === "slot_haptic_frame" && "order-4"
      )}
    >
      {children}
      <span className="text-[10px] font-medium uppercase tracking-wide text-stone-500/90 pointer-events-none">
        {label}
      </span>
    </div>
  );
}

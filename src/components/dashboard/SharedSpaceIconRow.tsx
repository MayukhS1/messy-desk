"use client";

import { cn } from "@/lib/utils";
import type { SharedItemType } from "@/types/database";
import { SharedItemVisual } from "@/components/items/shared/SharedItemVisual";
import { SHARED_SLOTS } from "@/lib/constants";

export function SharedSpaceIconRow({
  floraStage = 1,
  className,
}: {
  floraStage?: number;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap justify-center gap-4 sm:gap-5 py-2", className)}>
      {SHARED_SLOTS.map(({ itemType, label }) => (
        <li key={itemType} className="flex flex-col items-center gap-1.5 min-w-[56px]">
          <SharedItemVisual
            type={itemType as SharedItemType}
            size={36}
            floraStage={itemType === "flora_vase" ? floraStage : undefined}
          />
          <span className="text-[10px] font-display text-muted text-center leading-tight">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}

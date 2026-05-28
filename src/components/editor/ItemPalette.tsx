"use client";

import { HuntItemType } from "@/types/database";
import { ItemVisual } from "@/components/items/hunt/ItemVisual";
import { HUNT_ITEM_META, DESK_ITEM_BUDGET } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ItemPalette({
  itemCount,
  onAddItem,
}: {
  itemCount: number;
  onAddItem: (type: HuntItemType) => void;
}) {
  const remaining = DESK_ITEM_BUDGET - itemCount;

  return (
    <div className="space-y-3 rounded-xl border-2 border-amber-800/25 bg-yellow-50/60 p-4 filter-hand-drawn lg:border-0 lg:bg-transparent lg:p-0">
      <div>
        <h3 className="text-sm font-display font-semibold text-foreground">
          Step 1 · Add items
        </h3>
        <p className="text-xs text-muted mt-1">
          Tap to place on desk, then drag to arrange
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{remaining} slots left</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(HUNT_ITEM_META) as HuntItemType[]).map((type) => {
          const meta = HUNT_ITEM_META[type];
          const disabled = remaining <= 0;
          return (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => onAddItem(type)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border-2 border-amber-800/25 p-3 min-h-[80px] filter-hand-drawn sketchy-focus transition-transform",
                disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-surface/80 hover:border-accent-sunflower/60 hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer"
              )}
            >
              <ItemVisual type={type} size={36} />
              <span className="text-xs font-medium text-muted">{meta.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

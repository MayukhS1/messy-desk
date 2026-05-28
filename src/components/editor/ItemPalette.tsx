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
    <div className="space-y-3 rounded-xl border border-stone-200 bg-white/80 p-4 lg:border-0 lg:bg-transparent lg:p-0">
      <div>
        <h3 className="text-sm font-semibold text-stone-800">
          Step 1 · Add items
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Tap to place on desk, then drag to arrange
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-500">{remaining} slots left</span>
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
                "flex flex-col items-center gap-1.5 rounded-xl border border-stone-200 p-3 transition-all min-h-[80px]",
                disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:border-amber-400 hover:bg-amber-50 hover:shadow-sm active:scale-[0.98]"
              )}
            >
              <ItemVisual type={type} size={36} />
              <span className="text-xs font-medium text-stone-600">{meta.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

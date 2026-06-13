"use client";

import { HuntItemType } from "@/types/database";
import { ItemVisual } from "@/components/items/hunt/ItemVisual";
import { HUNT_ITEM_META, DESK_ITEM_BUDGET } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const INK = "#3F220F";

function ToyboxGrip() {
  return (
    <div className="flex shrink-0 flex-col gap-[3px] py-1" aria-hidden>
      {[0, 1].map((row) => (
        <div key={row} className="flex gap-[3px]">
          {[0, 1, 2].map((col) => (
            <div
              key={col}
              className="h-[5px] w-[5px] rounded-full"
              style={{ backgroundColor: `${INK}55` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ItemPalette({
  itemCount,
  onAddItem,
}: {
  itemCount: number;
  onAddItem: (type: HuntItemType) => void;
}) {
  const remaining = DESK_ITEM_BUDGET - itemCount;

  return (
    <div className="space-y-2">
      <div className="hidden lg:block">
        <h3 className="text-xs font-display font-bold uppercase tracking-wide" style={{ color: INK }}>
          Toybox
        </h3>
        <p className="text-[11px] mt-0.5" style={{ color: `${INK}88` }}>
          Tap to place · drag on desk
        </p>
        <p className="text-[10px] mt-1 font-bold" style={{ color: `${INK}66` }}>
          {remaining} slots left
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {(Object.keys(HUNT_ITEM_META) as HuntItemType[]).map((type) => {
          const meta = HUNT_ITEM_META[type];
          const disabled = remaining <= 0;

          return (
            <motion.button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => onAddItem(type)}
              className={cn(
                "flex w-full items-center gap-1.5 rounded-lg border-2 px-1.5 py-2 min-h-[52px] filter-hand-drawn sketchy-focus text-left",
                disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-grab active:cursor-grabbing bg-[#FDFBF7]/90 hover:bg-yellow-50 hover:border-[#DD954B]/60"
              )}
              style={{ borderColor: disabled ? `${INK}22` : `${INK}44` }}
              whileHover={disabled ? undefined : { scale: 1.03, rotate: -1 }}
              whileTap={disabled ? undefined : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <ToyboxGrip />
              <ItemVisual type={type} size={32} className="shrink-0" />
              <span
                className="text-[11px] font-bold font-display leading-tight"
                style={{ color: INK }}
              >
                {meta.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

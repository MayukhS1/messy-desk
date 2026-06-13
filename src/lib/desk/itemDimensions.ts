import type { HuntItemType } from "@/types/database";

/** Logical footprint of each item on the 1920×1080 desk plane (editor coordinates). */
export const DESK_ITEM_LOGICAL_BOUNDS: Record<
  HuntItemType,
  { width: number; height: number }
> = {
  laptop: { width: 280, height: 190 },
  envelope: { width: 160, height: 110 },
  box: { width: 180, height: 180 },
  book: { width: 150, height: 200 },
  mug: { width: 120, height: 120 },
  sticky_note: { width: 150, height: 150 },
};

export function getItemLogicalBounds(itemType: HuntItemType) {
  return DESK_ITEM_LOGICAL_BOUNDS[itemType] ?? { width: 150, height: 150 };
}

export function getItemLogicalMaxDimension(itemType: HuntItemType) {
  const { width, height } = getItemLogicalBounds(itemType);
  return Math.max(width, height);
}

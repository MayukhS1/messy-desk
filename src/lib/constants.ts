import type { HuntItemType } from "@/types/database";

export const DESK_MAX_CAPACITY = 12;
export const DESK_ITEM_BUDGET = 8;
/** Number of hunt targets required per published desk. */
export const HUNT_TARGET_COUNT = 3;
export const HUNT_TARGET_MIN = HUNT_TARGET_COUNT;
export const HUNT_TARGET_MAX = HUNT_TARGET_COUNT;

export const HUNT_ITEM_META: Record<
  HuntItemType,
  { label: string; emoji: string; defaultUnlock: "pin" | "combination" | "sequence_clicks" | "drag_reveal" | "none" }
> = {
  laptop: { label: "Laptop", emoji: "💻", defaultUnlock: "pin" },
  envelope: { label: "Envelope", emoji: "✉️", defaultUnlock: "none" },
  box: { label: "Locked Box", emoji: "📦", defaultUnlock: "combination" },
  book: { label: "Book", emoji: "📖", defaultUnlock: "sequence_clicks" },
  mug: { label: "Coffee Mug", emoji: "☕", defaultUnlock: "drag_reveal" },
  sticky_note: { label: "Sticky Note", emoji: "📝", defaultUnlock: "none" },
};

export const FLORA_STAGES = [
  { stage: 0, name: "Empty vase", emoji: "🫙" },
  { stage: 1, name: "Seedling", emoji: "🌱" },
  { stage: 2, name: "Sprout", emoji: "🌿" },
  { stage: 3, name: "Budding", emoji: "🌸" },
  { stage: 4, name: "Blooming", emoji: "💐" },
] as const;

export const SHARED_SLOTS = [
  {
    slotId: "slot_journal",
    itemType: "journal" as const,
    label: "Journal",
    tooltip: "Read our journal",
    rotate: 2,
    scale: 1.06,
    offsetY: 2,
  },
  {
    slotId: "slot_record_player",
    itemType: "record_player" as const,
    label: "Record Player",
    tooltip: "Put a record on",
    rotate: -1.2,
    scale: 0.96,
    offsetY: 0,
  },
  {
    slotId: "slot_flora_vase",
    itemType: "flora_vase" as const,
    label: "Flora Vase",
    tooltip: "Watch it grow",
    rotate: 1.5,
    scale: 1.02,
    offsetY: 3,
  },
  {
    slotId: "slot_haptic_frame",
    itemType: "haptic_photo_frame" as const,
    label: "Photo Frame",
    tooltip: "Open our photo frame",
    rotate: -2.5,
    scale: 1.04,
    offsetY: 1,
  },
];

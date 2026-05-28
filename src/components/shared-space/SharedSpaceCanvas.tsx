"use client";

import { SharedSpaceBackground } from "./SharedSpaceBackground";
import { SharedItemSlot } from "./SharedItemSlot";
import { JournalItem } from "@/components/items/shared/JournalItem";
import { RecordPlayerItem } from "@/components/items/shared/RecordPlayerItem";
import { FloraVaseItem } from "@/components/items/shared/FloraVaseItem";
import { HapticPhotoFrameItem } from "@/components/items/shared/HapticPhotoFrameItem";
import { useSharedSpace } from "@/lib/hooks/useSharedSpace";
import { SHARED_SLOTS } from "@/lib/constants";

export function SharedSpaceCanvas() {
  const { data, isLoading } = useSharedSpace();

  if (isLoading) {
    return (
      <div className="relative h-48 sm:h-56 rounded-t-2xl bg-amber-50/50 animate-pulse" />
    );
  }

  const coupleId = data?.coupleId;
  const stats = data?.stats;
  const items = data?.items ?? [];

  const getItem = (slotId: string) =>
    items.find((i) => i.slot_id === slotId);

  return (
    <div className="relative h-48 sm:h-56 border-b border-stone-200/80">
      <SharedSpaceBackground />

      <p className="absolute top-3 left-1/2 -translate-x-1/2 text-[11px] text-stone-500/90 text-center px-4 max-w-md z-10 pointer-events-none">
        Tap any item to read, listen, or edit — right from your nook
      </p>

      <div className="absolute inset-x-0 bottom-6 sm:bottom-8 flex flex-wrap items-end justify-center gap-3 sm:gap-6 px-3 sm:px-6">
        {SHARED_SLOTS.map(({ slotId, itemType, label }) => {
          const item = getItem(slotId);
          const props = { coupleId, item, stats };

          let content;
          switch (itemType) {
            case "journal":
              content = <JournalItem {...props} />;
              break;
            case "record_player":
              content = <RecordPlayerItem {...props} />;
              break;
            case "flora_vase":
              content = <FloraVaseItem {...props} />;
              break;
            case "haptic_photo_frame":
              content = <HapticPhotoFrameItem {...props} />;
              break;
            default:
              return null;
          }

          return (
            <SharedItemSlot key={slotId} slotId={slotId} label={label}>
              {content}
            </SharedItemSlot>
          );
        })}
      </div>
    </div>
  );
}

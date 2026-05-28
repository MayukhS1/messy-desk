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
      <div className="relative h-52 sm:h-60 rounded-t-xl bg-amber-50/50 animate-pulse filter-hand-drawn" />
    );
  }

  const coupleId = data?.coupleId;
  const stats = data?.stats;
  const items = data?.items ?? [];

  const getItem = (slotId: string) =>
    items.find((i) => i.slot_id === slotId);

  return (
    <div className="relative h-52 sm:h-60 border-b-2 border-amber-800/15">
      <SharedSpaceBackground />

      <p className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] text-amber-900/40 text-center px-4 max-w-md z-10 pointer-events-none font-display">
        Tap any item to read, listen, or explore
      </p>

      {/* Items sitting on shelf */}
      <div className="absolute inset-x-0 bottom-[22%] sm:bottom-[20%] flex flex-wrap items-end justify-center gap-2 sm:gap-5 px-3 sm:px-6">
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

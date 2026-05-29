"use client";

import { CozyWoodenShelf } from "./CozyWoodenShelf";
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
      <div className="relative h-72 animate-pulse rounded-t-xl border-b-2 border-amber-800/40 bg-amber-100/60 sm:h-80" />
    );
  }

  const coupleId = data?.coupleId;
  const stats = data?.stats;
  const items = data?.items ?? [];

  const getItem = (slotId: string) =>
    items.find((i) => i.slot_id === slotId);

  return (
    <div className="relative min-h-[19rem] overflow-visible border-b-2 border-amber-800/40 bg-gradient-to-b from-amber-50/80 to-orange-50/50 sm:min-h-[21rem]">
      <SharedSpaceBackground />

      <p className="absolute top-10 left-1/2 z-10 -translate-x-1/2 px-4 text-center text-sm font-bold font-display text-[#2F1A0C] max-w-md pointer-events-none">
        Tap shelf items to explore your nook
      </p>

      <div className="relative z-10 flex items-end justify-center pt-12 pb-3 overflow-visible">
        <CozyWoodenShelf>
          {SHARED_SLOTS.map(({ slotId, itemType, label, tooltip }) => {
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
              <SharedItemSlot
                key={slotId}
                slotId={slotId}
                label={label}
                tooltip={tooltip}
              >
                {content}
              </SharedItemSlot>
            );
          })}
        </CozyWoodenShelf>
      </div>
    </div>
  );
}

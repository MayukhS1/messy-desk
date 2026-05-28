"use client";

import { useState } from "react";
import { InteractionModal } from "@/components/ui/InteractionModal";
import { triggerHaptic, HAPTIC_PATTERNS } from "@/lib/haptics/patterns";
import { SharedItemVisual } from "./SharedItemVisual";
import { SharedItemButton } from "./SharedItemButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUpdateSharedItem } from "@/lib/hooks/useSharedSpace";
import type { HotspotConfig, SharedSpaceItem, RelationshipStats } from "@/types/database";
import { cn } from "@/lib/utils";

export function HapticPhotoFrameItem({
  item,
}: {
  coupleId?: string | null;
  item?: SharedSpaceItem;
  stats?: RelationshipStats | null;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [pulseId, setPulseId] = useState<string | null>(null);
  const updateItem = useUpdateSharedItem();

  const config = item?.config ?? {};
  const displayUrl = editing ? photoUrl : (config.photoUrl as string | undefined);
  const hotspots = (config.hotspots ?? []) as HotspotConfig[];

  const openModal = () => {
    setPhotoUrl((config.photoUrl as string) ?? "");
    setEditing(false);
    setOpen(true);
  };

  const handleHotspot = (hotspot: HotspotConfig) => {
    const vibrated = triggerHaptic(hotspot.pattern ?? HAPTIC_PATTERNS.heartbeat);
    if (!vibrated) {
      setPulseId(hotspot.id);
      setTimeout(() => setPulseId(null), 600);
    }
  };

  const savePhoto = async () => {
    if (!item) return;
    const nextHotspots: HotspotConfig[] =
      hotspots.length > 0
        ? hotspots
        : [
            {
              id: "1",
              x: 30,
              y: 40,
              radius: 12,
              pattern: HAPTIC_PATTERNS.heartbeat,
              message: "Thinking of you",
            },
            {
              id: "2",
              x: 70,
              y: 60,
              radius: 12,
              pattern: HAPTIC_PATTERNS.gentle,
              message: "Always",
            },
          ];

    await updateItem.mutateAsync({
      id: item.id,
      config: { photoUrl: photoUrl.trim(), hotspots: nextHotspots },
    });
    setEditing(false);
  };

  if (!item) {
    return (
      <SharedItemVisual type="haptic_photo_frame" size={48} className="opacity-40" />
    );
  }

  return (
    <>
      <SharedItemButton label="Open photo frame" onClick={openModal}>
        <SharedItemVisual type="haptic_photo_frame" size={48} />
      </SharedItemButton>
      <InteractionModal
        open={open}
        onClose={() => setOpen(false)}
        title="Photo Frame"
        className="max-w-sm"
      >
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-200 shadow-inner">
          {displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayUrl}
              alt="Couple photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 text-sm p-4 text-center gap-2">
              <SharedItemVisual type="haptic_photo_frame" size={48} className="opacity-50" />
              <span>Add a photo below</span>
            </div>
          )}
          {!editing &&
            hotspots.map((h) => (
              <button
                key={h.id}
                type="button"
                className={cn(
                  "absolute rounded-full border-2 border-white/60 bg-amber-400/25 min-h-[44px] min-w-[44px] hover:bg-amber-400/40 transition-colors",
                  pulseId === h.id && "animate-ping bg-amber-400/60"
                )}
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  width: `${h.radius * 2}%`,
                  height: `${h.radius * 2}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => handleHotspot(h)}
                aria-label={h.message ?? "Touch hotspot"}
              />
            ))}
        </div>

        <div className="mt-4 space-y-3">
          {editing ? (
            <>
              <div>
                <label className="text-xs text-stone-500">Photo URL</label>
                <Input
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={savePhoto}
                  disabled={updateItem.isPending}
                >
                  Save photo
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setEditing(true)}
              >
                Change photo
              </Button>
            </div>
          )}
          {!editing && hotspots.length > 0 && (
            <p className="text-xs text-stone-500 text-center">
              Tap glowing spots on the photo for haptic surprises
            </p>
          )}
        </div>
      </InteractionModal>
    </>
  );
}

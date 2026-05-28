"use client";

import { useState } from "react";
import { InteractionModal } from "@/components/ui/InteractionModal";
import { TurntableControls, useTurntableSync } from "@/components/audio/useTurntableSync";
import { SharedItemVisual } from "./SharedItemVisual";
import { SharedItemButton } from "./SharedItemButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  usePlaylist,
  useAddPlaylistTrack,
  useRemovePlaylistTrack,
} from "@/lib/hooks/useSharedSpace";
import type { SharedSpaceItem, RelationshipStats } from "@/types/database";

export function RecordPlayerItem({
  coupleId,
  item,
}: {
  coupleId?: string | null;
  item?: SharedSpaceItem;
  stats?: RelationshipStats | null;
}) {
  const [open, setOpen] = useState(false);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [trackTitle, setTrackTitle] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [removingTrackId, setRemovingTrackId] = useState<string | null>(null);
  const { data: tracks = [] } = usePlaylist(coupleId ?? undefined);
  const addTrack = useAddPlaylistTrack();
  const removeTrack = useRemovePlaylistTrack();
  const turntable = useTurntableSync(coupleId ?? undefined);

  const handleAddTrack = async () => {
    if (!coupleId || !trackTitle.trim() || !trackUrl.trim()) return;
    await addTrack.mutateAsync({
      coupleId,
      title: trackTitle.trim(),
      storageUrl: trackUrl.trim(),
    });
    setTrackTitle("");
    setTrackUrl("");
    setShowAddTrack(false);
  };

  const handleRemoveTrack = async (trackId: string) => {
    if (turntable.state.trackId === trackId) {
      turntable.clearTrack();
    }
    setRemovingTrackId(trackId);
    try {
      await removeTrack.mutateAsync(trackId);
    } finally {
      setRemovingTrackId(null);
    }
  };

  if (!item) {
    return (
      <SharedItemVisual type="record_player" size={48} className="opacity-40" />
    );
  }

  return (
    <>
      <SharedItemButton label="Open record player" onClick={() => setOpen(true)}>
        <SharedItemVisual
          type="record_player"
          size={48}
          className={turntable.state.isPlaying ? "animate-pulse" : undefined}
        />
      </SharedItemButton>
      <InteractionModal
        open={open}
        onClose={() => setOpen(false)}
        title="Record Player"
        className="max-w-md"
      >
        <TurntableControls
          tracks={tracks}
          turntable={turntable}
          onRemoveTrack={handleRemoveTrack}
          removingTrackId={removingTrackId}
        />
        <div className="mt-4 pt-4 border-t border-border">
          {!showAddTrack ? (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setShowAddTrack(true)}
            >
              Add a track
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted">Add to playlist</p>
              <Input
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                placeholder="Track title"
              />
              <Input
                value={trackUrl}
                onChange={(e) => setTrackUrl(e.target.value)}
                placeholder="YouTube link"
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowAddTrack(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleAddTrack}
                  disabled={addTrack.isPending}
                >
                  Save track
                </Button>
              </div>
            </div>
          )}
        </div>
      </InteractionModal>
    </>
  );
}

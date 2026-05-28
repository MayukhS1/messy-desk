"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  useSharedSpace,
  useUpdateSharedItem,
  useAddPlaylistTrack,
  useRemovePlaylistTrack,
  usePlaylist,
} from "@/lib/hooks/useSharedSpace";
import { HAPTIC_PATTERNS } from "@/lib/haptics/patterns";
import type { HotspotConfig } from "@/types/database";

export default function SharedEditPage() {
  const { data } = useSharedSpace();
  const updateItem = useUpdateSharedItem();
  const addTrack = useAddPlaylistTrack();
  const removeTrack = useRemovePlaylistTrack();
  const { data: tracks = [] } = usePlaylist(data?.coupleId ?? undefined);

  const frameItem = data?.items.find(
    (i) => i.item_type === "haptic_photo_frame"
  );

  const [photoUrl, setPhotoUrl] = useState(
    frameItem?.config?.photoUrl ?? ""
  );
  const [trackTitle, setTrackTitle] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [removingTrackId, setRemovingTrackId] = useState<string | null>(null);

  const savePhoto = async () => {
    if (!frameItem) return;
    const hotspots: HotspotConfig[] = frameItem.config?.hotspots ?? [
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
      id: frameItem.id,
      config: { photoUrl, hotspots },
    });
  };

  const addPlaylistTrack = async () => {
    if (!data?.coupleId || !trackTitle || !trackUrl) return;
    await addTrack.mutateAsync({
      coupleId: data.coupleId,
      title: trackTitle,
      storageUrl: trackUrl,
    });
    setTrackTitle("");
    setTrackUrl("");
  };

  const removePlaylistTrack = async (trackId: string) => {
    setRemovingTrackId(trackId);
    try {
      await removeTrack.mutateAsync(trackId);
    } finally {
      setRemovingTrackId(null);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <PageHeader
        title="Shared space"
        description="Configure photo frame and playlist"
      />

      <Card className="space-y-4">
        <h2 className="font-semibold text-foreground">Photo frame</h2>
        <div>
          <label className="text-xs font-medium text-muted">Photo URL</label>
          <Input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>
        <Button onClick={savePhoto} disabled={updateItem.isPending}>
          Save photo
        </Button>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-semibold text-foreground">Record player playlist</h2>
        {tracks.length > 0 && (
          <ul className="text-sm space-y-2 text-muted">
            {tracks.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-2">
                <span>{t.title}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/5"
                  onClick={() => removePlaylistTrack(t.id)}
                  disabled={removingTrackId === t.id}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
        <div>
          <label className="text-xs font-medium text-muted">Track title</label>
          <Input
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">YouTube link</label>
          <Input
            value={trackUrl}
            onChange={(e) => setTrackUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=…"
          />
        </div>
        <Button onClick={addPlaylistTrack} disabled={addTrack.isPending}>
          Add track
        </Button>
      </Card>

      <Card>
        <h2 className="font-semibold text-foreground mb-2">Flora vase</h2>
        <p className="text-sm text-muted">
          Growth stage:{" "}
          {data?.stats?.flora_stage === 4
            ? "Blooming"
            : data?.stats?.flora_stage === 0
              ? "Empty"
              : `Stage ${data?.stats?.flora_stage ?? 1}`}
        </p>
        <p className="text-xs text-muted mt-2">
          Write journal entries to help your plant grow.
        </p>
      </Card>
    </div>
  );
}

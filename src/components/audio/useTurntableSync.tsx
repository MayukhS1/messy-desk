"use client";

import { useRef, useState, useCallback } from "react";
import type { PlaylistTrack } from "@/types/database";
import { isYouTubeUrl, youTubeEmbedUrl } from "@/lib/youtube";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function useTurntableSync(_coupleId?: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackId, setTrackId] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playTrack = useCallback(
    (track: PlaylistTrack) => {
      stopAudio();
      setTrackId(track.id);

      if (isYouTubeUrl(track.storage_url)) {
        return;
      }

      audioRef.current = new Audio(track.storage_url);
      audioRef.current.play();
      setIsPlaying(true);
    },
    [stopAudio]
  );

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const clearTrack = useCallback(() => {
    stopAudio();
    setTrackId("");
  }, [stopAudio]);

  return {
    state: { trackId, isPlaying, positionMs: 0, updatedAt: 0, leaderId: "" },
    playTrack,
    togglePlay,
    stopAudio,
    clearTrack,
    audioRef,
  };
}

export function TurntableControls({
  tracks,
  turntable,
  onRemoveTrack,
  removingTrackId,
}: {
  tracks: PlaylistTrack[];
  turntable: ReturnType<typeof useTurntableSync>;
  onRemoveTrack?: (trackId: string) => void;
  removingTrackId?: string | null;
}) {
  const activeTrack = tracks.find((t) => t.id === turntable.state.trackId);
  const embedUrl = activeTrack
    ? youTubeEmbedUrl(activeTrack.storage_url, true)
    : null;

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted text-center">
        Pick a song — YouTube videos play right here in your nook.
      </p>

      {tracks.length === 0 ? (
        <p className="text-sm text-muted text-center py-4">
          No songs yet. Add a YouTube link below.
        </p>
      ) : (
        <ul className="space-y-2 max-h-40 overflow-y-auto">
          {tracks.map((track) => {
            const selected = turntable.state.trackId === track.id;
            return (
              <li key={track.id} className="flex gap-2 items-stretch">
                <button
                  type="button"
                  className={cn(
                    "flex-1 rounded-lg border px-4 py-2.5 text-left text-sm min-h-[44px] transition-colors",
                    selected
                      ? "border-primary bg-primary-subtle text-foreground"
                      : "border-border hover:bg-secondary"
                  )}
                  onClick={() => turntable.playTrack(track)}
                >
                  <span className="font-medium">{track.title}</span>
                  {isYouTubeUrl(track.storage_url) && (
                    <span className="block text-[11px] text-muted mt-0.5">
                      YouTube
                    </span>
                  )}
                </button>
                {onRemoveTrack && (
                  <button
                    type="button"
                    aria-label={`Remove ${track.title}`}
                    className="shrink-0 rounded-lg border border-border px-3 text-xs font-medium text-destructive hover:bg-destructive/5 min-h-[44px] disabled:opacity-50 transition-colors"
                    onClick={() => onRemoveTrack(track.id)}
                    disabled={removingTrackId === track.id}
                  >
                    Remove
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {activeTrack && embedUrl && (
        <div className="rounded-lg overflow-hidden border border-border bg-black aspect-video">
          <iframe
            key={embedUrl}
            src={embedUrl}
            title={activeTrack.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {activeTrack && !embedUrl && (
        <Button type="button" className="w-full" onClick={turntable.togglePlay}>
          {turntable.state.isPlaying ? "Pause" : "Play"}
        </Button>
      )}
    </div>
  );
}

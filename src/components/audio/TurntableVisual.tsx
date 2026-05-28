"use client";

import { SharedItemVisual } from "@/components/items/shared/SharedItemVisual";
import { cn } from "@/lib/utils";

export function TurntableVisual({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative flex flex-col items-center py-4">
      <SharedItemVisual
        type="record_player"
        size={80}
        spinning={isPlaying}
        className={cn(isPlaying && "drop-shadow-lg")}
      />
      {isPlaying && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none">
          {["♪", "♫"].map((note, i) => (
            <span
              key={i}
              className="absolute font-display text-accent-terracotta/60"
              style={{
                left: `${i * 16 - 8}px`,
                animation: `float-note 1.5s ease-out ${i * 0.2}s infinite`,
              }}
            >
              {note}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

export function TurntableVisual({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className={cn(
          "text-4xl drop-shadow-sm transition-transform duration-1000",
          isPlaying && "animate-spin"
        )}
        style={{ animationDuration: "3s" }}
      >
        💿
      </div>
      <span className="text-2xl -mt-2">📻</span>
    </div>
  );
}

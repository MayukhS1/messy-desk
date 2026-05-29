"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const INK = "#3F220F";

export function DeskSurface({
  showGrid,
  readonly,
  label = "Your messy desk",
  hideLabel,
  children,
  className,
  variant = "default",
}: {
  showGrid?: boolean;
  readonly?: boolean;
  label?: string;
  hideLabel?: boolean;
  children: ReactNode;
  className?: string;
  variant?: "default" | "topdown";
}) {
  const isTopDown = variant === "topdown";
  const showSurfaceLabel = !hideLabel && !isTopDown && label;

  return (
    <div className={cn("relative h-full w-full min-h-0", className)}>
      {!isTopDown && (
        <>
          <div className="absolute inset-x-[6%] top-[4%] bottom-[8%] rounded-2xl bg-accent-sunflower/8 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-2 left-[10%] right-[10%] h-6 rounded-[50%] bg-[#3F220F]/20 blur-xl pointer-events-none" />
        </>
      )}

      {isTopDown && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 75% 15%, rgba(252,211,77,0.18) 0%, transparent 55%)",
          }}
        />
      )}

      <div
        className={cn(
          "absolute overflow-hidden filter-hand-drawn",
          isTopDown
            ? "inset-x-0 inset-y-0 rounded-xl shadow-[0_8px_20px_rgba(63,34,15,0.15)]"
            : "inset-x-[3%] top-[5%] bottom-[10%] rounded-xl shadow-[0_12px_24px_rgba(47,26,12,0.2)]"
        )}
        style={{
          backgroundColor: isTopDown ? "#e8dcc8" : undefined,
          border: `2px solid ${INK}`,
        }}
      >
        {!isTopDown && (
          <>
            <div className="absolute inset-0 desk-wood" />
            <div className="absolute inset-0 desk-wood-grain opacity-50 pointer-events-none" />
            <div className="absolute inset-0 desk-wood-vignette pointer-events-none" />
            <div className="absolute inset-0 desk-wood-specular pointer-events-none" />
          </>
        )}

        {isTopDown && (
          <>
            <div
              className="absolute inset-0 opacity-40 pointer-events-none desk-wood-grain"
              style={{ mixBlendMode: "multiply" }}
            />
            <div className="absolute inset-[6%] desk-grid rounded-lg opacity-25 pointer-events-none" />
          </>
        )}

        {/* Inner desk mat — dashed stitching */}
        <div
          className="absolute inset-[4%] rounded-lg pointer-events-none"
          style={{ border: `2px dashed ${INK}`, opacity: isTopDown ? 0.45 : 0.35 }}
        />
        <div
          className="absolute inset-[7%] rounded-md pointer-events-none"
          style={{
            border: `1px dashed ${INK}`,
            opacity: isTopDown ? 0.2 : 0,
            backgroundColor: isTopDown ? "rgba(253, 251, 247, 0.35)" : undefined,
          }}
        />

        {!isTopDown && (
          <>
            <div className="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-amber-100/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#3F220F]/30 to-transparent pointer-events-none" />
          </>
        )}

        {(showGrid || isTopDown) && !isTopDown && (
          <div className="absolute inset-[8%] desk-grid rounded-lg opacity-35 pointer-events-none" />
        )}

        <div className="absolute inset-[8%] overflow-hidden rounded-lg">{children}</div>
      </div>

      {!isTopDown && (
        <>
          <div className="absolute bottom-0 left-[14%] w-4 h-[10%] bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-md shadow-lg opacity-90 filter-hand-drawn pointer-events-none border-x-2 border-[#3F220F]/30" />
          <div className="absolute bottom-0 right-[14%] w-4 h-[10%] bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-md shadow-lg opacity-90 filter-hand-drawn pointer-events-none border-x-2 border-[#3F220F]/30" />
        </>
      )}

      {showSurfaceLabel && (
        <div
          className="absolute top-3 left-[6%] text-sm font-bold font-display pointer-events-none select-none"
          style={{ color: INK }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

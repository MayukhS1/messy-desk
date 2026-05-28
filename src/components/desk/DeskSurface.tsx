"use client";

import { cn } from "@/lib/utils";

export function DeskSurface({
  showGrid,
  readonly,
  label = "Your messy desk",
  children,
  className,
}: {
  showGrid?: boolean;
  readonly?: boolean;
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative h-full w-full min-h-0", className)}>
      {/* Ambient glow */}
      <div className="absolute inset-x-[6%] top-[4%] bottom-[8%] rounded-2xl bg-accent-sunflower/8 blur-2xl pointer-events-none" />

      {/* Floor shadow */}
      <div className="absolute -bottom-2 left-[10%] right-[10%] h-6 rounded-[50%] bg-black/25 blur-xl" />

      {/* Desk body with sketchy border */}
      <div
        className={cn(
          "absolute inset-x-[3%] top-[5%] bottom-[10%] desk-wood rounded-xl shadow-2xl overflow-hidden border-[3px] border-amber-950/40 filter-hand-drawn",
          readonly && "ring-1 ring-amber-950/10"
        )}
      >
        <div className="absolute inset-0 desk-wood-grain opacity-60 pointer-events-none" />
        <div className="absolute inset-0 desk-wood-vignette pointer-events-none" />
        <div className="absolute inset-0 desk-wood-specular pointer-events-none" />

        {/* Bevel edges */}
        <div className="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-amber-100/25 to-transparent pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-amber-950/40 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-amber-950/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-amber-950/50 via-amber-900/25 to-transparent pointer-events-none rounded-b-xl" />

        {/* Work area inset */}
        <div className="absolute inset-[7%] rounded-lg bg-amber-100/10 border border-amber-950/8 pointer-events-none" />

        {showGrid && (
          <div className="absolute inset-[7%] desk-grid rounded-lg opacity-40 pointer-events-none" />
        )}

        <div className="absolute inset-[7%] overflow-hidden rounded-lg">{children}</div>
      </div>

      {/* Legs */}
      <div className="absolute bottom-0 left-[14%] w-4 h-[10%] bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-md shadow-lg opacity-90 filter-hand-drawn" />
      <div className="absolute bottom-0 right-[14%] w-4 h-[10%] bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-md shadow-lg opacity-90 filter-hand-drawn" />

      <div className="absolute top-2 left-[5%] text-[10px] font-display text-amber-950/40 pointer-events-none select-none">
        {label}
      </div>

      {readonly && (
        <div className="absolute top-1 right-[4%] px-2 py-0.5 border-2 border-amber-800/30 bg-yellow-50/90 text-[9px] font-display text-amber-900/60 shadow-sm filter-hand-drawn rotate-[2deg] pointer-events-none">
          Preview
        </div>
      )}
    </div>
  );
}

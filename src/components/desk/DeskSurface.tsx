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
    <div className={cn("relative h-full w-full min-h-0 perspective-desk", className)}>
      {/* Ambient glow */}
      <div className="absolute inset-x-[6%] top-[4%] bottom-[8%] rounded-2xl bg-amber-400/5 blur-2xl pointer-events-none" />

      {/* Floor shadow */}
      <div className="absolute -bottom-2 left-[10%] right-[10%] h-5 rounded-[50%] bg-black/20 blur-lg" />

      {/* Desk body */}
      <div
        className={cn(
          "absolute inset-x-[3%] top-[5%] bottom-[10%] desk-wood rounded-xl shadow-2xl overflow-hidden border border-amber-950/25",
          readonly && "ring-1 ring-amber-950/10"
        )}
      >
        <div className="absolute inset-0 desk-wood-grain opacity-50 pointer-events-none" />
        <div className="absolute inset-0 desk-wood-vignette pointer-events-none" />

        {/* Edges */}
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-amber-950/30 to-transparent pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-amber-950/35 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-gradient-to-l from-amber-950/25 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-amber-950/40 via-amber-900/20 to-transparent pointer-events-none rounded-b-xl" />

        {/* Work area */}
        <div className="absolute inset-[7%] rounded-lg bg-amber-100/8 border border-amber-950/5 pointer-events-none" />

        {showGrid && (
          <div className="absolute inset-[7%] desk-grid rounded-lg opacity-50 pointer-events-none" />
        )}

        <div className="absolute inset-[7%] overflow-hidden rounded-lg">{children}</div>
      </div>

      {/* Legs */}
      <div className="absolute bottom-0 left-[14%] w-3.5 h-[10%] bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-md shadow-md opacity-90" />
      <div className="absolute bottom-0 right-[14%] w-3.5 h-[10%] bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-md shadow-md opacity-90" />

      <div className="absolute top-2 left-[5%] text-[10px] uppercase tracking-[0.22em] text-amber-950/35 font-semibold pointer-events-none select-none">
        {label}
      </div>

      {readonly && (
        <div className="absolute top-2 right-[5%] rounded-full bg-white/80 border border-stone-200/80 px-2.5 py-1 text-[10px] font-medium text-stone-500 backdrop-blur-sm pointer-events-none">
          Preview
        </div>
      )}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

/** Matches the edit-page desk column: fixed height, same grid width on large screens. */
export function DeskCanvasFrame({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "compact";
}) {
  return (
    <div
      className={cn(
        "relative w-full",
        size === "compact" ? "h-[260px] sm:h-[280px] lg:h-[300px]" : "h-[420px] lg:h-[520px]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Three-column layout from /desk/edit — keeps desk width identical everywhere. */
export function DeskEditorGrid({
  palette,
  desk,
  sidebar,
  className,
  frameSize = "default",
}: {
  palette?: React.ReactNode;
  desk: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
  frameSize?: "default" | "compact";
}) {
  return (
    <div
      className={cn(
        "grid gap-4 lg:grid-cols-[minmax(0,200px)_minmax(0,1fr)_minmax(280px,320px)]",
        className
      )}
    >
      <div className="order-2 lg:order-1">{palette ?? <div className="hidden lg:block" />}</div>
      <div className="order-1 lg:order-2">
        <DeskCanvasFrame size={frameSize}>{desk}</DeskCanvasFrame>
      </div>
      <div className="order-3">{sidebar ?? <div className="hidden lg:block" />}</div>
    </div>
  );
}

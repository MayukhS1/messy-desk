"use client";

import { cn } from "@/lib/utils";

const DESK_VIEWPORT_CLASSES =
  "@container/desk relative mx-auto w-full min-h-0 aspect-video min-w-[280px] max-w-lg md:max-w-xl lg:max-w-4xl";

/** Unified 16:9 desk viewport — editor, hunt, partner, and room previews. */
export function DeskCanvasFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(DESK_VIEWPORT_CLASSES, className)}>{children}</div>
  );
}

/** @deprecated Alias for DeskCanvasFrame — all views share one viewport spec. */
export function DeskPreviewFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DeskCanvasFrame className={className}>{children}</DeskCanvasFrame>
  );
}

/** Three-column layout from /desk/edit — desk column uses identical 16:9 frame everywhere. */
export function DeskEditorGrid({
  palette,
  desk,
  sidebar,
  className,
}: {
  palette?: React.ReactNode;
  desk: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3 lg:gap-4 lg:grid-cols-[minmax(0,132px)_minmax(0,1fr)_minmax(240px,280px)]",
        className
      )}
    >
      <div className="order-2 lg:order-1">{palette ?? <div className="hidden lg:block" />}</div>
      <div className="order-1 lg:order-2">
        <DeskCanvasFrame>{desk}</DeskCanvasFrame>
      </div>
      <div className="order-3">{sidebar ?? <div className="hidden lg:block" />}</div>
    </div>
  );
}

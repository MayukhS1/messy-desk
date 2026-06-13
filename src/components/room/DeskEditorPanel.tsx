"use client";

import { useMyDesk } from "@/lib/hooks/useDesk";
import { DeskCanvas } from "@/components/desk/DeskCanvas";
import { DeskPreviewFrame } from "@/components/desk/DeskEditorGrid";
import { DeskPlannerNotes } from "./DeskPlannerNotes";
import { TinkerDeskButton } from "./InteractiveDeskPreview";

export function DeskEditorPanel({ compact }: { compact?: boolean }) {
  const { data, isLoading } = useMyDesk();
  const items = data?.items ?? [];
  const status = data?.desk?.status ?? "draft";
  const published = status === "published";

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="h-64 animate-pulse rounded-xl border-2 border-amber-800/40 bg-amber-50/80 filter-hand-drawn" />
        <div className="mx-auto aspect-video w-full max-w-lg animate-pulse rounded-xl border-2 border-amber-800/40 bg-[#e8dcc8]/50 filter-hand-drawn md:max-w-xl" />
      </div>
    );
  }

  if (!data?.desk) {
    return <p className="text-sketch-label font-display">No desk found.</p>;
  }

  if (compact) {
    return (
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-display font-bold text-[#3F220F]">Your desk</h3>
          <p className="text-sm font-semibold text-[#3F220F]/80 font-sans">
            {items.length} items ·{" "}
            <span className="capitalize">{status}</span>
          </p>
        </div>

        <div className="rounded-xl border-2 border-amber-800/40 bg-[#e8dcc8]/25 p-4 sm:p-6 filter-hand-drawn">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <DeskPlannerNotes
              items={items}
              published={published}
              className="w-full max-w-none rotate-[0.5deg] lg:sticky lg:top-4"
            />

            <div className="flex w-full flex-col items-center gap-4">
              <DeskPreviewFrame className="w-full">
                <DeskCanvas
                  items={items}
                  mode="view"
                  hideViewOverlay
                  surfaceVariant="topdown"
                  hideSurfaceLabel
                />
              </DeskPreviewFrame>
              <TinkerDeskButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

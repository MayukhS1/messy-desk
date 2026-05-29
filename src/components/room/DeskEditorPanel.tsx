"use client";

import { useMyDesk } from "@/lib/hooks/useDesk";
import { DeskCanvas } from "@/components/desk/DeskCanvas";
import { DeskEditorGrid } from "@/components/desk/DeskEditorGrid";
import { DeskPlannerNotes } from "./DeskPlannerNotes";
import { InteractiveDeskPreview } from "./InteractiveDeskPreview";

export function DeskEditorPanel({ compact }: { compact?: boolean }) {
  const { data, isLoading } = useMyDesk();
  const items = data?.items ?? [];
  const status = data?.desk?.status ?? "draft";
  const published = status === "published";

  if (isLoading) {
    return (
      <div className="h-[260px] animate-pulse rounded-xl border-2 border-amber-800/40 bg-[#c9956a]/60 sm:h-[280px] lg:h-[300px] filter-hand-drawn" />
    );
  }

  if (!data?.desk) {
    return <p className="text-sketch-label font-display">No desk found.</p>;
  }

  if (compact) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-display font-bold text-[#3F220F]">Your desk</h3>
          <p className="text-sm font-semibold text-[#3F220F]/80 font-sans">
            {items.length} items ·{" "}
            <span className="capitalize">{status}</span>
          </p>
        </div>

        <div className="rounded-xl border-2 border-amber-800/40 bg-[#e8dcc8]/30 p-3 sm:p-4">
          <DeskEditorGrid
            frameSize="compact"
            className="lg:grid-cols-[minmax(0,1fr)_minmax(300px,340px)]"
            desk={
              <InteractiveDeskPreview>
                <DeskCanvas
                  items={items}
                  mode="view"
                  hideViewOverlay
                  surfaceVariant="topdown"
                  hideSurfaceLabel
                />
              </InteractiveDeskPreview>
            }
            sidebar={
              <DeskPlannerNotes
                items={items}
                published={published}
                className="hidden lg:block"
              />
            }
          />
        </div>

        <DeskPlannerNotes
          items={items}
          published={published}
          className="lg:hidden mx-auto"
        />
      </div>
    );
  }

  return null;
}

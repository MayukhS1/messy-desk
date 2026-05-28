"use client";

import { useState } from "react";
import { SharedSpaceCanvas } from "@/components/shared-space/SharedSpaceCanvas";
import { DeskSwitcher } from "./DeskSwitcher";
import { DeskExplorePanel } from "./DeskExplorePanel";
import { DeskEditorPanel } from "./DeskEditorPanel";
import { usePartner } from "@/lib/hooks/useProfile";
import { CozyMessDecor } from "@/components/decor/CozyMessDecor";

export function RoomLayout() {
  const [activeDesk, setActiveDesk] = useState<"mine" | "partner">("mine");
  const { data: partner } = usePartner();

  return (
    <div className="relative overflow-hidden">
      <CozyMessDecor variant="full" />

      <div className="relative border-2 border-amber-800/25 bg-surface/60 shadow-lg overflow-hidden filter-hand-drawn rounded-xl">
        <SharedSpaceCanvas />

        {/* Sketchy divider — torn paper edge */}
        <div className="relative h-3 bg-gradient-to-r from-transparent via-amber-800/10 to-transparent">
          <div className="absolute inset-x-4 top-1 border-t border-dashed border-amber-800/20" />
        </div>

        <div className="relative p-3 sm:p-4 space-y-4">
          {partner ? (
            <DeskSwitcher
              active={activeDesk}
              onChange={setActiveDesk}
              partnerName={partner.display_name}
            />
          ) : (
            <p className="text-sm text-muted text-center font-display">
              Your desk — invite your partner from the dashboard when you&apos;re
              ready for them to hunt.
            </p>
          )}
          {activeDesk === "mine" || !partner ? (
            <DeskEditorPanel compact />
          ) : (
            <DeskExplorePanel ownerId={partner.id} />
          )}
        </div>
      </div>
    </div>
  );
}

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

      <div className="relative overflow-hidden rounded-xl border-2 border-amber-800/40 bg-surface/95 filter-hand-drawn shadow-lg">
        <SharedSpaceCanvas />

        {/* Warm divider between nook and desk */}
        <div className="relative h-4 border-t-2 border-dashed border-amber-800/25 border-b border-amber-800/40 bg-gradient-to-b from-amber-100/40 to-orange-50/20" />

        <div className="relative p-4 sm:p-5 space-y-4 bg-gradient-to-b from-amber-50/90 to-orange-50/40">
          {partner ? (
            <DeskSwitcher
              active={activeDesk}
              onChange={setActiveDesk}
              partnerName={partner.display_name}
            />
          ) : (
            <p className="text-sm font-bold text-center font-display text-[#2F1A0C]">
              Your desk — invite your partner from the dashboard when you&apos;re
              ready for them to hunt.
            </p>
          )}
          {activeDesk === "mine" || !partner ? (
            <DeskEditorPanel compact />
          ) : (
            <DeskExplorePanel
              ownerId={partner.id}
              partnerName={partner.display_name}
            />
          )}
        </div>
      </div>
    </div>
  );
}

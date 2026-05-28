"use client";

import { useState } from "react";
import { SharedSpaceCanvas } from "@/components/shared-space/SharedSpaceCanvas";
import { DeskSwitcher } from "./DeskSwitcher";
import { DeskExplorePanel } from "./DeskExplorePanel";
import { DeskEditorPanel } from "./DeskEditorPanel";
import { usePartner } from "@/lib/hooks/useProfile";

export function RoomLayout() {
  const [activeDesk, setActiveDesk] = useState<"mine" | "partner">("mine");
  const { data: partner } = usePartner();

  return (
    <div className="rounded-2xl border border-stone-200 bg-white/60 shadow-lg overflow-hidden">
      <SharedSpaceCanvas />
      <div className="h-1 bg-gradient-to-r from-transparent via-stone-300/50 to-transparent" />
      <div className="p-3 sm:p-4 space-y-4">
        {partner ? (
          <DeskSwitcher
            active={activeDesk}
            onChange={setActiveDesk}
            partnerName={partner.display_name}
          />
        ) : (
          <p className="text-sm text-stone-500 text-center">
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
  );
}

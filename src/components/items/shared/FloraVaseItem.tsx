"use client";

import { useState } from "react";
import { InteractionModal } from "@/components/ui/InteractionModal";
import { FLORA_STAGES } from "@/lib/constants";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { SharedItemVisual } from "./SharedItemVisual";
import { SharedItemButton } from "./SharedItemButton";
import type { SharedSpaceItem, RelationshipStats } from "@/types/database";

export function FloraVaseItem({
  stats,
  item,
}: {
  coupleId?: string | null;
  item?: SharedSpaceItem;
  stats?: RelationshipStats | null;
}) {
  const [open, setOpen] = useState(false);
  const stageIndex = stats?.flora_stage ?? 1;
  const stage = FLORA_STAGES[stageIndex] ?? FLORA_STAGES[1];

  if (!item) {
    return <SharedItemVisual type="flora_vase" size={72} className="opacity-50" />;
  }

  return (
    <>
      <SharedItemButton label="View flora vase" onClick={() => setOpen(true)}>
        <SharedItemVisual type="flora_vase" size={72} floraStage={stageIndex} />
      </SharedItemButton>
      <InteractionModal open={open} onClose={() => setOpen(false)} title="Flora Vase">
        <div className="text-center space-y-4">
          <SharedItemVisual
            type="flora_vase"
            size={80}
            floraStage={stageIndex}
            className="mx-auto"
          />
          <div>
            <p className="font-medium text-stone-800">{stage.name}</p>
            <p className="text-sm text-stone-500 mt-1">
              Grows when you write in the shared journal
            </p>
          </div>
          <div className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-600 space-y-1">
            <p>
              Last activity:{" "}
              <RelativeTime date={stats?.last_activity_at ?? null} />
            </p>
            <p>{stats?.messages_7d ?? 0} journal moments this week</p>
          </div>
        </div>
      </InteractionModal>
    </>
  );
}

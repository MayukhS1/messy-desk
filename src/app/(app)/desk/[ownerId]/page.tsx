"use client";

import { use } from "react";
import { SharedSpaceCanvas } from "@/components/shared-space/SharedSpaceCanvas";
import { DeskExplorePanel } from "@/components/room/DeskExplorePanel";
import { CozyMessDecor } from "@/components/decor/CozyMessDecor";

export default function ExploreDeskPage({
  params,
}: {
  params: Promise<{ ownerId: string }>;
}) {
  const { ownerId } = use(params);

  return (
    <div className="relative space-y-4">
      <CozyMessDecor variant="full" />
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Explore desk
        </h1>
        <p className="text-sm text-muted">
          Hunt for hidden messages
        </p>
      </div>
      <div className="relative border-2 border-amber-800/25 bg-surface/60 overflow-hidden filter-hand-drawn rounded-xl">
        <SharedSpaceCanvas />
        <div className="p-4">
          <DeskExplorePanel ownerId={ownerId} />
        </div>
      </div>
    </div>
  );
}

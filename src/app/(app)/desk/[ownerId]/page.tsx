"use client";

import { use } from "react";
import { SharedSpaceCanvas } from "@/components/shared-space/SharedSpaceCanvas";
import { DeskExplorePanel } from "@/components/room/DeskExplorePanel";

export default function ExploreDeskPage({
  params,
}: {
  params: Promise<{ ownerId: string }>;
}) {
  const { ownerId } = use(params);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-serif font-bold text-amber-950">
          Explore desk
        </h1>
        <p className="text-sm text-stone-500">
          Hunt for hidden messages
        </p>
      </div>
      <div className="rounded-2xl border border-stone-200 overflow-hidden">
        <SharedSpaceCanvas />
        <div className="p-4">
          <DeskExplorePanel ownerId={ownerId} />
        </div>
      </div>
    </div>
  );
}

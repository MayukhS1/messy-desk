"use client";

import { useState, useMemo, useCallback } from "react";
import { usePartnerDesk } from "@/lib/hooks/useDesk";
import {
  usePartnerHunt,
  useHuntMutations,
} from "@/lib/hooks/useHunt";
import { DeskCanvas } from "@/components/desk/DeskCanvas";
import { DeskCanvasFrame, DeskEditorGrid } from "@/components/desk/DeskEditorGrid";
import {
  HuntChecklist,
  HuntProgress,
  MobileHuntDrawer,
} from "@/components/hunt/HuntChecklist";
import {
  FoundCelebration,
  HuntKeepsakeSpread,
} from "@/components/hunt/HuntResultsPanel";
import {
  HuntCelebrationParticles,
  CompletedPostmark,
} from "@/components/hunt/HuntCelebration";
import { Button } from "@/components/ui/Button";
import { HUNT_TARGET_COUNT } from "@/lib/constants";
import type { DeskItem } from "@/types/database";

import { PartnerDeskWaitingState } from "./PartnerDeskWaitingState";

export function DeskExplorePanel({
  ownerId,
  partnerName,
}: {
  ownerId: string;
  partnerName?: string;
}) {
  const { data: deskData, isLoading } = usePartnerDesk(ownerId);
  const { data: huntState, refetch: refetchHunt } = usePartnerHunt(ownerId);
  const { startHunt, markFound } = useHuntMutations();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [startError, setStartError] = useState("");
  const [layoutOverrides, setLayoutOverrides] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const displayItems: DeskItem[] = (() => {
    if (!deskData?.items) return [];
    return deskData.items.map((item) => ({
      ...item,
      pos_x: layoutOverrides[item.id]?.x ?? item.pos_x,
      pos_y: layoutOverrides[item.id]?.y ?? item.pos_y,
    }));
  })();

  const huntData = useMemo(
    () =>
      huntState?.phase === "active"
        ? { hunt: huntState.hunt, targets: huntState.targets }
        : null,
    [huntState]
  );

  const completedData = useMemo(
    () =>
      huntState?.phase === "completed"
        ? { hunt: huntState.hunt, targets: huntState.targets }
        : null,
    [huntState]
  );

  const completedUnlockedIds = useMemo(() => {
    if (!completedData) return null;
    const set = new Set<string>();
    completedData.targets.forEach((t) => set.add(t.desk_item_id));
    return set;
  }, [completedData]);

  const unlockedIds = useMemo(() => {
    const set = new Set<string>();
    huntData?.targets.forEach((t) => {
      if (t.found_at) set.add(t.desk_item_id);
    });
    completedData?.targets.forEach((t) => {
      if (t.found_at) set.add(t.desk_item_id);
    });
    return set;
  }, [huntData, completedData]);

  const foundCount =
    huntData?.targets.filter((t) => t.found_at).length ?? 0;
  const total = huntData?.targets.length ?? HUNT_TARGET_COUNT;

  const handleLayoutMove = useCallback((id: string, x: number, y: number) => {
    setLayoutOverrides((prev) => ({ ...prev, [id]: { x, y } }));
  }, []);

  const handleUnlock = async (itemId: string) => {
    if (!huntData) return;
    const target = huntData.targets.find((t) => t.desk_item_id === itemId);
    if (!target || target.found_at) return;

    const result = await markFound.mutateAsync({
      targetId: target.id,
      huntId: huntData.hunt.id,
    });

    if (result.allFound) {
      setShowCelebration(true);
      refetchHunt();
    }
  };

  const handleStartHunt = async () => {
    setStartError("");
    try {
      await startHunt.mutateAsync(ownerId);
      refetchHunt();
    } catch (err) {
      setStartError(err instanceof Error ? err.message : "Could not start hunt");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto aspect-video w-full max-w-4xl animate-pulse rounded-xl border-2 border-amber-800/40 bg-[#e8dcc8]/50 filter-hand-drawn" />
    );
  }

  if (!deskData) {
    return (
      <PartnerDeskWaitingState
        partnerId={ownerId}
        partnerName={partnerName ?? "Partner"}
      />
    );
  }

  if (completedData && completedUnlockedIds) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 py-4 px-3 sm:px-4">
        <p
          className="text-center text-sm font-display font-bold"
          style={{ color: "#3F220F" }}
        >
          Tap opened items on the desk to read each note again ✉️
        </p>

        <div className="relative w-full">
          <DeskCanvasFrame>
            <div className="relative h-full w-full">
              <HuntCelebrationParticles active />
              <CompletedPostmark completedAt={completedData.hunt.completed_at} />
              <DeskCanvas
                items={displayItems}
                mode="explore"
                unlockedIds={completedUnlockedIds}
                layoutDraggable
                onItemMove={handleLayoutMove}
                onUnlockItem={() => {}}
                hideSurfaceLabel
              />
            </div>
          </DeskCanvasFrame>
        </div>

        <HuntKeepsakeSpread
          targets={completedData.targets}
          completedAt={completedData.hunt.completed_at}
          huntId={completedData.hunt.id}
          layout="spread"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!huntData ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-stone-600 text-center max-w-sm">
            Explore their desk, solve mini-puzzles, and find all hidden
            messages. Use the hunt checklist for hints.
          </p>
          {startError && (
            <p className="text-sm text-red-600 text-center">{startError}</p>
          )}
          <Button onClick={handleStartHunt} disabled={startHunt.isPending}>
            Start hunt
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xs text-stone-500 lg:hidden">
            Drag items on the desk if they overlap · tap to interact
          </p>
          <div className="hidden sm:block lg:hidden">
            <HuntProgress found={foundCount} total={total} />
            <div className="mt-3">
              <HuntChecklist targets={huntData.targets} />
            </div>
          </div>
          <MobileHuntDrawer
            open={drawerOpen}
            onToggle={() => setDrawerOpen(!drawerOpen)}
          >
            <HuntProgress found={foundCount} total={total} />
            <div className="mt-3">
              <HuntChecklist targets={huntData.targets} compact />
            </div>
          </MobileHuntDrawer>
        </>
      )}

      <DeskEditorGrid
        desk={
          <DeskCanvas
            items={displayItems}
            mode={huntData ? "explore" : "view"}
            unlockedIds={unlockedIds}
            onUnlockItem={huntData ? handleUnlock : undefined}
            layoutDraggable={!!huntData}
            onItemMove={huntData ? handleLayoutMove : undefined}
            surfaceLabel="Partner's desk"
          />
        }
        sidebar={
          huntData ? (
            <div className="hidden lg:block space-y-3">
              <p className="text-xs text-stone-500">
                Drag items if they overlap. Click to solve puzzles.
              </p>
              <HuntProgress found={foundCount} total={total} />
              <HuntChecklist targets={huntData.targets} compact />
            </div>
          ) : (
            <div className="hidden lg:block" />
          )
        }
      />

      <FoundCelebration
        open={showCelebration}
        onClose={() => setShowCelebration(false)}
        targets={huntData?.targets ?? []}
      />
    </div>
  );
}

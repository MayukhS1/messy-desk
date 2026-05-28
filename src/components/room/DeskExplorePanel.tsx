"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { usePartnerDesk } from "@/lib/hooks/useDesk";
import {
  usePartnerHunt,
  useHuntMutations,
} from "@/lib/hooks/useHunt";
import { DeskCanvas } from "@/components/desk/DeskCanvas";
import { DeskEditorGrid } from "@/components/desk/DeskEditorGrid";
import {
  HuntChecklist,
  HuntProgress,
  MobileHuntDrawer,
} from "@/components/hunt/HuntChecklist";
import {
  FoundCelebration,
  HuntResultsPanel,
} from "@/components/hunt/HuntResultsPanel";
import { Button } from "@/components/ui/Button";
import { HUNT_TARGET_COUNT } from "@/lib/constants";
import type { DeskItem } from "@/types/database";

export function DeskExplorePanel({ ownerId }: { ownerId: string }) {
  const { data: deskData, isLoading } = usePartnerDesk(ownerId);
  const { data: huntState, refetch: refetchHunt } = usePartnerHunt(ownerId);
  const { startHunt, markFound } = useHuntMutations();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [startError, setStartError] = useState("");
  const [layoutPos, setLayoutPos] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    if (!deskData?.items) return;
    setLayoutPos((prev) => {
      const next = { ...prev };
      for (const item of deskData.items) {
        if (!next[item.id]) {
          next[item.id] = { x: item.pos_x, y: item.pos_y };
        }
      }
      return next;
    });
  }, [deskData?.items]);

  const displayItems: DeskItem[] = useMemo(() => {
    if (!deskData?.items) return [];
    return deskData.items.map((item) => ({
      ...item,
      pos_x: layoutPos[item.id]?.x ?? item.pos_x,
      pos_y: layoutPos[item.id]?.y ?? item.pos_y,
    }));
  }, [deskData?.items, layoutPos]);

  const huntData =
    huntState?.phase === "active"
      ? { hunt: huntState.hunt, targets: huntState.targets }
      : null;

  const completedData =
    huntState?.phase === "completed"
      ? { hunt: huntState.hunt, targets: huntState.targets }
      : null;

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
    setLayoutPos((prev) => ({ ...prev, [id]: { x, y } }));
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
    return <div className="h-[420px] animate-pulse rounded-xl bg-stone-100 lg:h-[520px]" />;
  }

  if (!deskData) {
    return (
      <p className="text-sm text-stone-500 text-center py-12">
        Partner hasn&apos;t published their desk yet.
      </p>
    );
  }

  if (completedData) {
    return (
      <div className="space-y-4">
        <HuntResultsPanel
          targets={completedData.targets}
          completedAt={completedData.hunt.completed_at}
        />
        <DeskEditorGrid
          desk={
            <DeskCanvas
              items={displayItems}
              mode="explore"
              unlockedIds={unlockedIds}
              layoutDraggable
              onItemMove={handleLayoutMove}
              surfaceLabel="Partner's desk"
            />
          }
        />
        <p className="text-xs text-center text-stone-500">
          Hunt finished — you can&apos;t start this hunt again. Drag items on
          the desk to get a better view.
        </p>
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

"use client";

import { useState } from "react";
import {
  useMyDesk,
  useDeskMutations,
  createDefaultItem,
} from "@/lib/hooks/useDesk";
import { DeskCanvas } from "@/components/desk/DeskCanvas";
import { DeskEditorGrid } from "@/components/desk/DeskEditorGrid";
import { DeskToolbar } from "@/components/desk/DeskToolbar";
import { ItemPalette } from "@/components/editor/ItemPalette";
import {
  ScrapbookInspector,
  ScrapbookInspectorIdle,
} from "@/components/editor/ScrapbookInspector";
import { PublishDialog, UnpublishDialog, ClearDeskDialog } from "@/components/editor/HuntTargetPicker";
import { HuntItemType, DeskItem } from "@/types/database";
import { evaluateDeskSetup, publishBlockedReason } from "@/lib/desk/readiness";
import { DESK_ITEM_BUDGET, HUNT_TARGET_COUNT } from "@/lib/constants";
import { useHuntForOwner } from "@/lib/hooks/useHunt";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function DeskEditPage() {
  const router = useRouter();
  const { data, isLoading, refetch } = useMyDesk();
  const { data: huntOnMyDesk } = useHuntForOwner();
  const { saveItem, deleteItem, clearAllItems, publishDesk, unpublishDesk } =
    useDeskMutations();
  const [editedItems, setEditedItems] = useState<DeskItem[] | null>(null);
  const [targetIds, setTargetIds] = useState<string[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const [showUnpublish, setShowUnpublish] = useState(false);
  const [showClearDesk, setShowClearDesk] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const desk = data?.desk;
  const serverItems = data?.items ?? [];
  const items = editedItems ?? serverItems;
  const resolvedTargetIds =
    targetIds ??
    serverItems.filter((i) => i.is_hunt_target).map((i) => i.id);
  const selected = items.find((i) => i.id === selectedId);
  const isPublished = desk?.status === "published";
  const setup = evaluateDeskSetup(items, resolvedTargetIds, isPublished);
  const { canPublish, completedPrerequisiteCount, totalPrerequisiteCount, targetCount } =
    setup;
  const publishHint = publishBlockedReason(items, resolvedTargetIds);
  const atTargetMax = targetCount >= HUNT_TARGET_COUNT;
  const hasActiveHunt = !!huntOnMyDesk;
  const canUnpublish = isPublished && !hasActiveHunt;
  const unpublishHint = hasActiveHunt
    ? "Your partner is hunting — unpublish is locked until they finish."
    : undefined;

  const addItem = async (type: HuntItemType) => {
    if (!desk || items.length >= DESK_ITEM_BUDGET) return;
    setActionError("");

    try {
      const newItem = createDefaultItem(
        desk.id,
        type,
        { x: 480 + Math.random() * 720, y: 200 + Math.random() * 480 },
        items.length
      );

      const id = await saveItem.mutateAsync(newItem);
      setEditedItems((prev) => [
        ...(prev ?? serverItems),
        { ...newItem, id } as DeskItem,
      ]);
      setSelectedId(id);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to add item"
      );
    }
  };

  const updateItem = async (updates: Partial<DeskItem>) => {
    if (!selected) return;
    const updated = { ...selected, ...updates };
    setEditedItems((prev) =>
      (prev ?? serverItems).map((i) => (i.id === selected.id ? updated : i))
    );
    await saveItem.mutateAsync(updated);
  };

  const toggleHuntTarget = async (enabled: boolean) => {
    if (!selected) return;

    if (enabled) {
      if (atTargetMax && !resolvedTargetIds.includes(selected.id)) return;
      setTargetIds((prev) => {
        const base = prev ?? resolvedTargetIds;
        if (base.includes(selected.id)) return base;
        return [...base, selected.id];
      });
      await updateItem({ is_hunt_eligible: true, is_hunt_target: true });
    } else {
      setTargetIds((prev) =>
        (prev ?? resolvedTargetIds).filter((id) => id !== selected.id)
      );
      await updateItem({ is_hunt_target: false, is_hunt_eligible: false });
    }
  };

  const moveItem = async (id: string, x: number, y: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const updated = { ...item, pos_x: x, pos_y: y };
    setEditedItems((prev) =>
      (prev ?? serverItems).map((i) => (i.id === id ? updated : i))
    );

    try {
      await saveItem.mutateAsync(updated);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to save position"
      );
    }
  };

  const removeItem = async () => {
    if (!selected) return;
    await deleteItem.mutateAsync(selected.id);
    setEditedItems((prev) => (prev ?? serverItems).filter((i) => i.id !== selected.id));
    setTargetIds((prev) =>
      (prev ?? resolvedTargetIds).filter((id) => id !== selected.id)
    );
    setSelectedId(null);
  };

  const handleClearDesk = async () => {
    if (!desk) return;
    setSaving(true);
    setActionError("");
    try {
      await clearAllItems.mutateAsync(desk.id);
      setEditedItems([]);
      setTargetIds([]);
      setSelectedId(null);
      setShowClearDesk(false);
      refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to clear desk"
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!desk || !canPublish) return;
    setSaving(true);
    setActionError("");
    try {
      await publishDesk.mutateAsync({ deskId: desk.id, targetIds: resolvedTargetIds });
      setShowPublish(false);
      setEditedItems(null);
      setTargetIds(null);
      refetch();
      router.push("/dashboard");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to publish desk"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublish = async () => {
    if (!desk || !canUnpublish) return;
    setSaving(true);
    setActionError("");
    try {
      await unpublishDesk.mutateAsync(desk.id);
      setShowUnpublish(false);
      setEditedItems(null);
      setTargetIds(null);
      refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to unpublish desk"
      );
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[380px] animate-pulse rounded-xl border-2 border-amber-800/30 bg-[#e8dcc8]/40 filter-hand-drawn" />
    );
  }

  if (!desk) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-stone-600 font-display">Your desk wasn&apos;t found.</p>
        <p className="text-sm text-stone-500">
          Try refreshing — if this persists, run migration 003 in Supabase SQL
          editor.
        </p>
        <Button onClick={() => refetch()}>Refresh</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#3F220F]">
            Edit your desk
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5 font-display">
            Drag items on the desk · click one to plan clues &amp; secrets
          </p>
        </div>
        <DeskToolbar
          onSave={async () => refetch()}
          onPublish={() => canPublish && setShowPublish(true)}
          onUnpublish={() => setShowUnpublish(true)}
          onClearDesk={() => setShowClearDesk(true)}
          saving={saving}
          isPublished={isPublished}
          canPublish={canPublish}
          canUnpublish={canUnpublish}
          completedSteps={completedPrerequisiteCount}
          totalSteps={totalPrerequisiteCount}
          itemCount={items.length}
          publishHint={publishHint ?? undefined}
          unpublishHint={unpublishHint}
        />
      </div>

      {actionError && (
        <p className="text-sm text-red-700 bg-red-50 border-2 border-red-200/80 rounded-lg px-3 py-2 filter-hand-drawn">
          {actionError}
        </p>
      )}

      <div className="rounded-xl border-2 border-amber-800/40 bg-[#e8dcc8]/20 p-3 sm:p-4 filter-hand-drawn">
        <DeskEditorGrid
          palette={<ItemPalette itemCount={items.length} onAddItem={addItem} />}
          desk={
            <DeskCanvas
              items={items}
              mode="edit"
              selectedId={selectedId}
              onSelectItem={setSelectedId}
              onItemMove={moveItem}
              huntTargetIds={resolvedTargetIds}
              showRulesCard
              showGrid
            />
          }
          sidebar={
            selected ? (
              <ScrapbookInspector
                item={selected}
                isHuntTarget={resolvedTargetIds.includes(selected.id)}
                targetCount={resolvedTargetIds.length}
                atTargetMax={atTargetMax}
                onUpdate={updateItem}
                onToggleHuntTarget={toggleHuntTarget}
                onDelete={removeItem}
              />
            ) : (
              <ScrapbookInspectorIdle
                completedSteps={completedPrerequisiteCount}
                totalSteps={totalPrerequisiteCount}
                itemCount={items.length}
              />
            )
          }
        />
      </div>

      <PublishDialog
        open={showPublish}
        canPublish={canPublish}
        blockedReason={publishHint}
        saving={saving}
        onConfirm={handlePublish}
        onCancel={() => setShowPublish(false)}
      />

      <UnpublishDialog
        open={showUnpublish}
        canUnpublish={canUnpublish}
        blockedReason={unpublishHint}
        saving={saving}
        onConfirm={handleUnpublish}
        onCancel={() => setShowUnpublish(false)}
      />

      <ClearDeskDialog
        open={showClearDesk}
        itemCount={items.length}
        clearing={saving}
        onConfirm={handleClearDesk}
        onCancel={() => setShowClearDesk(false)}
      />
    </div>
  );
}

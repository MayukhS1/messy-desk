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
import { ItemConfigPanel } from "@/components/editor/ItemConfigPanel";
import { EditorGuide } from "@/components/editor/EditorGuide";
import {
  HuntTargetPicker,
  PublishDialog,
  ClearDeskDialog,
} from "@/components/editor/HuntTargetPicker";
import { HuntItemType, DeskItem } from "@/types/database";
import { DESK_ITEM_BUDGET, HUNT_TARGET_COUNT } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function DeskEditPage() {
  const router = useRouter();
  const { data, isLoading, refetch } = useMyDesk();
  const { saveItem, deleteItem, clearAllItems, publishDesk } = useDeskMutations();
  const [editedItems, setEditedItems] = useState<DeskItem[] | null>(null);
  const [targetIds, setTargetIds] = useState<string[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPublish, setShowPublish] = useState(false);
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
  const canPublish = resolvedTargetIds.length === HUNT_TARGET_COUNT;

  const addItem = async (type: HuntItemType) => {
    if (!desk || items.length >= DESK_ITEM_BUDGET) return;
    setActionError("");

    try {
      const newItem = createDefaultItem(
        desk.id,
        type,
        { x: 40 + Math.random() * 200, y: 40 + Math.random() * 120 },
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
    try {
      await publishDesk.mutateAsync({ deskId: desk.id, targetIds: resolvedTargetIds });
      setShowPublish(false);
      setEditedItems(null);
      setTargetIds(null);
      refetch();
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-xl bg-stone-100" />;
  }

  if (!desk) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-stone-600">Your desk wasn&apos;t found.</p>
        <p className="text-sm text-stone-500">
          Try refreshing — if this persists, run migration 003 in Supabase SQL
          editor.
        </p>
        <Button onClick={() => refetch()}>Refresh</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-amber-950">
            Edit your desk
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Build a scavenger hunt — pick {HUNT_TARGET_COUNT} targets with
            hints, then publish
          </p>
        </div>
        <DeskToolbar
          onSave={async () => refetch()}
          onPublish={() => setShowPublish(true)}
          onClearDesk={() => setShowClearDesk(true)}
          saving={saving}
          targetCount={resolvedTargetIds.length}
          itemCount={items.length}
        />
      </div>

      <EditorGuide />

      {actionError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {actionError}
        </p>
      )}

      <DeskEditorGrid
        palette={<ItemPalette itemCount={items.length} onAddItem={addItem} />}
        desk={
          <DeskCanvas
            items={items}
            mode="edit"
            selectedId={selectedId}
            onSelectItem={setSelectedId}
            onItemMove={moveItem}
          />
        }
        sidebar={
          selected ? (
              <ItemConfigPanel
                item={selected}
                onUpdate={updateItem}
                onDelete={removeItem}
                isHuntTarget={resolvedTargetIds.includes(selected.id)}
              />
          ) : (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/80 p-4 text-sm text-stone-500 lg:border-0 lg:bg-transparent lg:p-0">
              <p className="font-medium text-stone-700 mb-1">No item selected</p>
              <p className="text-xs leading-relaxed">
                Tap an item on the desk to write its hidden message, set a
                clue label, and mark it hunt eligible.
              </p>
            </div>
          )
        }
      />

      <div className="rounded-xl border border-stone-200 bg-white/80 p-4 sm:p-5">
        <HuntTargetPicker
          items={items}
          selectedIds={resolvedTargetIds}
          onChange={setTargetIds}
        />
      </div>

      <PublishDialog
        open={showPublish}
        targetCount={resolvedTargetIds.length}
        canPublish={canPublish}
        saving={saving}
        onConfirm={handlePublish}
        onCancel={() => setShowPublish(false)}
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

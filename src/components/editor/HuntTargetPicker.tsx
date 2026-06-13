"use client";

import type { DeskItem } from "@/types/database";
import { HUNT_TARGET_COUNT } from "@/lib/constants";
import { ItemVisual } from "@/components/items/hunt/ItemVisual";
import { cn } from "@/lib/utils";

export function HuntTargetPicker({
  items,
  selectedIds,
  onChange,
}: {
  items: DeskItem[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const eligible = items.filter(
    (i) => i.is_hunt_eligible && i.hidden_message && i.label?.trim() && i.hint?.trim()
  );
  const atMax = selectedIds.length >= HUNT_TARGET_COUNT;
  const ready = selectedIds.length === HUNT_TARGET_COUNT;

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else if (!atMax) {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">
            Step 3 · Pick hunt targets
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-lg">
            Choose exactly {HUNT_TARGET_COUNT} items your partner must
            find. Each needs a label, hint, and hidden message.
          </p>
        </div>
        <div
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border",
            ready
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          )}
        >
          {selectedIds.length}/{HUNT_TARGET_COUNT} selected
          {ready ? " · Ready to publish" : ""}
        </div>
      </div>

      {eligible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center">
          <p className="text-sm text-stone-600">No eligible items yet</p>
          <p className="text-xs text-stone-500 mt-1">
            Add items with label + hint, or mark hunt eligible in the config
            panel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
          {eligible.map((item) => {
            const selected = selectedIds.includes(item.id);
            const disabled = !selected && atMax;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                disabled={disabled}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-all min-h-[56px]",
                  selected
                    ? "border-amber-600 bg-amber-50 shadow-sm ring-1 ring-amber-200"
                    : "border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/50",
                  disabled && "opacity-40 cursor-not-allowed hover:bg-white hover:border-stone-200"
                )}
              >
                <ItemVisual type={item.item_type} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {item.label || item.item_type}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">
                    {selected ? "Included in hunt" : "Tap to include"}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px]",
                    selected
                      ? "border-amber-700 bg-amber-700 text-white"
                      : "border-stone-300"
                  )}
                >
                  {selected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PublishDialog({
  open,
  onConfirm,
  onCancel,
  canPublish,
  blockedReason,
  saving,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  canPublish?: boolean;
  blockedReason?: string | null;
  saving?: boolean;
}) {
  if (!open) return null;

  const ready = canPublish ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3F220F]/40 p-4">
      <div className="w-full max-w-sm rounded-2xl border-2 border-amber-800/40 bg-amber-50 p-6 shadow-xl filter-hand-drawn">
        <h3 className="text-lg font-display font-bold mb-2 text-[#3F220F]">
          Publish your desk?
        </h3>
        <p className="text-sm text-[#3F220F]/80 mb-2 font-display">
          Your partner can explore your desk and hunt for{" "}
          {HUNT_TARGET_COUNT} hidden messages at their own pace.
        </p>
        <p
          className={cn(
            "text-xs mb-4 rounded-lg px-3 py-2 border-2 font-display",
            ready
              ? "bg-green-50 text-green-900 border-green-200/80"
              : "bg-amber-50 text-amber-900 border-amber-200/80"
          )}
        >
          {ready
            ? "Your room list is complete — you're good to go!"
            : blockedReason ??
              "Complete every step on your room list before publishing."}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl border-2 border-[#3F220F]/30 py-2.5 min-h-[44px] font-bold font-display text-[#3F220F] transition-colors hover:bg-[#FEF3C7] active:bg-[#FDE68A] filter-hand-drawn sketchy-focus"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 rounded-xl py-2.5 min-h-[44px] font-bold font-display filter-hand-drawn sketchy-focus transition-colors",
              ready
                ? "border-2 border-[#3F220F] bg-[#55702C] text-[#FDFBF7] hover:bg-[#466025] active:bg-[#3d5520]"
                : "border-stone-300 bg-stone-200 text-stone-500 cursor-not-allowed"
            )}
            onClick={onConfirm}
            disabled={!ready || saving}
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function UnpublishDialog({
  open,
  onConfirm,
  onCancel,
  canUnpublish,
  blockedReason,
  saving,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  canUnpublish?: boolean;
  blockedReason?: string | null;
  saving?: boolean;
}) {
  if (!open) return null;

  const allowed = canUnpublish ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3F220F]/40 p-4">
      <div className="w-full max-w-sm rounded-2xl border-2 border-amber-800/40 bg-amber-50 p-6 shadow-xl filter-hand-drawn">
        <h3 className="text-lg font-display font-bold mb-2 text-[#3F220F]">
          Unpublish your desk?
        </h3>
        <p className="text-sm text-[#3F220F]/80 mb-2 font-display">
          Your desk goes back to draft mode. Your partner won&apos;t be able to
          hunt until you publish again.
        </p>
        <p
          className={cn(
            "text-xs mb-4 rounded-lg px-3 py-2 border-2 font-display",
            allowed
              ? "bg-amber-50 text-amber-900 border-amber-200/80"
              : "bg-red-50 text-red-900 border-red-200/80"
          )}
        >
          {allowed
            ? "Your partner hasn&apos;t started hunting yet — safe to unpublish."
            : blockedReason ??
              "Unpublish is locked while your partner is mid-hunt."}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl border-2 border-[#3F220F]/30 py-2.5 min-h-[44px] font-bold font-display text-[#3F220F] transition-colors hover:bg-[#FEF3C7] active:bg-[#FDE68A] filter-hand-drawn sketchy-focus"
            onClick={onCancel}
            disabled={saving}
          >
            Keep published
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 rounded-xl border-2 py-2.5 min-h-[44px] font-bold font-display filter-hand-drawn sketchy-focus transition-colors",
              allowed
                ? "border-[#3F220F] bg-[#AE5B22] text-[#FDFBF7] hover:bg-[#9A4F1E] active:bg-[#8B4519]"
                : "border-stone-300 bg-stone-200 text-stone-500 cursor-not-allowed"
            )}
            onClick={onConfirm}
            disabled={!allowed || saving}
          >
            {saving ? "Unpublishing…" : "Unpublish"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ClearDeskDialog({
  open,
  itemCount,
  onConfirm,
  onCancel,
  clearing,
}: {
  open: boolean;
  itemCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  clearing?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Clear desk?</h3>
        <p className="text-sm text-stone-600 mb-4">
          This removes all {itemCount} item{itemCount === 1 ? "" : "s"} from
          your desk, including hidden messages and hunt target selections.
          This can&apos;t be undone.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl border border-stone-200 py-2.5 min-h-[44px] text-stone-700 font-medium transition-colors hover:bg-stone-100 hover:border-stone-300 active:bg-stone-200"
            onClick={onCancel}
            disabled={clearing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl bg-red-600 py-2.5 min-h-[44px] font-medium text-white transition-colors hover:bg-red-700 active:bg-red-800 disabled:opacity-50"
            onClick={onConfirm}
            disabled={clearing}
          >
            {clearing ? "Clearing…" : "Clear all items"}
          </button>
        </div>
      </div>
    </div>
  );
}

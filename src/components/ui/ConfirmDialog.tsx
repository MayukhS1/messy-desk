"use client";

import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-stone-600 mb-4">{description}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl border border-stone-200 py-2.5 min-h-[44px] text-stone-700 font-medium transition-colors hover:bg-stone-100 hover:border-stone-300 active:bg-stone-200"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 rounded-xl bg-red-600 py-2.5 min-h-[44px] font-medium text-white transition-colors hover:bg-red-700 active:bg-red-800 disabled:opacity-50"
            )}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

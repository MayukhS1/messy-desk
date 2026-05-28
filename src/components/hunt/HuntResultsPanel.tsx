"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { createPortal } from "react-dom";
import { MessageReveal } from "@/components/ui/MessageReveal";
import { ItemVisual } from "@/components/items/hunt/ItemVisual";
import type { HuntItemType } from "@/types/database";
import type { HuntTargetWithItem } from "@/lib/hooks/useHunt";
import { RelativeTime } from "@/components/ui/RelativeTime";

function fireConfetti() {
  const duration = 2500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
  confetti({ particleCount: 100, spread: 80, origin: { y: 0.55 } });
}

export function HuntResultsPanel({
  targets,
  completedAt,
  showConfetti,
}: {
  targets: HuntTargetWithItem[];
  completedAt?: string | null;
  showConfetti?: boolean;
}) {
  useEffect(() => {
    if (showConfetti) fireConfetti();
  }, [showConfetti]);

  return (
    <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-amber-50/50 p-4 sm:p-5 space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-green-800/70">
          Hunt completed
        </p>
        <h2 className="text-xl font-serif font-bold text-green-900 mt-1">
          You found every hidden message! 🎉
        </h2>
        {completedAt && (
          <p className="text-xs text-stone-500 mt-1">
            Finished <RelativeTime date={completedAt} />
          </p>
        )}
      </div>

      <ul className="space-y-4">
        {targets.map((t, i) => {
          const item = t.desk_item;
          const type = (item?.item_type ?? "sticky_note") as HuntItemType;
          return (
            <li
              key={t.id}
              className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <ItemVisual type={type} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-stone-800">
                    {item?.label || `Hidden item ${i + 1}`}
                  </p>
                  {item?.hint && (
                    <p className="text-xs text-stone-500 mt-0.5">
                      <span className="text-amber-800/80 font-medium">Hint: </span>
                      {item.hint}
                    </p>
                  )}
                </div>
              </div>
              <MessageReveal message={item?.hidden_message ?? ""} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function FoundCelebration({
  open,
  onClose,
  targets,
}: {
  open: boolean;
  onClose: () => void;
  targets: HuntTargetWithItem[];
}) {
  useEffect(() => {
    if (open) fireConfetti();
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">
          Hunt complete! 🎉
        </h2>
        <p className="text-sm text-stone-600 mb-4">
          Amazing — you unlocked every secret on this desk.
        </p>
        <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto">
          {targets.map((t, i) => (
            <div key={t.id} className="border-b border-stone-100 pb-3 last:border-0">
              <p className="text-xs font-medium text-stone-500 mb-1">
                {t.desk_item?.label || `Item ${i + 1}`}
              </p>
              {t.desk_item?.hint && (
                <p className="text-xs text-stone-400 mb-2">Hint: {t.desk_item.hint}</p>
              )}
              <MessageReveal message={t.desk_item?.hidden_message ?? ""} />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="w-full rounded-xl bg-amber-700 text-white py-2.5 min-h-[44px] hover:bg-amber-800 transition-colors"
          onClick={onClose}
        >
          View full results
        </button>
      </div>
    </div>,
    document.body
  );
}

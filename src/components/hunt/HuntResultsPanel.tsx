"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { createPortal } from "react-dom";
import { MessageReveal } from "@/components/ui/MessageReveal";
import type { HuntTargetWithItem } from "@/lib/hooks/useHunt";
import {
  HuntKeepsakeSpread,
  HuntKeepsakeMobile,
} from "@/components/hunt/HuntKeepsakeSpread";

function fireConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 50,
      origin: { x: 0, y: 0.6 },
      colors: ["#FCD34D", "#FDA4AF", "#AE5B22"],
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 50,
      origin: { x: 1, y: 0.6 },
      colors: ["#FCD34D", "#FDA4AF", "#AE5B22"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/** @deprecated Use side-by-side layout in DeskExplorePanel instead */
export function HuntResultsPanel({
  targets,
  completedAt,
  showConfetti,
  huntId,
}: {
  targets: HuntTargetWithItem[];
  completedAt?: string | null;
  showConfetti?: boolean;
  huntId?: string;
}) {
  useEffect(() => {
    if (showConfetti) fireConfetti();
  }, [showConfetti]);

  return (
    <HuntKeepsakeSpread
      targets={targets}
      completedAt={completedAt}
      huntId={huntId}
    />
  );
}

export { HuntKeepsakeSpread, HuntKeepsakeMobile };

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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#3F220F]/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border-2 border-amber-800/40 bg-amber-50 p-6 shadow-2xl max-h-[90vh] overflow-y-auto filter-hand-drawn">
        <div
          className="inline-block border-[3px] border-dashed px-3 py-1.5 mb-3 rotate-[-4deg] filter-hand-drawn"
          style={{ borderColor: "#AE5B22", color: "#3F220F" }}
        >
          <span className="font-display text-sm font-bold">Surprises Found! 💖</span>
        </div>
        <p className="text-sm font-display mb-4" style={{ color: "#3F220F" }}>
          Amazing — you unlocked every secret on this desk.
        </p>
        <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto">
          {targets.map((t, i) => (
            <div key={t.id}>
              <p className="text-xs font-bold font-display mb-1" style={{ color: "#895435" }}>
                {t.desk_item?.label || `Surprise ${i + 1}`}
              </p>
              <MessageReveal message={t.desk_item?.hidden_message ?? ""} />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="w-full border-2 py-2.5 min-h-[44px] font-bold font-display filter-hand-drawn sketchy-focus"
          style={{
            borderColor: "#3F220F",
            backgroundColor: "#55702C",
            color: "#FDFBF7",
          }}
          onClick={onClose}
        >
          Explore the keepsake desk
        </button>
      </div>
    </div>,
    document.body
  );
}

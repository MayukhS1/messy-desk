"use client";

import type { DeskItem } from "@/types/database";
import { HUNT_TARGET_COUNT } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ItemVisual } from "@/components/items/hunt/ItemVisual";
import { cn } from "@/lib/utils";

const INK = "#3F220F";

export function ScrapbookInspectorIdle({
  completedSteps,
  totalSteps,
  itemCount,
}: {
  completedSteps: number;
  totalSteps: number;
  itemCount: number;
}) {
  return (
    <div
      className="relative h-full min-h-[280px] border-2 border-amber-800/40 bg-amber-50/90 p-5 filter-hand-drawn shadow-md"
      style={{
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 27px, rgba(63,34,15,0.08) 27px, rgba(63,34,15,0.08) 28px)",
      }}
    >
      <div
        className="absolute -top-2 left-6 h-5 w-14 border opacity-80 -rotate-3"
        style={{ borderColor: INK, backgroundColor: "rgba(252,211,77,0.7)" }}
        aria-hidden
      />
      <p
        className="font-display text-base font-bold leading-relaxed mt-2"
        style={{ color: INK }}
      >
        Click an item on the desk to write a secret note, add a clue, or set it
        as a hunt target! ✍️
      </p>
      <div
        className="mt-4 inline-flex items-center gap-2 border-2 px-3 py-1.5 text-xs font-bold font-display filter-hand-drawn"
        style={{
          borderColor: INK,
          backgroundColor:
            completedSteps >= totalSteps ? "#d1fae5" : "#FEF3C7",
          color: INK,
        }}
      >
        📋 {completedSteps}/{totalSteps} room list steps
        {itemCount > 0 && (
          <span className="opacity-60">· {itemCount} items on desk</span>
        )}
      </div>
    </div>
  );
}

export function ScrapbookInspector({
  item,
  isHuntTarget,
  targetCount,
  atTargetMax,
  onUpdate,
  onToggleHuntTarget,
  onDelete,
}: {
  item: DeskItem;
  isHuntTarget: boolean;
  targetCount: number;
  atTargetMax: boolean;
  onUpdate: (updates: Partial<DeskItem>) => void;
  onToggleHuntTarget: (enabled: boolean) => void;
  onDelete: () => void;
}) {
  const unlock = item.unlock_config;
  const canMarkTarget = isHuntTarget || !atTargetMax;

  return (
    <div
      className="relative border-2 border-amber-800/40 bg-amber-50/95 p-4 filter-hand-drawn shadow-md"
      style={{
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 27px, rgba(63,34,15,0.08) 27px, rgba(63,34,15,0.08) 28px)",
      }}
    >
      <div
        className="absolute -top-2 right-6 h-5 w-12 border opacity-75 rotate-2"
        style={{ borderColor: INK, backgroundColor: "rgba(167,243,208,0.65)" }}
        aria-hidden
      />

      <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-dashed border-[#3F220F]/20">
        <ItemVisual type={item.item_type} size={40} />
        <div>
          <h3 className="font-display text-sm font-bold capitalize" style={{ color: INK }}>
            {item.item_type.replace("_", " ")}
          </h3>
          <p className="text-[11px]" style={{ color: `${INK}88` }}>
            Cozy item planner
          </p>
        </div>
      </div>

      <label
        className={cn(
          "flex items-start gap-3 rounded-lg border-2 p-3 mb-4 cursor-pointer filter-hand-drawn transition-colors",
          isHuntTarget ? "bg-yellow-100/80" : "bg-white/60",
          !canMarkTarget && "opacity-50 cursor-not-allowed"
        )}
        style={{ borderColor: `${INK}44` }}
      >
        <input
          type="checkbox"
          checked={isHuntTarget}
          disabled={!canMarkTarget}
          onChange={(e) => onToggleHuntTarget(e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-2 accent-[#DD954B]"
          style={{ borderColor: INK }}
        />
        <span>
          <span className="text-sm font-bold font-display block" style={{ color: INK }}>
            🎯 Mark as Hunt Target
          </span>
          <span className="text-xs" style={{ color: `${INK}88` }}>
            {atTargetMax && !isHuntTarget
              ? `${HUNT_TARGET_COUNT} targets already placed — unmark one first`
              : `${targetCount}/${HUNT_TARGET_COUNT} targets on desk`}
          </span>
        </span>
      </label>

      {isHuntTarget && (
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-bold font-display" style={{ color: INK }}>
              Clue label
            </label>
            <Input
              value={item.label ?? ""}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Something caffeinated…"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-bold font-display" style={{ color: INK }}>
              Hint for partner
            </label>
            <Input
              value={item.hint ?? ""}
              onChange={(e) => onUpdate({ hint: e.target.value })}
              placeholder="Look near the corner…"
              className="mt-1"
            />
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="text-xs font-bold font-display" style={{ color: INK }}>
          Secret locked message
        </label>
        <Textarea
          value={item.hidden_message}
          onChange={(e) => onUpdate({ hidden_message: e.target.value })}
          placeholder={
            isHuntTarget
              ? "They unlock this after finding the item…"
              : "Optional easter egg message…"
          }
          className="mt-1 min-h-[88px]"
        />
      </div>

      {unlock.type === "pin" && (
        <div className="mb-4">
          <label className="text-xs font-bold font-display" style={{ color: INK }}>
            PIN unlock (4 digits)
          </label>
          <Input
            value={unlock.pin ?? ""}
            maxLength={4}
            onChange={(e) =>
              onUpdate({ unlock_config: { ...unlock, pin: e.target.value } })
            }
            className="mt-1"
          />
        </div>
      )}

      {unlock.type === "combination" && (
        <div className="mb-4">
          <label className="text-xs font-bold font-display" style={{ color: INK }}>
            Combination (3 digits)
          </label>
          <Input
            value={unlock.combination ?? ""}
            maxLength={3}
            onChange={(e) =>
              onUpdate({
                unlock_config: { ...unlock, combination: e.target.value },
              })
            }
            className="mt-1"
          />
        </div>
      )}

      <button
        type="button"
        onClick={onDelete}
        className="w-full border-2 px-3 py-2 text-sm font-bold font-display filter-hand-drawn sketchy-focus transition-transform hover:scale-[1.02] active:scale-95"
        style={{
          borderColor: INK,
          backgroundColor: "#AE5B22",
          color: "#FDFBF7",
        }}
      >
        Remove from desk
      </button>
    </div>
  );
}

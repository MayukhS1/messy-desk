"use client";

import type { DeskItem } from "@/types/database";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ItemVisual } from "@/components/items/hunt/ItemVisual";

export function ItemConfigPanel({
  item,
  onUpdate,
  onDelete,
  isHuntTarget,
}: {
  item: DeskItem;
  onUpdate: (updates: Partial<DeskItem>) => void;
  onDelete: () => void;
  isHuntTarget?: boolean;
}) {
  const unlock = item.unlock_config;
  const showHuntFields = item.is_hunt_eligible || isHuntTarget;

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-white/80 p-4 lg:border-0 lg:bg-transparent lg:p-0">
      <div className="flex items-center gap-3">
        <ItemVisual type={item.item_type} size={36} />
        <div>
          <h3 className="text-sm font-semibold text-stone-800">
            Step 2 · Configure item
          </h3>
          <p className="text-xs text-stone-500 capitalize">
            {item.item_type.replace("_", " ")}
          </p>
        </div>
      </div>

      {showHuntFields ? (
        <>
          <div className="rounded-lg bg-amber-50/80 border border-amber-200/60 px-3 py-2 text-xs text-amber-900/90">
            <strong>Hunt target:</strong> add a clue label and hint so your
            partner can find this item on the desk.
          </div>
          <div>
            <label className="text-xs font-medium text-stone-600">
              Clue label <span className="text-red-500">*</span>
              <span className="font-normal text-stone-400">
                {" "}
                (shown on hunt checklist)
              </span>
            </label>
            <Input
              value={item.label ?? ""}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Something caffeinated…"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-600">
              Hint <span className="text-red-500">*</span>
              <span className="font-normal text-stone-400">
                {" "}
                (shown in partner&apos;s hunt list)
              </span>
            </label>
            <Input
              value={item.hint ?? ""}
              onChange={(e) => onUpdate({ hint: e.target.value })}
              placeholder="Look near the corner…"
              className="mt-1"
            />
          </div>
        </>
      ) : (
        <div className="rounded-lg bg-stone-50 border border-stone-200 px-3 py-2 text-xs text-stone-600">
          Not a hunt target — only the hidden message matters. Check
          &ldquo;Hunt eligible&rdquo; below if you want to add clues and hints.
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-stone-600">
          Hidden message <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={item.hidden_message}
          onChange={(e) => onUpdate({ hidden_message: e.target.value })}
          placeholder={
            showHuntFields
              ? "Secret note they unlock after finding this item…"
              : "Optional easter egg — no hunt clues needed…"
          }
          className="mt-1"
        />
      </div>

      {unlock.type === "pin" && (
        <div>
          <label className="text-xs font-medium text-stone-600">PIN (4 digits)</label>
          <Input
            value={unlock.pin ?? ""}
            maxLength={4}
            onChange={(e) =>
              onUpdate({
                unlock_config: { ...unlock, pin: e.target.value },
              })
            }
            className="mt-1"
          />
        </div>
      )}

      {unlock.type === "combination" && (
        <div>
          <label className="text-xs font-medium text-stone-600">
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

      <label className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50/80 p-3 cursor-pointer hover:border-amber-300 transition-colors">
        <input
          type="checkbox"
          checked={item.is_hunt_eligible}
          onChange={(e) => onUpdate({ is_hunt_eligible: e.target.checked })}
          className="mt-0.5 rounded"
        />
        <span>
          <span className="text-sm font-medium text-stone-800 block">
            Hunt eligible
          </span>
          <span className="text-xs text-stone-500">
            Allow this item to be picked as a hunt target (requires label +
            hint)
          </span>
        </span>
      </label>

      <Button variant="danger" size="sm" className="w-full" onClick={onDelete}>
        Remove item
      </Button>
    </div>
  );
}

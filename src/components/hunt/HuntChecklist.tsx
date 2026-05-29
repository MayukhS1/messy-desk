"use client";

import type { HuntTarget } from "@/types/database";
import { cn } from "@/lib/utils";
import { HuntProgress as HuntHeartProgress } from "./HuntHeartProgress";

export { HuntHeartProgress as HuntProgress };

type HuntTargetWithItem = HuntTarget & {
  desk_item?: {
    label?: string | null;
    hint?: string | null;
    item_type?: string;
  };
};

export function HuntChecklist({
  targets,
  compact,
}: {
  targets: HuntTargetWithItem[];
  compact?: boolean;
}) {
  const hasAnyHints = targets.some(
    (t) => !t.found_at && t.desk_item?.hint?.trim()
  );

  return (
    <div className="space-y-2">
      {hasAnyHints && (
        <p className="text-xs text-stone-500">
          Hints help you find each item on the desk
        </p>
      )}
      <ul className={cn("space-y-2", compact && "space-y-1.5")}>
        {targets.map((target, i) => {
          const found = !!target.found_at;
          const label =
            target.desk_item?.label || `Hidden item ${i + 1}`;
          const hint = target.desk_item?.hint?.trim();

          return (
            <li
              key={target.id}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm border",
                found
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-white border-stone-200 text-stone-700"
              )}
            >
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5">{found ? "✓" : "○"}</span>
                <div className="min-w-0 flex-1">
                  <span className={cn("font-medium", found && "line-through opacity-80")}>
                    {label}
                  </span>
                  {!found && hint && (
                    <p
                      className={cn(
                        "mt-1 text-stone-500 leading-snug",
                        compact ? "text-xs" : "text-sm"
                      )}
                    >
                      <span className="font-medium text-amber-800/80">
                        Hint:{" "}
                      </span>
                      {hint}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


export function MobileHuntDrawer({
  open,
  onToggle,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 right-4 z-40 sm:hidden rounded-full bg-amber-700 text-white px-4 py-3 shadow-lg min-h-[48px]"
        onClick={onToggle}
      >
        Hunt list
      </button>
      {open && (
        <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden bg-white rounded-t-2xl border-t border-stone-200 p-4 max-h-[50vh] overflow-y-auto shadow-xl">
          {children}
        </div>
      )}
    </>
  );
}

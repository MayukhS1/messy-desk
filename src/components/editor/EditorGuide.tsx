"use client";

import { HUNT_TARGET_COUNT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Add items",
    detail: "Place at least 5–6 objects on your desk and drag them apart.",
  },
  {
    title: "Hunt targets",
    detail: `Mark exactly ${HUNT_TARGET_COUNT} items as hunt eligible — each needs a label, hint, and secret message.`,
  },
  {
    title: "Extra items",
    detail: "Non-hunt items only need a hidden message (optional easter eggs).",
  },
  {
    title: "Publish",
    detail: "Your partner hunts using hints, solves puzzles, and unlocks notes.",
  },
] as const;

export function EditorGuide({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 border-amber-800/25 bg-yellow-50/70 p-4 sm:p-5 filter-hand-drawn",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2 max-w-xl">
          <p className="text-xs font-display uppercase tracking-wider text-muted">
            The game
          </p>
          <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">
            Build a scavenger hunt on your messy desk
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            Pick{" "}
            <strong className="font-medium text-foreground">
              {HUNT_TARGET_COUNT} hunt targets
            </strong>
            . Each target needs a clue label, a hint (shown in their checklist), and a
            secret message. Other desk items can hold bonus messages without hints.
          </p>
        </div>
        <div className="shrink-0 border-2 border-amber-800/20 bg-surface/80 px-4 py-3 text-center sm:min-w-[140px] filter-hand-drawn rotate-[1deg]">
          <p className="text-2xl font-display font-bold text-primary">
            {HUNT_TARGET_COUNT}
          </p>
          <p className="text-xs text-muted">hunt targets</p>
        </div>
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="flex gap-3 rounded-lg bg-surface/70 border border-amber-800/15 px-3 py-2.5 filter-hand-drawn"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              <p className="text-xs text-muted leading-snug mt-0.5">
                {step.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

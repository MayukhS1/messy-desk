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
        "rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-orange-50/50 p-4 sm:p-5",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/70">
            The game
          </p>
          <h2 className="font-serif text-lg font-bold text-amber-950 sm:text-xl">
            Build a scavenger hunt on your messy desk
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Pick{" "}
            <strong className="font-medium text-amber-900">
              {HUNT_TARGET_COUNT} hunt targets
            </strong>
            . Each target needs a <strong>clue label</strong>, a{" "}
            <strong>hint</strong> (shown in their checklist), and a{" "}
            <strong>secret message</strong>. Other desk items can hold bonus
            messages without hints.
          </p>
        </div>
        <div className="shrink-0 rounded-xl bg-white/70 border border-amber-100 px-4 py-3 text-center sm:min-w-[140px]">
          <p className="text-2xl font-serif font-bold text-amber-800">
            {HUNT_TARGET_COUNT}
          </p>
          <p className="text-xs text-stone-500">hunt targets</p>
        </div>
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="flex gap-3 rounded-xl bg-white/60 border border-stone-200/60 px-3 py-2.5"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-700 text-xs font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-stone-800">{step.title}</p>
              <p className="text-xs text-stone-500 leading-snug mt-0.5">
                {step.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

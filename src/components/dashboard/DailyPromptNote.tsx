"use client";

import { cn } from "@/lib/utils";
import { useStableRotation } from "@/lib/motion/useStableRotation";

const PROMPTS = [
  (name: string) => `Have you left a secret note on ${name}'s desk today?`,
  (name: string) => `When did you last peek at your shared journal with ${name}?`,
  (name: string) => `Something small to hide for ${name} to find?`,
];

export function DailyPromptNote({
  partnerName,
  className,
}: {
  partnerName?: string;
  className?: string;
}) {
  const rotation = useStableRotation(-3, 1);
  const name = partnerName?.split(" ")[0] ?? "your partner";
  const promptIndex = new Date().getDate() % PROMPTS.length;
  const prompt = PROMPTS[promptIndex](name);

  return (
    <aside
      className={cn(
        "relative max-w-[220px] p-4 bg-pink-100/90 text-amber-950 border-2 border-pink-300/50 shadow-md filter-hand-drawn",
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-label="Daily prompt"
    >
      <div
        className="absolute -top-2.5 left-[18%] w-14 h-5 bg-pink-200/70 border border-pink-300/60 filter-hand-drawn -rotate-[6deg]"
        aria-hidden
      />
      <p className="text-[10px] uppercase tracking-wider text-pink-800/70 font-display mb-1">
        Today&apos;s nudge
      </p>
      <p className="text-sm font-display leading-snug">{prompt}</p>
    </aside>
  );
}

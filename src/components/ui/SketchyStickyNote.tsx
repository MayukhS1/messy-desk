"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSketchWobble } from "@/lib/motion/useSketchWobble";
import { useStableRotation } from "@/lib/motion/useStableRotation";

export function SketchyStickyNote({
  children,
  className,
  tapeColor = "red",
}: {
  children: ReactNode;
  className?: string;
  tapeColor?: "red" | "mint" | "peach";
}) {
  const { onMouseEnter, onMouseLeave } = useSketchWobble();
  const rotation = useStableRotation(-2, 2);

  const tapeClasses = {
    red: "bg-red-200/60 border-red-300",
    mint: "bg-accent-mint/60 border-emerald-300",
    peach: "bg-accent-peach/60 border-orange-300",
  };

  return (
    <div
      className={cn(
        "relative p-5 bg-yellow-50 text-amber-900 border-2 border-amber-800/60 filter-hand-drawn shadow-md",
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 backdrop-blur-xs border filter-hand-drawn -rotate-[4deg]",
          tapeClasses[tapeColor]
        )}
        aria-hidden
      />
      <div className="font-display text-lg leading-relaxed">{children}</div>
    </div>
  );
}

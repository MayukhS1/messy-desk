"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSketchWobble } from "@/lib/motion/useSketchWobble";
import { useStableRotation } from "@/lib/motion/useStableRotation";

export function SketchyStickyNote({
  children,
  className,
  tapeColor = "red",
  rotation: fixedRotation,
  tapeRotation = -4,
  tapeOffset = "center",
}: {
  children: ReactNode;
  className?: string;
  tapeColor?: "red" | "mint" | "peach";
  /** Fixed tilt in degrees — overrides random rotation when set */
  rotation?: number;
  tapeRotation?: number;
  tapeOffset?: "left" | "center" | "right";
}) {
  const { onMouseEnter, onMouseLeave } = useSketchWobble();
  const randomRotation = useStableRotation(-2, 2);
  const rotation = fixedRotation ?? randomRotation;

  const tapeClasses = {
    red: "bg-red-200/60 border-red-300",
    mint: "bg-accent-mint/60 border-emerald-300",
    peach: "bg-accent-peach/60 border-orange-300",
  };

  const tapePosition = {
    left: "left-[22%] -translate-x-0",
    center: "left-1/2 -translate-x-1/2",
    right: "left-[78%] -translate-x-full",
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
          "absolute -top-3 w-20 h-6 backdrop-blur-xs border filter-hand-drawn",
          tapeClasses[tapeColor],
          tapePosition[tapeOffset]
        )}
        style={{ transform: `rotate(${tapeRotation}deg)` }}
        aria-hidden
      />
      <div className="font-display text-lg leading-relaxed">{children}</div>
    </div>
  );
}

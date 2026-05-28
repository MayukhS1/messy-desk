"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSketchWobble } from "@/lib/motion/useSketchWobble";
import { useStableRotation } from "@/lib/motion/useStableRotation";

export function SketchyCard({
  children,
  className,
  rotate = true,
}: {
  children: ReactNode;
  className?: string;
  rotate?: boolean;
}) {
  const { onMouseEnter, onMouseLeave } = useSketchWobble();
  const rotation = useStableRotation(-1.5, 1.5);

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-amber-800/60 bg-surface/95 p-5 shadow-md filter-hand-drawn",
        className
      )}
      style={rotate ? { transform: `rotate(${rotation}deg)` } : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}

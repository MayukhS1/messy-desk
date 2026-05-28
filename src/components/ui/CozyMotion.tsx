"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useStableRotation } from "@/lib/motion/useStableRotation";
import { cn } from "@/lib/utils";

export const CozyMotion = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    hoverLift?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
  }
>(function CozyMotion(
  { children, className, hoverLift = true, style, onClick },
  ref
) {
  const reduceMotion = useReducedMotion();
  const rotation = useStableRotation(-3, 3);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className} style={style} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={style}
      onClick={onClick}
      whileHover={
        hoverLift
          ? {
              scale: 1.05,
              rotate: rotation,
              boxShadow: "0px 10px 15px rgba(0,0,0,0.1)",
            }
          : undefined
      }
      whileTap={{
        scale: 0.97,
        boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {children}
    </motion.div>
  );
});

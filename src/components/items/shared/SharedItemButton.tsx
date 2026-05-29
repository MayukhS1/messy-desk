"use client";

import { ReactNode, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStableRotation } from "@/lib/motion/useStableRotation";

export function SharedItemButton({
  children,
  label,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const [pressed, setPressed] = useState(false);
  const reduceMotion = useReducedMotion();
  const rotation = useStableRotation(-3, 3);

  const classes = cn(
    "relative flex flex-col items-center gap-0.5 p-1 min-h-[72px] min-w-[72px] sketchy-focus cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sunflower focus-visible:ring-offset-2",
    disabled && "cursor-not-allowed opacity-40",
    className
  );

  const content = (
    <span className={cn("transition-transform", pressed && "scale-95")}>
      {children}
    </span>
  );

  if (reduceMotion || disabled) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        aria-label={label}
        className={classes}
      >
        {content}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      aria-label={label}
      className={classes}
      whileHover={{
        scale: 1.05,
        rotate: rotation,
        boxShadow: "0px 10px 15px rgba(0,0,0,0.1)",
      }}
      whileTap={{
        scale: 0.97,
        boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {content}
    </motion.button>
  );
}

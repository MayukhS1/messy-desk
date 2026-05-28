"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useStableRotation } from "@/lib/motion/useStableRotation";

type SafeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;

interface ButtonProps extends SafeButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, children, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    const rotation = useStableRotation(-2, 2);
    const classes = cn(
      "inline-flex items-center justify-center rounded-xl font-medium border-2 filter-hand-drawn sketchy-focus disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
      variant === "primary" &&
        "bg-primary text-white border-amber-900/40 hover:bg-primary-hover shadow-md",
      variant === "secondary" &&
        "bg-secondary text-foreground border-amber-800/30 hover:bg-accent-sunflower/40",
      variant === "ghost" &&
        "bg-transparent text-foreground border-transparent hover:bg-accent-peach/30 hover:border-amber-800/20",
      variant === "danger" &&
        "bg-destructive text-white border-red-800/40 hover:bg-destructive-hover",
      size === "sm" && "px-3 py-1.5 text-sm min-h-[44px] sm:min-h-0",
      size === "md" && "px-4 py-2 text-sm min-h-[44px] sm:min-h-0",
      size === "lg" && "px-6 py-3 text-base min-h-[48px]",
      className
    );

    if (reduceMotion || disabled) {
      return (
        <button ref={ref} disabled={disabled} className={classes} {...props}>
          {children}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
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
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

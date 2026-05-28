import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl border-2 border-amber-800/30 bg-surface px-4 py-2.5 text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent-sunflower/40 min-h-[44px] filter-hand-drawn sketchy-focus",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

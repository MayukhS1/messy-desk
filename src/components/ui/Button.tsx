import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" &&
            "bg-amber-700 text-white hover:bg-amber-800 shadow-md",
          variant === "secondary" &&
            "bg-stone-200 text-stone-800 hover:bg-stone-300",
          variant === "ghost" && "bg-transparent text-stone-700 hover:bg-stone-100",
          variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
          size === "sm" && "px-3 py-1.5 text-sm min-h-[44px] sm:min-h-0",
          size === "md" && "px-4 py-2 text-sm min-h-[44px] sm:min-h-0",
          size === "lg" && "px-6 py-3 text-base min-h-[48px]",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

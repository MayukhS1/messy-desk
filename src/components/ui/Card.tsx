import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

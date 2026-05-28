"use client";

import { cn } from "@/lib/utils";
import { useStableRotation } from "@/lib/motion/useStableRotation";

export function DeskSwitcher({
  active,
  onChange,
  partnerName,
}: {
  active: "mine" | "partner";
  onChange: (desk: "mine" | "partner") => void;
  partnerName?: string;
}) {
  const rotMine = useStableRotation(-2, 1);
  const rotPartner = useStableRotation(-1, 2);

  return (
    <div className="flex gap-2 justify-center">
      <button
        type="button"
        className={cn(
          "flex-1 max-w-[180px] py-2 px-3 text-sm font-display min-h-[44px] border-2 filter-hand-drawn shadow-sm sketchy-focus transition-colors",
          active === "mine"
            ? "bg-yellow-50 text-foreground border-amber-800/50 z-10"
            : "bg-surface/80 text-muted border-amber-800/20 hover:border-amber-800/35"
        )}
        style={{ transform: `rotate(${rotMine}deg)` }}
        onClick={() => onChange("mine")}
      >
        Your desk
      </button>
      <button
        type="button"
        className={cn(
          "flex-1 max-w-[180px] py-2 px-3 text-sm font-display min-h-[44px] border-2 filter-hand-drawn shadow-sm sketchy-focus transition-colors -ml-2",
          active === "partner"
            ? "bg-yellow-50 text-foreground border-amber-800/50 z-10"
            : "bg-surface/80 text-muted border-amber-800/20 hover:border-amber-800/35"
        )}
        style={{ transform: `rotate(${rotPartner}deg)` }}
        onClick={() => onChange("partner")}
      >
        {partnerName ? `${partnerName}'s desk` : "Partner's desk"}
      </button>
    </div>
  );
}

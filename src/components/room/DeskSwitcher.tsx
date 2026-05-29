"use client";

import { cn } from "@/lib/utils";
import { useStableRotation } from "@/lib/motion/useStableRotation";

function DeskTab({
  active,
  label,
  rotation,
  onClick,
  overlap,
}: {
  active: boolean;
  label: string;
  rotation: number;
  onClick: () => void;
  overlap?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex-1 max-w-[180px] py-2 px-3 text-sm font-display min-h-[44px] border-2 filter-hand-drawn shadow-sm sketchy-focus transition-all",
        overlap && "-ml-2",
        active
          ? "bg-yellow-50 text-foreground border-amber-800/60 z-10 shadow-md scale-[1.02]"
          : "bg-surface/80 text-muted border-amber-800/20 hover:border-amber-800/35"
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={onClick}
      aria-pressed={active}
    >
      {active && (
        <svg
          className="pointer-events-none absolute -inset-2 h-[calc(100%+14px)] w-[calc(100%+14px)]"
          viewBox="0 0 100 44"
          fill="none"
          aria-hidden
        >
          <ellipse
            cx="50"
            cy="22"
            rx="46"
            ry="18"
            stroke="#FCD34D"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="5 5"
            fill="none"
            opacity="0.95"
          />
        </svg>
      )}
      <span className="relative z-10 font-bold">{label}</span>
    </button>
  );
}

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
  const partnerLabel = partnerName
    ? `${partnerName.split(/\s+/)[0]}'s desk`
    : "Partner's desk";

  return (
    <div className="flex gap-2 justify-center">
      <DeskTab
        active={active === "mine"}
        label="Your desk"
        rotation={rotMine}
        onClick={() => onChange("mine")}
      />
      <DeskTab
        active={active === "partner"}
        label={partnerLabel}
        rotation={rotPartner}
        onClick={() => onChange("partner")}
        overlap
      />
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

export function PartnerPolaroid({
  partner,
  recentlyActive,
  compact,
}: {
  partner: Profile;
  recentlyActive?: boolean;
  compact?: boolean;
}) {
  const initial = partner.display_name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div
      className={cn(
        "relative shrink-0",
        recentlyActive && "animate-[sketch-wobble_4s_ease-in-out_infinite]"
      )}
      title={`With ${partner.display_name}`}
    >
      <div
        className={cn(
          "border-2 border-amber-800/40 bg-surface shadow-sm filter-hand-drawn rotate-[2deg]",
          compact ? "p-1" : "p-1.5"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center bg-gradient-to-br from-accent-peach/50 to-accent-sunflower/30 border border-amber-800/20 overflow-hidden",
            compact ? "h-8 w-8" : "h-10 w-10"
          )}
        >
          {partner.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={partner.avatar_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-display text-sm text-foreground">{initial}</span>
          )}
        </div>
        {!compact && (
          <p className="text-[9px] font-display text-center text-muted mt-1 leading-none">
            with {partner.display_name.split(" ")[0]}
          </p>
        )}
      </div>

      {recentlyActive && (
        <span
          className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent-sunflower border border-amber-800/30 shadow-sm"
          aria-label="Recently active"
        >
          <span className="absolute inset-0 rounded-full bg-accent-sunflower/60 animate-ping" />
        </span>
      )}
    </div>
  );
}

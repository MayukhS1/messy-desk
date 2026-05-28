"use client";

import { cn } from "@/lib/utils";

export function DeskSwitcher({
  active,
  onChange,
  partnerName,
}: {
  active: "mine" | "partner";
  onChange: (desk: "mine" | "partner") => void;
  partnerName?: string;
}) {
  return (
    <div className="flex rounded-xl bg-stone-100 p-1">
      <button
        type="button"
        className={cn(
          "flex-1 rounded-lg py-2 text-sm font-medium min-h-[44px] transition-colors",
          active === "mine"
            ? "bg-white text-amber-900 shadow-sm"
            : "text-stone-500"
        )}
        onClick={() => onChange("mine")}
      >
        Your desk
      </button>
      <button
        type="button"
        className={cn(
          "flex-1 rounded-lg py-2 text-sm font-medium min-h-[44px] transition-colors",
          active === "partner"
            ? "bg-white text-amber-900 shadow-sm"
            : "text-stone-500"
        )}
        onClick={() => onChange("partner")}
      >
        {partnerName ? `${partnerName}'s desk` : "Partner's desk"}
      </button>
    </div>
  );
}

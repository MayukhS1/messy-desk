"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const INK = "#3F220F";

const TAPE = {
  mint: "rgba(167,243,208,0.85)",
  peach: "rgba(254,205,211,0.85)",
  sun: "rgba(252,211,77,0.85)",
} as const;

export function PinnedSettingsNote({
  children,
  className,
  rotation = 0,
  tape = "sun",
  pinSide = "left",
}: {
  children: ReactNode;
  className?: string;
  rotation?: number;
  tape?: keyof typeof TAPE;
  pinSide?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "relative border-[2.5px] bg-[#FDFBF7] p-5 sm:p-6 shadow-md filter-hand-drawn",
        className
      )}
      style={{
        borderColor: INK,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div
        className={cn(
          "absolute -top-3 h-5 w-14 border-2 opacity-90",
          pinSide === "left" ? "left-6 -rotate-2" : "right-6 rotate-2"
        )}
        style={{ borderColor: `${INK}44`, backgroundColor: TAPE[tape] }}
        aria-hidden
      />
      <div
        className={cn(
          "absolute -top-4 flex h-5 w-5 items-center justify-center rounded-full border-[2.5px] shadow-sm",
          pinSide === "left" ? "left-10" : "right-10"
        )}
        style={{ borderColor: INK, backgroundColor: "#FCA5A5" }}
        aria-hidden
      >
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: INK }}
        />
      </div>
      {children}
    </div>
  );
}

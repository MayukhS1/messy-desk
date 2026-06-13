"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const INK = "#3F220F";

export function WoodToggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  id?: string;
}) {
  const reduceMotion = useReducedMotion();
  const toggleId = id ?? "wood-toggle";

  return (
    <div className="flex items-center justify-between gap-4">
      <label
        htmlFor={toggleId}
        className="font-display text-base font-bold leading-snug cursor-pointer select-none"
        style={{ color: INK }}
      >
        {label}
      </label>
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-9 w-[4.25rem] shrink-0 rounded-full border-[2.5px] filter-hand-drawn sketchy-focus",
          "cursor-pointer transition-shadow duration-200",
          checked
            ? "shadow-[inset_0_2px_6px_rgba(63,34,15,0.25)]"
            : "shadow-[inset_0_2px_4px_rgba(63,34,15,0.18)]"
        )}
        style={{
          borderColor: INK,
          backgroundColor: checked ? "rgba(252,211,77,0.45)" : "rgba(137,84,53,0.2)",
        }}
      >
        <span
          className="pointer-events-none absolute inset-x-1.5 top-1/2 h-0.5 -translate-y-1/2 rounded-full opacity-40"
          style={{ backgroundColor: INK }}
          aria-hidden
        />
        <motion.span
          className="absolute top-1 left-1 h-7 w-7 rounded-full border-[2.5px] filter-hand-drawn"
          style={{
            borderColor: INK,
            backgroundColor: checked ? "#FEF3C7" : "#E8DCC8",
            boxShadow: checked
              ? "0 2px 6px rgba(174,91,34,0.35)"
              : "0 2px 4px rgba(63,34,15,0.2)",
          }}
          animate={{ x: checked ? 28 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 26 }
          }
          aria-hidden
        />
        <span className="sr-only">{checked ? "On" : "Off"}</span>
      </button>
    </div>
  );
}

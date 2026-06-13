"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { evaluateDeskSetup } from "@/lib/desk/readiness";
import type { DeskItem } from "@/types/database";

const INK = "#3F220F";

function TaskCheckmark({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm filter-hand-drawn transition-colors duration-300",
        checked ? "bg-pink-200" : "bg-white"
      )}
      style={{ border: `2px solid ${INK}` }}
      aria-hidden
    >
      <svg
        viewBox="0 0 12 12"
        className={cn(
          "h-4 w-4 transition-all duration-300 ease-out",
          checked ? "scale-100 opacity-100" : "scale-75 opacity-0"
        )}
        aria-hidden
      >
        <path
          d="M2 6 L5 9 L10 3"
          stroke="#059669"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function DeskPlannerNotes({
  items,
  published,
  className,
}: {
  items: DeskItem[];
  published: boolean;
  className?: string;
}) {
  const { tasks } = useMemo(
    () => evaluateDeskSetup(items, null, published),
    [items, published]
  );

  return (
    <div
      className={cn(
        "relative w-full border-[2.5px] border-amber-800/40 bg-amber-50 p-6 pt-9 filter-hand-drawn shadow-lg",
        className
      )}
      aria-label="Your room setup progress"
    >
      <div className="absolute -top-4 left-0 right-0 flex justify-around px-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative flex flex-col items-center">
            <div
              className="h-1.5 w-0.5 rounded-full"
              style={{ backgroundColor: `${INK}55` }}
              aria-hidden
            />
            <div
              className="relative -mt-0.5 h-5 w-5 rounded-full bg-amber-50 shadow-inner"
              style={{
                border: `2px solid ${INK}`,
                boxShadow: `inset 0 1px 2px rgba(63,34,15,0.15), 0 1px 0 rgba(255,255,255,0.8)`,
              }}
              aria-hidden
            />
            <div
              className="h-1 w-0.5 rounded-full mt-px"
              style={{ backgroundColor: `${INK}44` }}
              aria-hidden
            />
          </div>
        ))}
      </div>

      <div
        className="absolute -top-2 left-7 h-4 w-4 rounded-full bg-red-500 shadow-sm z-10"
        style={{ border: `2px solid ${INK}` }}
        aria-hidden
      />

      <h3
        className="font-display text-xl font-bold mb-4 pb-2 border-b-2 border-dashed"
        style={{ color: INK, borderColor: `${INK}33` }}
      >
        Your room list
      </h3>

      <ul className="space-y-4 pointer-events-none select-none">
        {tasks.map((task) => (
          <li key={task.id}>
            <div className="flex w-full items-start gap-3.5 text-left">
              <TaskCheckmark checked={task.completed} />
              <span
                className={cn(
                  "text-base font-bold font-display leading-snug text-left transition-opacity duration-300",
                  task.completed ? "opacity-70" : "opacity-100"
                )}
                style={{ color: INK }}
              >
                {task.text}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

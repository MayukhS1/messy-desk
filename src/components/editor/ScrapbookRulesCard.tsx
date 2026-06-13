"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HUNT_TARGET_COUNT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const INK = "#3F220F";

const STEPS = [
  {
    title: "Stock the toybox",
    detail: "Tap an item to place it on your desk, then drag to arrange.",
  },
  {
    title: "Pick hunt targets",
    detail: `Click any desk item and mark ${HUNT_TARGET_COUNT} as hunt targets with clues + hints.`,
  },
  {
    title: "Hide secret notes",
    detail: "Every item can hold a locked message your partner unlocks.",
  },
  {
    title: "Publish",
    detail: "When all targets are ready, publish for your partner to hunt!",
  },
] as const;

export function ScrapbookRulesCard({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("absolute top-2 left-2 z-30 max-w-[200px]", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 border-2 px-2.5 py-1.5 text-xs font-bold font-display filter-hand-drawn shadow-md sketchy-focus"
        style={{
          borderColor: INK,
          backgroundColor: "#FEF3C7",
          color: INK,
          transform: "rotate(-1.5deg)",
        }}
        aria-expanded={open}
      >
        <span aria-hidden>📖</span>
        Scrapbook rules
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-[#3F220F]/20 backdrop-blur-[1px]"
              aria-label="Close rules"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.96 }}
              className="absolute top-full left-0 z-50 mt-2 w-[min(320px,calc(100vw-2rem))] border-2 bg-amber-50 p-4 filter-hand-drawn shadow-xl"
              style={{ borderColor: INK }}
            >
              <h3
                className="font-display text-base font-bold mb-2"
                style={{ color: INK }}
              >
                How the hunt works
              </h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: `${INK}CC` }}>
                Pick{" "}
                <strong>{HUNT_TARGET_COUNT} hunt targets</strong> on your desk.
                Each needs a clue, hint, and secret message.
              </p>
              <ol className="space-y-2">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-2 text-xs">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ backgroundColor: "#DD954B", color: INK }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold font-display" style={{ color: INK }}>
                        {step.title}
                      </p>
                      <p style={{ color: `${INK}99` }}>{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

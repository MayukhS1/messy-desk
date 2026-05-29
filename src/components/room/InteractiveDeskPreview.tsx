"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const INK = "#3F220F";

function DeskOpenSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke={INK}
        strokeWidth="2"
        strokeOpacity="0.25"
      />
      <path
        d="M8 2 A6 6 0 0 1 14 8"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InteractiveDeskPreview({
  children,
  href = "/desk/edit",
  className,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;
    setLoading(true);
    const delay = reduceMotion ? 0 : 320;
    setTimeout(() => router.push(href), delay);
  };

  return (
    <div className={cn("relative flex h-full w-full flex-col rounded-xl", className)}>
      {/* Desk preview — display only, not a click target */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl pointer-events-none">
        {children}
      </div>

      {/* Sole click target */}
      <div className="relative z-30 flex shrink-0 justify-center pt-2 pb-1">
        <motion.button
          type="button"
          aria-label="Open workspace — tinker with your desk"
          aria-busy={loading}
          disabled={loading}
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "flex items-center gap-2 border-2 px-4 py-2 filter-hand-drawn sketchy-focus",
            "cursor-pointer disabled:cursor-wait outline-none",
            loading
              ? "shadow-md bg-yellow-100"
              : hovered
                ? "shadow-[0_6px_16px_rgba(63,34,15,0.22)] bg-[#fcd34d]"
                : "shadow-[0_4px_12px_rgba(63,34,15,0.15)] bg-[#fef3c7]"
          )}
          style={{ borderColor: INK }}
          animate={
            loading
              ? { scale: 1, rotate: 0 }
              : hovered && !reduceMotion
                ? { scale: 1.03, rotate: 1.5 }
                : { scale: 1, rotate: -0.5 }
          }
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          {loading ? (
            <DeskOpenSpinner />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M3 14 L3 4 L11 4 L15 8 L15 14 Z"
                stroke={INK}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M11 4 V8 H15" stroke={INK} strokeWidth="2" />
            </svg>
          )}
          <span
            className="text-sm font-bold font-display whitespace-nowrap"
            style={{ color: INK }}
          >
            {loading ? "Opening your desk…" : "Tinker with your desk →"}
          </span>
        </motion.button>
      </div>
    </div>
  );
}

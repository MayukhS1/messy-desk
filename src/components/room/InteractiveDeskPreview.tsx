"use client";

import { useState } from "react";
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

/** Loading + navigation — click only; hover is pure CSS / whileHover. */
export function TinkerDeskButton({
  href = "/desk/edit",
  className,
}: {
  href?: string;
  className?: string;
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;
    setLoading(true);
    const delay = reduceMotion ? 0 : 320;
    setTimeout(() => router.push(href), delay);
  };

  return (
    <motion.button
      type="button"
      aria-label="Open workspace — tinker with your desk"
      aria-busy={loading}
      disabled={loading}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 border-[2.5px] px-5 py-2.5 filter-hand-drawn sketchy-focus",
        "cursor-pointer disabled:cursor-wait outline-none transition-shadow duration-200",
        loading
          ? "bg-yellow-100 shadow-md"
          : "bg-[#fef3c7] shadow-[0_4px_12px_rgba(63,34,15,0.15)] hover:bg-[#fcd34d] hover:shadow-[0_6px_16px_rgba(63,34,15,0.22)]"
      )}
      style={{ borderColor: INK }}
      whileHover={
        !loading && !reduceMotion ? { scale: 1.03, rotate: 1 } : undefined
      }
      whileTap={!loading && !reduceMotion ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      {loading ? (
        <DeskOpenSpinner />
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M3 14 L3 4 L11 4 L15 8 L15 14 Z"
            stroke={INK}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M11 4 V8 H15" stroke={INK} strokeWidth="2.5" />
        </svg>
      )}
      <span
        className="text-sm font-bold font-display whitespace-nowrap"
        style={{ color: INK }}
      >
        {loading ? "Opening your desk…" : "Tinker with your desk →"}
      </span>
    </motion.button>
  );
}

/** @deprecated Use DeskPreviewFrame + TinkerDeskButton instead */
export function InteractiveDeskPreview({
  children,
  href = "/desk/edit",
  className,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative flex h-full w-full flex-col rounded-xl", className)}>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl pointer-events-none">
        {children}
      </div>
      <div className="relative z-30 flex shrink-0 justify-center pt-2 pb-1">
        <TinkerDeskButton href={href} />
      </div>
    </div>
  );
}

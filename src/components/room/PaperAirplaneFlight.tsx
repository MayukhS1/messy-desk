"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

const INK = "#3F220F";

export function PaperAirplaneFlight({
  onComplete,
  fromName,
}: {
  onComplete: () => void;
  fromName?: string;
}) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const ms = reduceMotion ? 800 : 2400;
    const id = window.setTimeout(onComplete, ms);
    return () => window.clearTimeout(id);
  }, [onComplete, reduceMotion]);

  if (reduceMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
        <p
          className="rounded-lg border-2 bg-yellow-100 px-4 py-2 text-sm font-bold font-display filter-hand-drawn shadow-lg"
          style={{ borderColor: INK, color: INK }}
        >
          {fromName ? `${fromName} sent a paper airplane ✈️` : "Paper airplane incoming ✈️"}
        </p>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-0"
        initial={{ x: "-10%", y: 0, rotate: -12, opacity: 0 }}
        animate={{
          x: ["-10%", "35%", "75%", "110%"],
          y: [0, -28, -12, 8],
          rotate: [-12, -8, 4, 16],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 2.4, ease: "easeInOut", times: [0, 0.35, 0.7, 1] }}
      >
        <svg width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden>
          <path
            d="M4 20 L52 4 L32 20 L52 36 L4 20 Z"
            fill="#FDFBF7"
            stroke={INK}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M32 20 L52 4" stroke={INK} strokeWidth="2" />
          <path d="M14 20 L32 20" stroke={INK} strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
        </svg>
      </motion.div>

      {fromName && (
        <motion.p
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-bold font-display"
          style={{ color: INK }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {fromName} nudged you ✈️
        </motion.p>
      )}
    </div>
  );
}

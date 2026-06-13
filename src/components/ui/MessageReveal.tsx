"use client";

import { motion } from "framer-motion";

const INK = "#3F220F";

export function MessageReveal({
  message,
  label,
}: {
  message: string;
  label?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0.5 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="relative border-2 bg-[#FDFBF7] p-4 filter-hand-drawn shadow-md"
      style={{
        borderColor: INK,
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 22px, rgba(63,34,15,0.07) 22px, rgba(63,34,15,0.07) 23px)",
      }}
    >
      <div
        className="absolute -top-2 left-4 h-4 w-10 border opacity-80 -rotate-2"
        style={{ borderColor: `${INK}44`, backgroundColor: "rgba(254,205,211,0.7)" }}
        aria-hidden
      />
      {label && (
        <p className="text-xs font-bold font-display mb-2" style={{ color: "#895435" }}>
          {label}
        </p>
      )}
      <p
        className="font-display text-base font-bold leading-relaxed whitespace-pre-wrap"
        style={{ color: INK }}
      >
        {message}
      </p>
    </motion.div>
  );
}

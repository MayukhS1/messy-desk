"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 10 + Math.random() * 80,
  delay: Math.random() * 1.2,
  duration: 3 + Math.random() * 2,
  char: i % 3 === 0 ? "♥" : i % 3 === 1 ? "✦" : "·",
}));

export function HuntCelebrationParticles({ active }: { active?: boolean }) {
  const [show, setShow] = useState(active ?? false);

  useEffect(() => {
    if (active) setShow(true);
  }, [active]);

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-lg">
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute text-sm font-display select-none"
          style={{ left: `${p.x}%`, top: "-8%", color: "#AE5B22" }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.85, 0],
            y: [0, 120, 200],
            rotate: [0, p.id % 2 === 0 ? 15 : -12],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
          onAnimationComplete={() => {
            if (p.id === PARTICLES.length - 1) setShow(false);
          }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
}

export function CompletedPostmark({
  completedAt,
  className,
}: {
  completedAt?: string | null;
  className?: string;
}) {
  return (
    <div
      className={`absolute top-3 right-3 z-20 pointer-events-none ${className ?? ""}`}
    >
      <div
        className="border-[3px] border-dashed px-4 py-2.5 text-center filter-hand-drawn shadow-md -rotate-[4deg]"
        style={{
          borderColor: "#AE5B22",
          backgroundColor: "rgba(253, 251, 247, 0.95)",
        }}
      >
        <p
          className="font-display text-sm font-bold leading-tight"
          style={{ color: "#AE5B22" }}
        >
          Surprises Found! 💖
        </p>
        {completedAt && (
          <p
            className="mt-0.5 text-[11px] font-display font-bold"
            style={{ color: "#3F220F" }}
          >
            Cleared with Love!
          </p>
        )}
      </div>
    </div>
  );
}

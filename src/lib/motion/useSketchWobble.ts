"use client";

import { useCallback, useRef } from "react";

const FREQUENCIES = [0.035, 0.04, 0.045, 0.05, 0.042, 0.038];

export function useSketchWobble() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

  const onMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = e.currentTarget;
    intervalRef.current = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % FREQUENCIES.length;
      el.style.setProperty("--sketch-frequency", String(FREQUENCIES[indexRef.current]));
    }, 150);
  }, []);

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    e.currentTarget.style.setProperty("--sketch-frequency", "0.04");
  }, []);

  return { onMouseEnter, onMouseLeave };
}

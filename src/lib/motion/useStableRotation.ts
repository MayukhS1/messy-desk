"use client";

import { useRef } from "react";

export function useStableRotation(min = -3, max = 3) {
  const rotationRef = useRef<number | null>(null);

  if (rotationRef.current === null) {
    rotationRef.current = min + Math.random() * (max - min);
  }

  return rotationRef.current;
}

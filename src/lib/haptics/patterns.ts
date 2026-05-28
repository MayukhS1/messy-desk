export const HAPTIC_PATTERNS: Record<string, number[]> = {
  heartbeat: [100, 50, 100, 50, 200],
  tap: [50],
  wave: [30, 30, 30, 30, 30, 30],
  pulse: [80, 40, 80],
  gentle: [20, 40, 20],
};

export function triggerHaptic(pattern: number[] = HAPTIC_PATTERNS.tap) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
    return true;
  }
  return false;
}

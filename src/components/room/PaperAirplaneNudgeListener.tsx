"use client";

import { usePaperAirplaneNudgeListener } from "@/lib/hooks/usePaperAirplaneNudgeListener";
import { PaperAirplaneFlight } from "./PaperAirplaneFlight";

/** Global overlay — listens for partner paper-airplane nudges */
export function PaperAirplaneNudgeListener() {
  const { incoming, dismiss } = usePaperAirplaneNudgeListener();

  if (!incoming) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <PaperAirplaneFlight
        fromName={incoming.fromName}
        onComplete={dismiss}
      />
    </div>
  );
}

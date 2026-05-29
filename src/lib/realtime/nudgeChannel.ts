import type { SupabaseClient } from "@supabase/supabase-js";

export const NUDGE_COOLDOWN_MS = 5 * 60 * 1000;

export type PaperAirplanePayload = {
  fromUserId: string;
  fromName: string;
  toUserId: string;
  sentAt: number;
};

export function nudgeChannelName(coupleId: string) {
  return `couple:${coupleId}:nudges`;
}

export function nudgeCooldownKey(coupleId: string) {
  return `messy-desk-nudge-cooldown-${coupleId}`;
}

export function getNudgeCooldownRemaining(coupleId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(nudgeCooldownKey(coupleId));
    if (!raw) return 0;
    const until = Number(raw);
    if (Number.isNaN(until)) return 0;
    return Math.max(0, until - Date.now());
  } catch {
    return 0;
  }
}

export function setNudgeCooldown(coupleId: string) {
  localStorage.setItem(
    nudgeCooldownKey(coupleId),
    String(Date.now() + NUDGE_COOLDOWN_MS)
  );
}

export async function sendPaperAirplaneNudge(
  supabase: SupabaseClient,
  coupleId: string,
  payload: PaperAirplanePayload
) {
  const channel = supabase.channel(nudgeChannelName(coupleId), {
    config: { broadcast: { self: false } },
  });

  return new Promise<void>((resolve, reject) => {
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const result = await channel.send({
          type: "broadcast",
          event: "paper_airplane",
          payload,
        });
        supabase.removeChannel(channel);
        if (result !== "ok") reject(new Error("Nudge send failed"));
        else resolve();
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        supabase.removeChannel(channel);
        reject(new Error("Could not connect to nudge channel"));
      }
    });
  });
}

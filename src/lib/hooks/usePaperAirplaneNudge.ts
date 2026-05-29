"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple, useProfile } from "@/lib/hooks/useProfile";
import {
  getNudgeCooldownRemaining,
  sendPaperAirplaneNudge,
  setNudgeCooldown,
  type PaperAirplanePayload,
} from "@/lib/realtime/nudgeChannel";

export function usePaperAirplaneNudge(partnerId: string) {
  const { data: couple } = useCouple();
  const { data: profile } = useProfile();
  const [sent, setSent] = useState(false);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [showFlight, setShowFlight] = useState(false);
  const [error, setError] = useState("");

  const coupleId = couple?.id;

  useEffect(() => {
    if (!coupleId) return;

    const tick = () => {
      setCooldownMs(getNudgeCooldownRemaining(coupleId));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [coupleId]);

  useEffect(() => {
    if (cooldownMs === 0) setSent(false);
  }, [cooldownMs]);

  const onCooldown = cooldownMs > 0;
  const disabled = !coupleId || !profile || sent || onCooldown;

  const sendNudge = useCallback(async () => {
    if (!coupleId || !profile || disabled) return;

    setError("");
    setSent(true);
    setShowFlight(true);

    const payload: PaperAirplanePayload = {
      fromUserId: profile.id,
      fromName: profile.display_name,
      toUserId: partnerId,
      sentAt: Date.now(),
    };

    try {
      const supabase = createClient();
      await sendPaperAirplaneNudge(supabase, coupleId, payload);
      setNudgeCooldown(coupleId);
      setCooldownMs(getNudgeCooldownRemaining(coupleId));
    } catch {
      setError("Could not send — try again in a moment.");
      setSent(false);
      setShowFlight(false);
    }
  }, [coupleId, profile, partnerId, disabled]);

  const dismissFlight = useCallback(() => setShowFlight(false), []);

  const cooldownLabel =
    cooldownMs > 0
      ? `${Math.ceil(cooldownMs / 60000)}m ${Math.ceil((cooldownMs % 60000) / 1000)}s`
      : "";

  return {
    sendNudge,
    sent,
    onCooldown,
    cooldownLabel,
    showFlight,
    dismissFlight,
    disabled,
    error,
  };
}

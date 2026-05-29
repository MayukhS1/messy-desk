"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple, useProfile } from "@/lib/hooks/useProfile";
import {
  nudgeChannelName,
  type PaperAirplanePayload,
} from "@/lib/realtime/nudgeChannel";
import { playPaperRustle } from "@/lib/audio/paperRustle";

export function usePaperAirplaneNudgeListener() {
  const { data: couple } = useCouple();
  const { data: profile } = useProfile();
  const [incoming, setIncoming] = useState<PaperAirplanePayload | null>(null);

  const dismiss = useCallback(() => setIncoming(null), []);

  useEffect(() => {
    if (!couple?.id || !profile?.id) return;

    const supabase = createClient();
    const channel = supabase
      .channel(nudgeChannelName(couple.id))
      .on("broadcast", { event: "paper_airplane" }, ({ payload }) => {
        const data = payload as PaperAirplanePayload;
        if (!data?.fromUserId || data.fromUserId === profile.id) return;
        if (data.toUserId && data.toUserId !== profile.id) return;

        playPaperRustle();
        setIncoming(data);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [couple?.id, profile?.id]);

  return { incoming, dismiss };
}

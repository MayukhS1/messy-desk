"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { HUNT_TARGET_COUNT } from "@/lib/constants";
import type { DeskItem, Hunt, HuntTarget } from "@/types/database";

export type HuntTargetWithItem = HuntTarget & {
  desk_item?: DeskItem | null;
};

export type PartnerHuntState =
  | { phase: "none" }
  | {
      phase: "active";
      hunt: Hunt;
      targets: HuntTargetWithItem[];
    }
  | {
      phase: "completed";
      hunt: Hunt;
      targets: HuntTargetWithItem[];
    };

async function fetchTargets(
  supabase: ReturnType<typeof createClient>,
  huntId: string
) {
  const { data: targets } = await supabase
    .from("hunt_targets")
    .select("*, desk_item:desk_items(*)")
    .eq("hunt_id", huntId)
    .order("sort_order");

  return (targets ?? []) as HuntTargetWithItem[];
}

export function usePartnerHunt(deskOwnerId?: string) {
  return useQuery({
    queryKey: ["partner-hunt", deskOwnerId],
    enabled: !!deskOwnerId,
    queryFn: async (): Promise<PartnerHuntState> => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { phase: "none" };

      const { data: hunts } = await supabase
        .from("hunts")
        .select("*")
        .eq("hunter_id", user.id)
        .eq("desk_owner_id", deskOwnerId!)
        .order("started_at", { ascending: false });

      if (!hunts?.length) return { phase: "none" };

      const completed = hunts.find((h) => h.status === "completed");
      if (completed) {
        const targets = await fetchTargets(supabase, completed.id);
        return { phase: "completed", hunt: completed as Hunt, targets };
      }

      const active = hunts.find((h) => h.status === "active");
      if (active) {
        const targets = await fetchTargets(supabase, active.id);
        return { phase: "active", hunt: active as Hunt, targets };
      }

      return { phase: "none" };
    },
  });
}

export function useActiveHunt(deskOwnerId?: string) {
  const q = usePartnerHunt(deskOwnerId);
  if (q.data?.phase === "active") {
    return {
      ...q,
      data: { hunt: q.data.hunt, targets: q.data.targets },
    };
  }
  return { ...q, data: null };
}

export function useHuntMutations() {
  const queryClient = useQueryClient();

  const startHunt = useMutation({
    mutationFn: async (deskOwnerId: string) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: existingCompleted } = await supabase
        .from("hunts")
        .select("id")
        .eq("hunter_id", user.id)
        .eq("desk_owner_id", deskOwnerId)
        .eq("status", "completed")
        .maybeSingle();

      if (existingCompleted) {
        throw new Error("You already completed this hunt!");
      }

      const { data: existingActive } = await supabase
        .from("hunts")
        .select("id")
        .eq("hunter_id", user.id)
        .eq("desk_owner_id", deskOwnerId)
        .eq("status", "active")
        .maybeSingle();

      if (existingActive) {
        return existingActive.id;
      }

      const { data: desk } = await supabase
        .from("desks")
        .select("id")
        .eq("owner_id", deskOwnerId)
        .eq("status", "published")
        .single();

      if (!desk) throw new Error("Desk not published");

      const { data: targetItems } = await supabase
        .from("desk_items")
        .select("id")
        .eq("desk_id", desk.id)
        .eq("is_hunt_target", true);

      if (!targetItems || targetItems.length < HUNT_TARGET_COUNT) {
        throw new Error(
          `Partner needs ${HUNT_TARGET_COUNT} hunt targets on their desk`
        );
      }

      const { data: hunt, error: huntError } = await supabase
        .from("hunts")
        .insert({
          hunter_id: user.id,
          desk_owner_id: deskOwnerId,
          status: "active",
        })
        .select()
        .single();

      if (huntError) throw huntError;

      const selected = targetItems.slice(0, HUNT_TARGET_COUNT);
      const rows = selected.map((item, i) => ({
        hunt_id: hunt.id,
        desk_item_id: item.id,
        sort_order: i,
      }));

      const { error: targetsError } = await supabase
        .from("hunt_targets")
        .insert(rows);

      if (targetsError) throw targetsError;

      return hunt.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-hunt"] });
      queryClient.invalidateQueries({ queryKey: ["hunt"] });
    },
  });

  const markFound = useMutation({
    mutationFn: async ({
      targetId,
      huntId,
    }: {
      targetId: string;
      huntId: string;
    }) => {
      const supabase = createClient();

      await supabase
        .from("hunt_targets")
        .update({ found_at: new Date().toISOString() })
        .eq("id", targetId);

      const { data: targets } = await supabase
        .from("hunt_targets")
        .select("found_at")
        .eq("hunt_id", huntId);

      const allFound = targets?.every((t) => t.found_at);

      if (allFound) {
        await supabase
          .from("hunts")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", huntId);
      }

      return { allFound: !!allFound };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-hunt"] });
      queryClient.invalidateQueries({ queryKey: ["hunt"] });
    },
  });

  return { startHunt, markFound };
}

export function useHuntForOwner() {
  return useQuery({
    queryKey: ["hunt-on-my-desk"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: hunt } = await supabase
        .from("hunts")
        .select("*")
        .eq("desk_owner_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (!hunt) return null;

      const { data: targets } = await supabase
        .from("hunt_targets")
        .select("found_at")
        .eq("hunt_id", hunt.id);

      const found = targets?.filter((t) => t.found_at).length ?? 0;

      return { hunt, found, total: targets?.length ?? HUNT_TARGET_COUNT };
    },
  });
}

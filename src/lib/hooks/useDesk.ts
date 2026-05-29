"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Desk, DeskItem, HuntItemType, UnlockConfig } from "@/types/database";
import { HUNT_ITEM_META } from "@/lib/constants";

export function useMyDesk() {
  return useQuery({
    queryKey: ["desk", "mine"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: desk, error: deskError } = await supabase
        .from("desks")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (deskError) throw deskError;
      if (!desk) return null;

      const { data: items } = await supabase
        .from("desk_items")
        .select("*")
        .eq("desk_id", desk.id)
        .order("z_index");

      return { desk: desk as Desk, items: (items ?? []) as DeskItem[] };
    },
  });
}

export function usePartnerDesk(ownerId?: string) {
  return useQuery({
    queryKey: ["desk", ownerId],
    enabled: !!ownerId,
    queryFn: async () => {
      const supabase = createClient();
      const { data: desk } = await supabase
        .from("desks")
        .select("*")
        .eq("owner_id", ownerId!)
        .eq("status", "published")
        .maybeSingle();

      if (!desk) return null;

      const { data: items } = await supabase
        .from("desk_items")
        .select("*")
        .eq("desk_id", desk.id)
        .order("z_index");

      return { desk: desk as Desk, items: (items ?? []) as DeskItem[] };
    },
  });
}

export function useDeskMutations() {
  const queryClient = useQueryClient();

  const saveItem = useMutation({
    mutationFn: async (item: Partial<DeskItem> & { desk_id: string }) => {
      const supabase = createClient();
      if (item.id) {
        const { error } = await supabase
          .from("desk_items")
          .update(item)
          .eq("id", item.id);
        if (error) throw error;
        return item.id;
      }
      const { data, error } = await supabase
        .from("desk_items")
        .insert(item)
        .select("id")
        .single();
      if (error) throw error;
      return data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["desk"] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("desk_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["desk"] });
    },
  });

  const clearAllItems = useMutation({
    mutationFn: async (deskId: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("desk_items")
        .delete()
        .eq("desk_id", deskId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["desk"] });
    },
  });

  const publishDesk = useMutation({
    mutationFn: async ({
      deskId,
      targetIds,
    }: {
      deskId: string;
      targetIds: string[];
    }) => {
      const supabase = createClient();

      await supabase
        .from("desk_items")
        .update({ is_hunt_target: false })
        .eq("desk_id", deskId);

      if (targetIds.length > 0) {
        await supabase
          .from("desk_items")
          .update({ is_hunt_target: true })
          .in("id", targetIds);
      }

      const { error } = await supabase
        .from("desks")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", deskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["desk"] });
    },
  });

  return { saveItem, deleteItem, clearAllItems, publishDesk };
}

export function createDefaultItem(
  deskId: string,
  type: HuntItemType,
  pos: { x: number; y: number },
  zIndex: number
): Omit<DeskItem, "id"> {
  const meta = HUNT_ITEM_META[type];
  const unlockConfig: UnlockConfig = {
    type: meta.defaultUnlock,
    pin: meta.defaultUnlock === "pin" ? "1234" : undefined,
    combination: meta.defaultUnlock === "combination" ? "000" : undefined,
    clicksRequired: meta.defaultUnlock === "sequence_clicks" ? 2 : undefined,
  };

  return {
    desk_id: deskId,
    item_type: type,
    pos_x: pos.x,
    pos_y: pos.y,
    rotation: Math.random() * 20 - 10,
    z_index: zIndex,
    scale: 1,
    unlock_config: unlockConfig,
    hidden_message: "",
    hint: null,
    is_hunt_eligible: false,
    is_hunt_target: false,
    media_url: null,
    label: null,
  };
}

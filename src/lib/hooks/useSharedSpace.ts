"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  JournalEntry,
  JournalLock,
  RelationshipStats,
  SharedSpaceItem,
  PlaylistTrack,
} from "@/types/database";

export function useSharedSpace() {
  return useQuery({
    queryKey: ["shared-space"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: couple } = await supabase
        .from("couples")
        .select("id")
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .maybeSingle();

      if (!couple) return { items: [], stats: null, coupleId: null };

      const [itemsRes, statsRes] = await Promise.all([
        supabase
          .from("shared_space_items")
          .select("*")
          .eq("couple_id", couple.id),
        supabase
          .from("relationship_stats")
          .select("*")
          .eq("couple_id", couple.id)
          .maybeSingle(),
      ]);

      return {
        coupleId: couple.id,
        items: (itemsRes.data ?? []) as SharedSpaceItem[],
        stats: statsRes.data as RelationshipStats | null,
      };
    },
  });
}

export function useJournalEntries(coupleId?: string) {
  return useQuery({
    queryKey: ["journal", coupleId],
    enabled: !!coupleId,
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("couple_id", coupleId!)
        .order("created_at", { ascending: false });

      return (data ?? []) as JournalEntry[];
    },
  });
}

export function useJournalLock(coupleId?: string) {
  return useQuery({
    queryKey: ["journal-lock", coupleId],
    enabled: !!coupleId,
    refetchInterval: 5000,
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("journal_locks")
        .select("*")
        .eq("couple_id", coupleId!)
        .maybeSingle();

      if (data && new Date(data.expires_at) < new Date()) {
        return null;
      }
      return data as JournalLock | null;
    },
  });
}

export function useJournalMutations(coupleId?: string) {
  const queryClient = useQueryClient();

  const acquireLock = useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !coupleId) throw new Error("Not ready");

      const expires = new Date(Date.now() + 30_000).toISOString();
      const { error } = await supabase.from("journal_locks").upsert({
        couple_id: coupleId,
        locked_by: user.id,
        expires_at: expires,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-lock"] });
    },
  });

  const saveEntry = useMutation({
    mutationFn: async (content: string) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !coupleId) throw new Error("Not ready");

      const { error } = await supabase.from("journal_entries").insert({
        couple_id: coupleId,
        author_id: user.id,
        content_md: content,
      });
      if (error) throw error;

      await supabase.rpc("refresh_relationship_stats", {
        p_couple_id: coupleId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["shared-space"] });
    },
  });

  const deleteEntry = useMutation({
    mutationFn: async (entryId: string) => {
      if (!coupleId) throw new Error("Not ready");
      const supabase = createClient();

      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", entryId)
        .eq("couple_id", coupleId);
      if (error) throw error;

      await supabase.rpc("refresh_relationship_stats", {
        p_couple_id: coupleId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["shared-space"] });
    },
  });

  const releaseLock = useMutation({
    mutationFn: async () => {
      if (!coupleId) return;
      const supabase = createClient();
      await supabase.from("journal_locks").delete().eq("couple_id", coupleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-lock"] });
    },
  });

  return { acquireLock, saveEntry, deleteEntry, releaseLock };
}

export function usePlaylist(coupleId?: string) {
  return useQuery({
    queryKey: ["playlist", coupleId],
    enabled: !!coupleId,
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("playlist_tracks")
        .select("*")
        .eq("couple_id", coupleId!)
        .order("sort_order");

      return (data ?? []) as PlaylistTrack[];
    },
  });
}

export function useUpdateSharedItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      config,
    }: {
      id: string;
      config: Record<string, unknown>;
    }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("shared_space_items")
        .update({ config, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shared-space"] });
    },
  });
}

export function useAddPlaylistTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      coupleId,
      title,
      storageUrl,
    }: {
      coupleId: string;
      title: string;
      storageUrl: string;
    }) => {
      const supabase = createClient();
      const { error } = await supabase.from("playlist_tracks").insert({
        couple_id: coupleId,
        title,
        storage_url: storageUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
    },
  });
}

export function useRemovePlaylistTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trackId: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("playlist_tracks")
        .delete()
        .eq("id", trackId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Couple } from "@/types/database";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });
}

export function useCouple() {
  return useQuery({
    queryKey: ["couple"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("couples")
        .select("*")
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .maybeSingle();

      return data as Couple | null;
    },
  });
}

export function usePartner() {
  return useQuery({
    queryKey: ["partner"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: couple } = await supabase
        .from("couples")
        .select("*")
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .maybeSingle();

      if (!couple?.user_b_id) return null;

      const partnerId =
        couple.user_a_id === user.id ? couple.user_b_id : couple.user_a_id;

      if (!partnerId) return null;

      const { data: partner } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", partnerId)
        .single();

      return partner as Profile;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<Pick<Profile, "display_name" | "avatar_url">>) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

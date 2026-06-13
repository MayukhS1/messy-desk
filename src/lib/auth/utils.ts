import type { User } from "@supabase/supabase-js";
import { getSiteUrl } from "@/lib/env/public";

export function isEmailVerified(user: User | null | undefined): boolean {
  if (!user) return false;
  return Boolean(user.email_confirmed_at);
}

export function authCallbackUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }
  return `${getSiteUrl()}/auth/callback`;
}

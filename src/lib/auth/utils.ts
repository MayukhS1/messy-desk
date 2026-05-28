import type { User } from "@supabase/supabase-js";

export function isEmailVerified(user: User | null | undefined): boolean {
  if (!user) return false;
  return Boolean(user.email_confirmed_at);
}

export function authCallbackUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }
  return `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`;
}

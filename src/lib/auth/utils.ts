import type { SupabaseClient, User } from "@supabase/supabase-js";

export function isEmailVerified(user: User | null | undefined): boolean {
  if (!user) return false;
  return Boolean(user.email_confirmed_at);
}

/** Supabase returns an obfuscated user (empty identities) when the email already exists. */
export function isObfuscatedSignupUser(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.identities == null || user.identities.length === 0;
}

export async function resendSignupConfirmation(
  supabase: SupabaseClient,
  email: string
) {
  return supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: authCallbackUrl() },
  });
}

export function formatAuthEmailError(message: string): string {
  if (/rate limit|too many requests/i.test(message)) {
    return `${message} Supabase’s built-in email service allows about 2 emails per hour per address — wait a bit or configure custom SMTP in your project.`;
  }
  return message;
}

/** Canonical app origin — prefer NEXT_PUBLIC_SITE_URL (set in Vercel). */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export function authCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`;
}

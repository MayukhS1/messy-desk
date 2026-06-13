const VERCEL_DASHBOARD =
  "Add it in Vercel → Project Settings → Environment Variables";

/** Guidance when a required env var is missing — varies by runtime context. */
export function getMissingEnvVarHint(): string {
  if (process.env.VERCEL_ENV === "development") {
    return `${VERCEL_DASHBOARD}, then restart vercel dev.`;
  }

  if (process.env.VERCEL === "1") {
    return `${VERCEL_DASHBOARD}, then redeploy.`;
  }

  return `${VERCEL_DASHBOARD}, then run vercel dev to load them locally.`;
}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable ${name}. ${getMissingEnvVarHint()}`);
  }
  return value;
}

export function getSupabaseUrl(): string {
  return required("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey(): string {
  return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/** Canonical app origin for auth redirects and metadata. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

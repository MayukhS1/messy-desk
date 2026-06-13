import type { NextConfig } from "next";

const requiredPublicEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

for (const name of requiredPublicEnv) {
  if (!process.env[name]?.trim()) {
    const hint =
      process.env.VERCEL === "1"
        ? "Add it in Vercel → Project Settings → Environment Variables."
        : "Copy .env.local.example to .env.local and fill in the values.";

    throw new Error(`Missing ${name}. ${hint}`);
  }
}

const nextConfig: NextConfig = {};

export default nextConfig;

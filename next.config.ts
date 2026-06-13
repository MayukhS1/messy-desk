import type { NextConfig } from "next";
import { getMissingEnvVarHint } from "./src/lib/env/public";

const requiredPublicEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

if (process.env.VERCEL === "1") {
  for (const name of requiredPublicEnv) {
    if (!process.env[name]?.trim()) {
      throw new Error(`Missing ${name}. ${getMissingEnvVarHint()}`);
    }
  }
}

const nextConfig: NextConfig = {};

export default nextConfig;

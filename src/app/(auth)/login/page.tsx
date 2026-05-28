"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isEmailVerified } from "@/lib/auth/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SketchyCard } from "@/components/ui/SketchyCard";
import { AuthShell } from "@/components/auth/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user && !isEmailVerified(data.user)) {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      router.refresh();
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthShell title="Welcome back">
      <SketchyCard rotate={false}>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-muted mb-6">
          Log in to your messy desk
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-muted">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted text-center">
          No account?{" "}
          <Link href="/signup" className="text-primary hover:underline sketchy-focus">
            Sign up
          </Link>
        </p>
      </SketchyCard>
    </AuthShell>
  );
}

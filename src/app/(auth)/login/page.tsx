"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isEmailVerified } from "@/lib/auth/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-stone-100">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-serif font-bold text-amber-950 mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-stone-500 mb-6">
          Log in to your messy desk
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-stone-500">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-stone-500">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-stone-500 text-center">
          No account?{" "}
          <Link href="/signup" className="text-amber-800 hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}

"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isEmailVerified, authCallbackUrl } from "@/lib/auth/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteFromUrl = searchParams.get("invite") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [partnerInvite, setPartnerInvite] = useState(inviteFromUrl);
  const [inviterName, setInviterName] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isJoining = partnerInvite.trim().length > 0;

  useEffect(() => {
    setPartnerInvite(inviteFromUrl);
  }, [inviteFromUrl]);

  useEffect(() => {
    const code = partnerInvite.trim();
    if (code.length < 6) {
      setInviterName(null);
      return;
    }

    const supabase = createClient();
    supabase
      .rpc("get_invite_info", { p_code: code.toUpperCase() })
      .then(({ data }) => {
        const row = Array.isArray(data) ? data[0] : data;
        setInviterName(row?.valid ? row.inviter_name : null);
      });
  }, [partnerInvite]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const metadata: Record<string, string> = {
      display_name: displayName,
    };

    if (isJoining) {
      metadata.partner_invite_code = partnerInvite.trim().toUpperCase();
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: authCallbackUrl(),
      },
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
    <Card className="w-full max-w-md">
      <h1 className="text-2xl font-serif font-bold text-amber-950 mb-2">
        {isJoining ? "Join your partner" : "Create your desk"}
      </h1>
      <p className="text-sm text-stone-500 mb-6">
        {isJoining
          ? inviterName
            ? `You're joining ${inviterName}'s messy desk`
            : "Enter your details to join via invite"
          : "Sign up, build your desk, then invite your partner when you're ready"}
      </p>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="text-xs text-stone-500">Display name</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
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
            minLength={6}
            required
          />
        </div>
        {!inviteFromUrl && (
          <div>
            <label className="text-xs text-stone-500">
              Partner invite code (optional)
            </label>
            <Input
              value={partnerInvite}
              onChange={(e) => setPartnerInvite(e.target.value.toUpperCase())}
              placeholder="Leave blank to start solo"
            />
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : isJoining ? "Join & play" : "Sign up"}
        </Button>
      </form>
      <p className="mt-3 text-xs text-stone-500 text-center">
        You&apos;ll need to verify your email before using Messy Desk.
      </p>
      <p className="mt-4 text-sm text-stone-500 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-amber-800 hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-stone-100">
      <Suspense fallback={<div className="text-stone-500">Loading…</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}

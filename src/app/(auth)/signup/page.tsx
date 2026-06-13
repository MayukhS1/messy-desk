"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  isEmailVerified,
  isObfuscatedSignupUser,
  resendSignupConfirmation,
  formatAuthEmailError,
  authCallbackUrl,
} from "@/lib/auth/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SketchyCard } from "@/components/ui/SketchyCard";
import { AuthShell } from "@/components/auth/AuthShell";

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
      setError(formatAuthEmailError(authError.message));
      setLoading(false);
      return;
    }

    if (isObfuscatedSignupUser(data.user)) {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (!signInError && signInData.user) {
        if (isEmailVerified(signInData.user)) {
          router.push("/dashboard");
          router.refresh();
          return;
        }

        const { error: resendError } = await resendSignupConfirmation(
          supabase,
          email
        );
        const resent = resendError ? "" : "&resent=1";
        router.push(
          `/verify-email?email=${encodeURIComponent(email)}${resent}`
        );
        router.refresh();
        return;
      }

      const { error: resendError } = await resendSignupConfirmation(
        supabase,
        email
      );
      if (resendError) {
        setError(
          /rate limit|too many requests/i.test(resendError.message)
            ? formatAuthEmailError(resendError.message)
            : "This email is already registered. Try logging in, or wait a minute and use “Resend confirmation email” on the verify page."
        );
        setLoading(false);
        return;
      }

      router.push(
        `/verify-email?email=${encodeURIComponent(email)}&resent=1`
      );
      router.refresh();
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
    <SketchyCard rotate={false}>
      <h1 className="text-2xl font-display font-bold text-foreground mb-2">
        {isJoining ? "Join your partner" : "Create your desk"}
      </h1>
      <p className="text-sm text-muted mb-6">
        {isJoining
          ? inviterName
            ? `You're joining ${inviterName}'s messy desk`
            : "Enter your details to join via invite"
          : "Sign up, build your desk, then invite your partner when you're ready"}
      </p>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="text-xs text-muted">Display name</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
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
            minLength={6}
            required
          />
        </div>
        {!inviteFromUrl && (
          <div>
            <label className="text-xs text-muted">
              Partner invite code (optional)
            </label>
            <Input
              value={partnerInvite}
              onChange={(e) => setPartnerInvite(e.target.value.toUpperCase())}
              placeholder="Leave blank to start solo"
            />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : isJoining ? "Join & play" : "Sign up"}
        </Button>
      </form>
      <p className="mt-3 text-xs text-muted text-center">
        You&apos;ll need to verify your email before using Messy Desk.
      </p>
      <p className="mt-4 text-sm text-muted text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </SketchyCard>
  );
}

export default function SignupPage() {
  return (
    <AuthShell title="Start your story">
      <Suspense fallback={<div className="text-muted text-center">Loading…</div>}>
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}

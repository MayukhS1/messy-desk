"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  isEmailVerified,
  resendSignupConfirmation,
  formatAuthEmailError,
} from "@/lib/auth/utils";
import { Button } from "@/components/ui/Button";
import { SketchyCard } from "@/components/ui/SketchyCard";
import { AuthShell } from "@/components/auth/AuthShell";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const resentOnArrival = searchParams.get("resent") === "1";

  const [email, setEmail] = useState(emailParam);
  const [status, setStatus] = useState(
    resentOnArrival ? "Confirmation email sent — check your inbox." : ""
  );
  const [checking, setChecking] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
      if (isEmailVerified(user)) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const resendEmail = async () => {
    if (!email || resendCooldown > 0) return;
    setStatus("");
    const supabase = createClient();
    const { error } = await resendSignupConfirmation(supabase, email);
    if (error) {
      setStatus(formatAuthEmailError(error.message));
      return;
    }
    setStatus("Confirmation email sent — check your inbox.");
    setResendCooldown(60);
  };

  const checkVerified = async () => {
    setChecking(true);
    setStatus("");
    const supabase = createClient();
    await supabase.auth.refreshSession();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isEmailVerified(user)) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    setStatus("Not verified yet. Click the link in your email, then try again.");
    setChecking(false);
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <SketchyCard rotate={false} className="text-center">
      <svg className="mx-auto mb-4 filter-hand-drawn" width="48" height="40" viewBox="0 0 48 40" fill="none" aria-hidden>
        <rect x="4" y="8" width="40" height="28" rx="2" fill="#fef3c7" stroke="#78350f" strokeWidth="1.5" />
        <path d="M4 12 L24 24 L44 12" stroke="#92400e" strokeWidth="1.5" fill="none" />
        <circle cx="36" cy="12" r="4" fill="#fcd34d" stroke="#78350f" strokeWidth="1" />
      </svg>
      <h1 className="text-2xl font-display font-bold text-foreground mb-2">
        Verify your email
      </h1>
      <p className="text-sm text-muted mb-6 leading-relaxed">
        We sent a confirmation link to{" "}
        <span className="font-medium text-foreground">{email || "your email"}</span>.
        You need to verify before you can set up your desk or invite your partner.
      </p>

      <ol className="text-left text-sm text-muted space-y-2 mb-6 bg-yellow-50/80 border-2 border-amber-800/20 rounded-xl p-4 filter-hand-drawn">
        <li>1. Open the email from Messy Desk</li>
        <li>2. Click the confirmation link</li>
        <li>3. Return here and press &quot;I&apos;ve verified&quot;</li>
      </ol>

      {status && (
        <p className="text-sm text-muted mb-4 bg-secondary rounded-lg px-3 py-2">
          {status}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Button onClick={checkVerified} disabled={checking} className="w-full">
          {checking ? "Checking…" : "I've verified my email"}
        </Button>
        <Button
          variant="secondary"
          onClick={resendEmail}
          disabled={!email || resendCooldown > 0}
          className="w-full"
        >
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : "Resend confirmation email"}
        </Button>
        <Button variant="ghost" onClick={logout} className="w-full">
          Use a different account
        </Button>
      </div>

      <p className="mt-6 text-xs text-muted">
        Check spam if you don&apos;t see it.{" "}
        <Link href="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </SketchyCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Almost there">
      <Suspense fallback={<div className="text-muted text-center">Loading…</div>}>
        <VerifyEmailContent />
      </Suspense>
    </AuthShell>
  );
}

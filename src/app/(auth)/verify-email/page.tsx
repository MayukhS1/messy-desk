"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isEmailVerified, authCallbackUrl } from "@/lib/auth/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailParam);
  const [status, setStatus] = useState("");
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
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: authCallbackUrl() },
    });
    if (error) {
      setStatus(error.message);
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
    <Card className="w-full max-w-md text-center">
      <p className="text-5xl mb-4">✉️</p>
      <h1 className="text-2xl font-serif font-bold text-amber-950 mb-2">
        Verify your email
      </h1>
      <p className="text-sm text-stone-600 mb-6 leading-relaxed">
        We sent a confirmation link to{" "}
        <span className="font-medium text-stone-800">{email || "your email"}</span>.
        You need to verify before you can set up your desk or invite your partner.
      </p>

      <ol className="text-left text-sm text-stone-600 space-y-2 mb-6 bg-amber-50/80 border border-amber-100 rounded-xl p-4">
        <li>1. Open the email from Supabase / Messy Desk</li>
        <li>2. Click the confirmation link</li>
        <li>3. Return here and press &quot;I&apos;ve verified&quot;</li>
      </ol>

      {status && (
        <p className="text-sm text-stone-600 mb-4 bg-stone-50 rounded-lg px-3 py-2">
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

      <p className="mt-6 text-xs text-stone-400">
        Check spam if you don&apos;t see it.{" "}
        <Link href="/login" className="text-amber-800 hover:underline">
          Back to login
        </Link>
      </p>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-stone-100">
      <Suspense fallback={<div className="text-stone-500">Loading…</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}

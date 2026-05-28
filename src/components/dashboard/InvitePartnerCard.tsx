"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCouple, usePartner } from "@/lib/hooks/useProfile";

export function InvitePartnerCard() {
  const { data: couple } = useCouple();
  const { data: partner } = usePartner();
  const [copied, setCopied] = useState(false);

  if (partner || !couple?.invite_code) return null;

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/signup?invite=${couple.invite_code}`
      : `/signup?invite=${couple.invite_code}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-amber-200 bg-amber-50/50 sm:col-span-2">
      <h2 className="font-semibold text-amber-950 mb-1">Invite your partner</h2>
      <p className="text-sm text-stone-600 mb-4">
        Set up your desk now — no need to wait. When you&apos;re ready, send this
        link so they can join and play on their own time.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input readOnly value={inviteUrl} className="text-sm bg-white" />
        <Button onClick={copyLink} className="shrink-0">
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </div>
      <p className="text-xs text-stone-500 mt-3">
        Or share code:{" "}
        <span className="font-mono font-bold tracking-widest text-amber-900">
          {couple.invite_code}
        </span>
      </p>
    </Card>
  );
}

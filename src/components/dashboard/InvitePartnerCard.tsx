"use client";

import { useState } from "react";
import { SketchyStickyNote } from "@/components/ui/SketchyStickyNote";
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
    <SketchyStickyNote
      tapeColor="peach"
      className="sm:col-span-2"
      rotation={-0.5}
      tapeOffset="left"
      tapeRotation={-5}
    >
      <h2 className="text-base font-bold mb-1">Invite your partner</h2>
      <p className="text-sm text-muted mb-4 font-sans">
        Set up your desk now — no need to wait. When you&apos;re ready, send this
        link so they can join and play on their own time.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 font-sans">
        <Input readOnly value={inviteUrl} className="text-sm" />
        <Button onClick={copyLink} className="shrink-0">
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </div>
      <p className="text-xs text-muted mt-3 font-sans">
        Or share code:{" "}
        <span className="font-bold tracking-widest text-foreground">
          {couple.invite_code}
        </span>
      </p>
    </SketchyStickyNote>
  );
}

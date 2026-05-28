"use client";

import { useState } from "react";
import { SketchyCard } from "@/components/ui/SketchyCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { InvitePartnerCard } from "@/components/dashboard/InvitePartnerCard";
import { useProfile, useUpdateProfile } from "@/lib/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const router = useRouter();
  const [displayNameOverride, setDisplayNameOverride] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const displayName = displayNameOverride ?? profile?.display_name ?? "";

  const handleSave = async () => {
    await updateProfile.mutateAsync({ display_name: displayName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted">Your preferences</p>
      </div>

      <InvitePartnerCard />

      <SketchyCard rotate={false} className="space-y-4">
        <div>
          <label className="text-xs text-muted">Display name</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayNameOverride(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="rounded sketchy-focus"
          />
          Sound effects enabled
        </label>

        <Button onClick={handleSave} disabled={updateProfile.isPending}>
          {saved ? "Saved!" : "Save changes"}
        </Button>
      </SketchyCard>

      <SketchyCard rotate={false}>
        <Button variant="danger" className="w-full" onClick={logout}>
          Log out
        </Button>
      </SketchyCard>
    </div>
  );
}

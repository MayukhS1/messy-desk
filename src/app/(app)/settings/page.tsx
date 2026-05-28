"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
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
          <h1 className="text-2xl font-serif font-bold text-amber-950">
            Settings
          </h1>
          <p className="text-sm text-stone-500">Your preferences</p>
        </div>

        <InvitePartnerCard />

        <Card className="space-y-4">
          <div>
            <label className="text-xs text-stone-500">Display name</label>
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
              className="rounded"
            />
            Sound effects enabled
          </label>

          <Button onClick={handleSave} disabled={updateProfile.isPending}>
            {saved ? "Saved!" : "Save changes"}
          </Button>
        </Card>

        <Card>
          <Button variant="danger" className="w-full" onClick={logout}>
            Log out
          </Button>
        </Card>
    </div>
  );
}

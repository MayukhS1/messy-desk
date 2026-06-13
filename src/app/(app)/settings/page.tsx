"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { InvitePartnerCard } from "@/components/dashboard/InvitePartnerCard";
import { SettingsClipboard } from "@/components/settings/SettingsClipboard";
import { PinnedSettingsNote } from "@/components/settings/PinnedSettingsNote";
import { NameTagInput } from "@/components/settings/NameTagInput";
import { WoodToggle } from "@/components/settings/WoodToggle";
import { LogoutScrap } from "@/components/settings/LogoutScrap";
import { useProfile, useUpdateProfile } from "@/lib/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const INK = "#3F220F";
const SOUND_KEY = "messy-desk-sound-enabled";

export default function SettingsPage() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const router = useRouter();
  const [displayNameOverride, setDisplayNameOverride] = useState<string | null>(
    null
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SOUND_KEY);
    if (stored != null) setSoundEnabled(stored === "1");
  }, []);

  const displayName = displayNameOverride ?? profile?.display_name ?? "";

  const handleSave = async () => {
    await updateProfile.mutateAsync({ display_name: displayName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSoundChange = (next: boolean) => {
    setSoundEnabled(next);
    localStorage.setItem(SOUND_KEY, next ? "1" : "0");
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 text-center">
        <h1
          className="text-2xl sm:text-3xl font-display font-bold"
          style={{ color: INK }}
        >
          Settings
        </h1>
        <p
          className="mt-1 text-sm font-display font-semibold"
          style={{ color: `${INK}99` }}
        >
          Your cozy preferences, pinned just for you
        </p>
      </header>

      <SettingsClipboard className="relative pb-16">
        <InvitePartnerCard />

        <PinnedSettingsNote rotation={-1.2} tape="mint" pinSide="left">
          <p
            className="mb-1 text-xs font-display font-bold uppercase tracking-wide"
            style={{ color: `${INK}88` }}
          >
            Who you are
          </p>
          <label
            htmlFor="display-name"
            className="font-display text-base font-bold"
            style={{ color: INK }}
          >
            Display name
          </label>
          <NameTagInput
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayNameOverride(e.target.value)}
          />
          <motion.div
            className="mt-5 flex justify-end"
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleSave}
              disabled={updateProfile.isPending}
              className="border-[2.5px] font-display font-bold"
              style={{ borderColor: INK }}
            >
              {saved ? "Saved!" : "Save changes"}
            </Button>
          </motion.div>
        </PinnedSettingsNote>

        <PinnedSettingsNote rotation={1} tape="peach" pinSide="right">
          <p
            className="mb-4 text-xs font-display font-bold uppercase tracking-wide"
            style={{ color: `${INK}88` }}
          >
            Sounds &amp; vibes
          </p>
          <WoodToggle
            id="sound-effects"
            label="Sound effects enabled"
            checked={soundEnabled}
            onChange={handleSoundChange}
          />
          <p
            className="mt-3 text-xs font-display leading-snug"
            style={{ color: `${INK}77` }}
          >
            Little chimes when you find surprises and tuck notes away.
          </p>
        </PinnedSettingsNote>

        <LogoutScrap onLogout={logout} />
      </SettingsClipboard>
    </div>
  );
}

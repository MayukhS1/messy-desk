"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePartner, useProfile } from "@/lib/hooks/useProfile";
import { useSharedSpace } from "@/lib/hooks/useSharedSpace";
import { createClient } from "@/lib/supabase/client";
import { ClotheslineNav } from "@/components/AppShell/ClotheslineNav";
import { PartnerPolaroid } from "@/components/AppShell/PartnerPolaroid";
import { CozyMessDecor } from "@/components/decor/CozyMessDecor";

function isRecentlyActive(lastActivityAt: string | null | undefined) {
  if (!lastActivityAt) return false;
  const last = new Date(lastActivityAt).getTime();
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  return last >= dayAgo;
}

import { PaperAirplaneNudgeListener } from "@/components/room/PaperAirplaneNudgeListener";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: profile } = useProfile();
  const { data: partner } = usePartner();
  const { data: sharedSpace } = useSharedSpace();
  const router = useRouter();

  const partnerRecentlyActive = isRecentlyActive(
    sharedSpace?.stats?.last_activity_at
  );

  const logout = async () => {
    const supabase = createClient();
    sessionStorage.removeItem("messy-desk-bootstrapped");
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="relative min-h-screen bg-paper-texture">
      <div className="sunlight-overlay pointer-events-none fixed inset-0 z-0" aria-hidden />

      <header className="sticky top-0 z-30 border-b-2 border-amber-800/15 bg-background/85 backdrop-blur-sm filter-hand-drawn">
        <div className="mx-auto max-w-6xl px-4 py-2">
          <div className="flex items-start justify-between gap-4">
            <Link
              href="/dashboard"
              prefetch
              className="font-display text-xl text-foreground pt-2 sketchy-focus shrink-0"
            >
              Messy Desk
            </Link>

            <div className="flex-1 min-w-0">
              <ClotheslineNav pathname={pathname} />
            </div>

            <div className="hidden md:flex items-end gap-2 shrink-0 pt-1">
              {partner && (
                <PartnerPolaroid
                  partner={partner}
                  recentlyActive={partnerRecentlyActive}
                />
              )}
              <div className="relative px-3 py-1.5 border-2 border-amber-800/30 bg-yellow-50/90 shadow-sm filter-hand-drawn -rotate-[1deg]">
                <span className="text-sm text-foreground">{profile?.display_name}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="ml-2 text-xs text-muted hover:text-foreground sketchy-focus min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>

          <div className="md:hidden flex items-center justify-between pt-2 pb-1 text-sm gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {partner && (
                <PartnerPolaroid
                  partner={partner}
                  recentlyActive={partnerRecentlyActive}
                  compact
                />
              )}
              <span className="text-muted truncate">{profile?.display_name}</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="text-muted hover:text-foreground sketchy-focus min-h-[44px] px-2 shrink-0"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-6 flex-1 z-10">
        <CozyMessDecor variant="subtle" />
        <PaperAirplaneNudgeListener />
        {children}
      </main>
    </div>
  );
}

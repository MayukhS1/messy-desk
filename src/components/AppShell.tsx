"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePartner, useProfile } from "@/lib/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
import { ClotheslineNav } from "@/components/AppShell/ClotheslineNav";
import { CozyMessDecor } from "@/components/decor/CozyMessDecor";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: profile } = useProfile();
  const { data: partner } = usePartner();
  const router = useRouter();

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

            <div className="hidden md:flex flex-col items-end gap-1 shrink-0 pt-1">
              {partner && (
                <span className="text-xs text-muted font-display">
                  with {partner.display_name}
                </span>
              )}
              <div
                className="relative px-3 py-1.5 border-2 border-amber-800/30 bg-yellow-50/90 shadow-sm filter-hand-drawn rotate-[1deg]"
              >
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

          {/* Mobile user bar */}
          <div className="md:hidden flex items-center justify-between pt-2 pb-1 text-sm">
            <span className="text-muted truncate">
              {profile?.display_name}
              {partner ? ` · with ${partner.display_name}` : ""}
            </span>
            <button
              type="button"
              onClick={logout}
              className="text-muted hover:text-foreground sketchy-focus min-h-[44px] px-2"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-6 flex-1 z-10">
        <CozyMessDecor variant="subtle" />
        {children}
      </main>
    </div>
  );
}

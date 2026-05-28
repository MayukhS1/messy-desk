"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePartner, useProfile } from "@/lib/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: profile } = useProfile();
  const { data: partner } = usePartner();
  const router = useRouter();

  const nav = [
    { href: "/dashboard", label: "Home" },
    { href: "/room", label: "Room" },
    { href: "/desk/edit", label: "Edit desk" },
    { href: "/settings", label: "Settings" },
  ];

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-amber-50/30">
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="font-serif text-lg text-amber-900">
            Messy Desk
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm min-h-[44px] flex items-center",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-amber-100 text-amber-900"
                    : "text-stone-600 hover:bg-stone-100"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            {partner && (
              <span className="hidden md:inline text-stone-500">
                with {partner.display_name}
              </span>
            )}
            <span className="text-stone-700">{profile?.display_name}</span>
            <button
              type="button"
              onClick={logout}
              className="text-stone-500 hover:text-stone-800 min-h-[44px] min-w-[44px]"
            >
              Log out
            </button>
          </div>
        </div>
        <nav className="sm:hidden flex border-t border-stone-100 overflow-x-auto">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 text-center py-3 text-xs min-h-[44px]",
                pathname === href ? "text-amber-800 font-medium" : "text-stone-500"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 flex-1">{children}</main>
    </div>
  );
}

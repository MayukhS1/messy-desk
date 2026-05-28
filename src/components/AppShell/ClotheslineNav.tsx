"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useStableRotation } from "@/lib/motion/useStableRotation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/room", label: "Room" },
  { href: "/desk/edit", label: "Edit Desk" },
  { href: "/settings", label: "Settings" },
];

function NavScrap({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const rotation = useStableRotation(-4, 4);

  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "relative inline-flex min-h-[44px] min-w-[72px] flex-col items-center justify-center px-4 py-2 text-sm font-medium sketchy-focus",
        "border-2 border-amber-800/40 bg-surface shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98]",
        active ? "text-foreground z-10" : "text-muted hover:text-foreground"
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {active && (
        <svg
          className="pointer-events-none absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)]"
          viewBox="0 0 100 50"
          fill="none"
          aria-hidden
        >
          <ellipse
            cx="50"
            cy="25"
            rx="46"
            ry="22"
            stroke="#FCD34D"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="4 6"
            fill="none"
            opacity="0.9"
          />
        </svg>
      )}
      <span className="font-display relative z-10">{label}</span>
    </Link>
  );
}

export function ClotheslineNav({ pathname }: { pathname: string }) {
  const router = useRouter();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    NAV_ITEMS.forEach(({ href }) => {
      router.prefetch(href);
    });
  }, [router]);

  return (
    <nav className="relative w-full" aria-label="Main navigation">
      <div
        className="absolute left-0 right-0 top-3 h-0 border-t-2 border-dashed border-amber-800/25"
        aria-hidden
      />

      <div className="hidden sm:flex items-end justify-center gap-4 pt-6 pb-2">
        {NAV_ITEMS.map(({ href, label }) => (
          <div key={href} className="relative">
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-red-400 border border-red-600 shadow-sm z-20"
              aria-hidden
            />
            <NavScrap href={href} label={label} active={isActive(href)} />
          </div>
        ))}
      </div>

      <div className="sm:hidden flex overflow-x-auto gap-3 px-2 pt-6 pb-2 scrollbar-none">
        {NAV_ITEMS.map(({ href, label }) => (
          <div key={href} className="relative shrink-0">
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-red-400 border border-red-600 z-20"
              aria-hidden
            />
            <NavScrap href={href} label={label} active={isActive(href)} />
          </div>
        ))}
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { CozyMessDecor } from "@/components/decor/CozyMessDecor";

export function AuthShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-paper-texture">
      <div className="sunlight-overlay pointer-events-none fixed inset-0" aria-hidden />
      <CozyMessDecor variant="landing" />

      <Link
        href="/"
        className="absolute top-6 left-1/2 -translate-x-1/2 font-display text-2xl text-foreground sketchy-focus"
      >
        Messy Desk
      </Link>

      {title && (
        <p className="absolute top-16 left-1/2 -translate-x-1/2 text-sm text-muted font-display">
          {title}
        </p>
      )}

      <div className="relative z-10 w-full max-w-md mt-8">{children}</div>
    </div>
  );
}

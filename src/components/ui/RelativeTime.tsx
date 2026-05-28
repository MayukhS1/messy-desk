"use client";

import { useSyncExternalStore } from "react";
import { formatRelativeTime } from "@/lib/utils";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function RelativeTime({ date }: { date: string | null }) {
  const isClient = useIsClient();

  if (!isClient) {
    return <span suppressHydrationWarning>…</span>;
  }

  return <span>{formatRelativeTime(date)}</span>;
}

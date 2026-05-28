"use client";

import { createClient } from "@/lib/supabase/client";
import type { JournalLock } from "@/types/database";
import { useEffect, useState } from "react";

export function JournalLockBanner({ lock }: { lock: JournalLock | null | undefined }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  if (!lock || lock.locked_by === userId) return null;

  return (
    <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
      Partner is writing…
    </div>
  );
}

"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { HuntChecklist } from "@/components/hunt/HuntChecklist";
import { MessageReveal } from "@/components/ui/MessageReveal";
import { Button } from "@/components/ui/Button";
import type { HuntTarget } from "@/types/database";

export default function HuntDetailPage({
  params,
}: {
  params: Promise<{ huntId: string }>;
}) {
  const { huntId } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: ["hunt-detail", huntId],
    queryFn: async () => {
      const supabase = createClient();
      const { data: hunt } = await supabase
        .from("hunts")
        .select("*")
        .eq("id", huntId)
        .single();

      const { data: targets } = await supabase
        .from("hunt_targets")
        .select("*, desk_item:desk_items(*)")
        .eq("hunt_id", huntId)
        .order("sort_order");

      return { hunt, targets: (targets ?? []) as HuntTarget[] };
    },
  });

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-stone-100" />;
  }

  const foundTargets = data?.targets.filter((t) => t.found_at) ?? [];

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-amber-950">
          Hunt recap
        </h1>
        <p className="text-sm text-stone-500 capitalize">
          Status: {data?.hunt?.status}
        </p>
      </div>

      <HuntChecklist targets={data?.targets ?? []} />

      {foundTargets.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-stone-800">Found messages</h2>
          {foundTargets.map((t) => (
            <MessageReveal
              key={t.id}
              message={
                (t as HuntTarget & { desk_item?: { hidden_message?: string } })
                  .desk_item?.hidden_message ?? ""
              }
            />
          ))}
        </div>
      )}

      <Link href="/room">
        <Button variant="secondary">Back to room</Button>
      </Link>
    </div>
  );
}

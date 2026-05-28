"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { HuntChecklist } from "@/components/hunt/HuntChecklist";
import { MessageReveal } from "@/components/ui/MessageReveal";
import { Button } from "@/components/ui/Button";
import { SketchyCard } from "@/components/ui/SketchyCard";
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
    return <div className="h-64 animate-pulse rounded-xl bg-secondary filter-hand-drawn" />;
  }

  const foundTargets = data?.targets.filter((t) => t.found_at) ?? [];

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Hunt recap
        </h1>
        <p className="text-sm text-muted capitalize">
          Status: {data?.hunt?.status}
        </p>
      </div>

      <SketchyCard rotate={false}>
        <HuntChecklist targets={data?.targets ?? []} />
      </SketchyCard>

      {foundTargets.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-foreground">Found messages</h2>
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

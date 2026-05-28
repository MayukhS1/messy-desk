"use client";

import { InvitePartnerCard } from "@/components/dashboard/InvitePartnerCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useMyDesk } from "@/lib/hooks/useDesk";
import { usePartner, useProfile } from "@/lib/hooks/useProfile";
import { usePartnerHunt, useHuntForOwner } from "@/lib/hooks/useHunt";
import { HuntProgress } from "@/components/hunt/HuntChecklist";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { HUNT_TARGET_COUNT } from "@/lib/constants";
import Link from "next/link";

export function DashboardContent() {
  const { data: profile } = useProfile();
  const { data: partner } = usePartner();
  const { data: myDesk } = useMyDesk();
  const { data: partnerHuntState } = usePartnerHunt(partner?.id);
  const { data: huntOnMyDesk } = useHuntForOwner();

  const myItemCount = myDesk?.items.length ?? 0;
  const myStatus = myDesk?.desk.status ?? "draft";
  const huntTargets =
    myDesk?.items.filter((i) => i.is_hunt_target).length ?? 0;

  const partnerFound =
    partnerHuntState?.phase === "active"
      ? partnerHuntState.targets.filter((t) => t.found_at).length
      : 0;
  const partnerTotal =
    partnerHuntState?.phase === "active"
      ? partnerHuntState.targets.length
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InvitePartnerCard />

      <Card>
        <h2 className="font-semibold text-stone-800 mb-1">Your desk</h2>
        <p className="text-sm text-stone-500 mb-4">
          {myItemCount} items · {huntTargets} hunt targets ·{" "}
          <span className="capitalize">{myStatus}</span>
        </p>
        {huntOnMyDesk && (
          <div className="mb-4">
            <p className="text-xs text-stone-500 mb-2">
              Partner is hunting your desk
            </p>
            <HuntProgress
              found={huntOnMyDesk.found}
              total={huntOnMyDesk.total}
            />
          </div>
        )}
        <div className="flex gap-2">
          <Link href="/desk/edit">
            <Button variant="secondary" size="sm">
              Edit desk
            </Button>
          </Link>
          {myStatus === "draft" && huntTargets >= HUNT_TARGET_COUNT && (
            <Link href="/desk/edit">
              <Button size="sm">Publish</Button>
            </Link>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-stone-800 mb-1">
          {partner?.display_name ?? "Partner"}&apos;s desk
        </h2>
        {!partner ? (
          <>
            <p className="text-sm text-stone-500 mb-4">
              Publish your desk and send an invite — your partner can join and
              hunt whenever they&apos;re ready. No need to be online together.
            </p>
            <Link href="/desk/edit">
              <Button variant="secondary" size="sm">
                Set up your desk
              </Button>
            </Link>
          </>
        ) : partnerHuntState?.phase === "completed" ? (
          <>
            <p className="text-sm text-green-700 mb-3 font-medium">
              Hunt completed! 🎉
            </p>
            <p className="text-sm text-stone-500 mb-4">
              You found all hidden messages on their desk.
            </p>
            <Link href="/room">
              <Button size="sm" variant="secondary">
                View results
              </Button>
            </Link>
          </>
        ) : partnerHuntState?.phase === "active" ? (
          <>
            <p className="text-sm text-stone-500 mb-3">
              Hunt in progress · started{" "}
              <RelativeTime date={partnerHuntState.hunt.started_at} />
            </p>
            <HuntProgress found={partnerFound} total={partnerTotal} />
            <Link href="/room" className="inline-block mt-4">
              <Button size="sm">Continue hunt</Button>
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-stone-500 mb-4">
              Explore their desk and find hidden messages — play at your own
              pace.
            </p>
            <Link href="/room">
              <Button size="sm">Start hunt</Button>
            </Link>
          </>
        )}
      </Card>

      <Card className="sm:col-span-2">
        <h2 className="font-semibold text-stone-800 mb-2">Shared space</h2>
        <p className="text-sm text-stone-500 mb-4">
          Journal, record player, flora vase, and photo frame — yours to use
          now; your partner adds to it when they join.
        </p>
        <div className="flex gap-2">
          <Link href="/room">
            <Button variant="secondary" size="sm">
              Open room
            </Button>
          </Link>
          <Link href="/shared/edit">
            <Button variant="ghost" size="sm">
              Configure shared space
            </Button>
          </Link>
        </div>
      </Card>

      {profile && (
        <p className="sm:col-span-2 text-xs text-stone-400 text-center">
          Signed in as {profile.display_name}
        </p>
      )}
    </div>
  );
}

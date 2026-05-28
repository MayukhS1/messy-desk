"use client";

import { InvitePartnerCard } from "@/components/dashboard/InvitePartnerCard";
import { SketchyStickyNote } from "@/components/ui/SketchyStickyNote";
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

      <SketchyStickyNote tapeColor="peach">
        <h2 className="text-base font-bold mb-1">Your desk</h2>
        <p className="text-sm text-muted mb-4 font-sans">
          {myItemCount} items · {huntTargets} hunt targets ·{" "}
          <span className="capitalize">{myStatus}</span>
        </p>
        {huntOnMyDesk && (
          <div className="mb-4">
            <p className="text-xs text-muted mb-2 font-sans">
              Partner is hunting your desk
            </p>
            <HuntProgress
              found={huntOnMyDesk.found}
              total={huntOnMyDesk.total}
            />
          </div>
        )}
        <div className="flex gap-2 font-sans">
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
      </SketchyStickyNote>

      <SketchyStickyNote tapeColor="mint">
        <h2 className="text-base font-bold mb-1">
          {partner?.display_name ?? "Partner"}&apos;s desk
        </h2>
        {!partner ? (
          <>
            <p className="text-sm text-muted mb-4 font-sans">
              Publish your desk and send an invite — your partner can join and
              hunt whenever they&apos;re ready.
            </p>
            <Link href="/desk/edit">
              <Button variant="secondary" size="sm">
                Set up your desk
              </Button>
            </Link>
          </>
        ) : partnerHuntState?.phase === "completed" ? (
          <>
            <p className="text-sm text-success mb-3 font-medium font-sans">
              Hunt completed!
            </p>
            <p className="text-sm text-muted mb-4 font-sans">
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
            <p className="text-sm text-muted mb-3 font-sans">
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
            <p className="text-sm text-muted mb-4 font-sans">
              Explore their desk and find hidden messages — play at your own
              pace.
            </p>
            <Link href="/room">
              <Button size="sm">Start hunt</Button>
            </Link>
          </>
        )}
      </SketchyStickyNote>

      <SketchyStickyNote tapeColor="red" className="sm:col-span-2">
        <h2 className="text-base font-bold mb-2">Shared space</h2>
        <p className="text-sm text-muted mb-4 font-sans">
          Journal, record player, flora vase, and photo frame — yours to use
          now; your partner adds to it when they join.
        </p>
        <div className="flex gap-2 font-sans">
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
      </SketchyStickyNote>

      {profile && (
        <p className="sm:col-span-2 text-xs text-muted text-center font-display">
          Signed in as {profile.display_name}
        </p>
      )}
    </div>
  );
}

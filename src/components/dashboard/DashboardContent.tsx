"use client";

import { InvitePartnerCard } from "@/components/dashboard/InvitePartnerCard";
import { DailyPromptNote } from "@/components/dashboard/DailyPromptNote";
import { SharedSpaceIconRow } from "@/components/dashboard/SharedSpaceIconRow";
import { SketchyStickyNote } from "@/components/ui/SketchyStickyNote";
import { Button } from "@/components/ui/Button";
import { useMyDesk } from "@/lib/hooks/useDesk";
import { usePartner, useProfile } from "@/lib/hooks/useProfile";
import { usePartnerHunt, useHuntForOwner } from "@/lib/hooks/useHunt";
import { useSharedSpace } from "@/lib/hooks/useSharedSpace";
import { HuntProgress } from "@/components/hunt/HuntHeartProgress";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { HUNT_TARGET_COUNT } from "@/lib/constants";
import Link from "next/link";

export function DashboardContent() {
  const { data: profile } = useProfile();
  const { data: partner } = usePartner();
  const { data: myDesk } = useMyDesk();
  const { data: partnerHuntState } = usePartnerHunt(partner?.id);
  const { data: huntOnMyDesk } = useHuntForOwner();
  const { data: sharedSpace } = useSharedSpace();

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
    <div className="relative">
      {partner && (
        <DailyPromptNote
          partnerName={partner.display_name}
          className="hidden lg:block absolute -top-2 right-0 z-10"
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2 pt-2 lg:pt-4">
        <InvitePartnerCard />

        <SketchyStickyNote
          tapeColor="peach"
          rotation={-0.8}
          tapeOffset="left"
          tapeRotation={-6}
        >
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

        <SketchyStickyNote
          tapeColor="mint"
          rotation={0.6}
          tapeOffset="right"
          tapeRotation={5}
        >
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
              <HuntProgress found={partnerTotal} total={partnerTotal} />
              <p className="text-sm text-success mt-3 mb-4 font-medium font-sans">
                You found every hidden message!
              </p>
              <Link href="/room">
                <Button size="sm" variant="secondary">
                  See what you uncovered
                </Button>
              </Link>
            </>
          ) : partnerHuntState?.phase === "active" ? (
            <>
              <p className="text-sm text-muted mb-3 font-sans">
                Started{" "}
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
                Their desk is ready — find the notes they hid for you.
              </p>
              <Link href="/room">
                <Button size="sm">Start hunt</Button>
              </Link>
            </>
          )}
        </SketchyStickyNote>

        <SketchyStickyNote
          tapeColor="red"
          className="sm:col-span-2"
          rotation={-0.4}
          tapeOffset="center"
          tapeRotation={-3}
        >
          <h2 className="text-base font-bold mb-1">Shared space</h2>
          <p className="text-sm text-muted mb-3 font-sans">
            Your nook — journal, music, flowers, and photos together.
          </p>
          <SharedSpaceIconRow
            floraStage={sharedSpace?.stats?.flora_stage ?? 1}
            className="mb-4"
          />
          <div className="flex flex-wrap gap-2 font-sans">
            <Link href="/room">
              <Button size="sm">Enter shared space</Button>
            </Link>
            <Link href="/shared/edit">
              <Button variant="ghost" size="sm">
                Configure
              </Button>
            </Link>
          </div>
        </SketchyStickyNote>

        {partner && (
          <DailyPromptNote
            partnerName={partner.display_name}
            className="lg:hidden sm:col-span-2 mx-auto"
          />
        )}

        {profile && (
          <p className="sm:col-span-2 text-xs text-muted text-center font-display">
            Signed in as {profile.display_name}
          </p>
        )}
      </div>
    </div>
  );
}

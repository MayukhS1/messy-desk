"use client";

import { motion } from "framer-motion";
import { ItemVisual } from "@/components/items/hunt/ItemVisual";
import type { HuntItemType } from "@/types/database";
import type { HuntTargetWithItem } from "@/lib/hooks/useHunt";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { useSharedSpace, useJournalMutations } from "@/lib/hooks/useSharedSpace";
import { useState } from "react";
import { cn } from "@/lib/utils";

const INK = "#3F220F";
const SIENNA = "#895435";

const TAPE_COLORS = [
  "rgba(252,211,77,0.85)",
  "rgba(167,243,208,0.85)",
  "rgba(254,205,211,0.85)",
];

const ROTATIONS = [-2.5, 1.5, -1, 2, -1.8, 1.2];

function KeepsakePolaroid({
  target,
  index,
  spread,
}: {
  target: HuntTargetWithItem;
  index: number;
  spread?: boolean;
}) {
  const item = target.desk_item;
  const type = (item?.item_type ?? "sticky_note") as HuntItemType;
  const tapeColor = TAPE_COLORS[index % TAPE_COLORS.length];
  const rotation = ROTATIONS[index % ROTATIONS.length];

  return (
    <motion.li
      initial={{ opacity: 0, y: 16, rotate: rotation - 4 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ type: "spring", stiffness: 280, damping: 22, delay: index * 0.08 }}
      className={cn(
        "relative list-none filter-hand-drawn",
        spread && index > 0 && "-ml-6 sm:-ml-10"
      )}
      style={{ zIndex: index + 1 }}
    >
      <div
        className={cn(
          "relative border-[2.5px] bg-[#FDFBF7] p-4 pt-5 shadow-md",
          spread ? "min-w-[260px] max-w-[300px] sm:min-w-[280px]" : "w-full"
        )}
        style={{ borderColor: INK }}
      >
        <div
          className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 border-2 -rotate-1"
          style={{ borderColor: INK, backgroundColor: tapeColor }}
          aria-hidden
        />

        <div className="mb-3 flex items-start gap-3">
          <ItemVisual type={type} opened size={48} />
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className="font-display text-base font-bold leading-tight"
              style={{ color: INK }}
            >
              {item?.label || `Surprise ${index + 1}`}
            </p>
          </div>
        </div>

        <div
          className="mb-2 rounded-md border-2 px-3 py-3"
          style={{
            borderColor: `${INK}55`,
            backgroundColor: "rgba(255,254,249,0.95)",
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 22px, rgba(63,34,15,0.08) 22px, rgba(63,34,15,0.08) 23px)",
          }}
        >
          <p
            className="font-display text-base font-bold leading-snug whitespace-pre-wrap"
            style={{ color: INK }}
          >
            {item?.hidden_message || "—"}
          </p>
        </div>

        {item?.hint && (
          <p className="text-sm font-display leading-snug" style={{ color: SIENNA }}>
            <span className="font-bold">Clue: </span>
            {item.hint}
          </p>
        )}
      </div>
    </motion.li>
  );
}

export function HuntKeepsakeSpread({
  targets,
  completedAt,
  huntId,
  layout = "spread",
}: {
  targets: HuntTargetWithItem[];
  completedAt?: string | null;
  huntId?: string;
  layout?: "spread" | "stack";
}) {
  const { data: sharedSpace } = useSharedSpace();
  const { saveEntry } = useJournalMutations(sharedSpace?.coupleId ?? undefined);
  const [archived, setArchived] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const isSpread = layout === "spread";

  const handleArchive = async () => {
    if (!sharedSpace?.coupleId || archiving || archived) return;
    setArchiving(true);
    try {
      const body = targets
        .map((t, i) => {
          const item = t.desk_item;
          return `### ${item?.label || `Surprise ${i + 1}`}\n\n${item?.hidden_message || ""}\n\n*Clue: ${item?.hint || "—"}*`;
        })
        .join("\n\n---\n\n");

      await saveEntry.mutateAsync(
        `📔 Hunt keepsake — surprises found!\n\n${body}`
      );
      if (huntId) {
        localStorage.setItem(`messy-desk-archived-hunt-${huntId}`, "1");
      }
      setArchived(true);
    } catch {
      /* optional feature */
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 px-2">
      <div
        className="relative rounded-xl border-2 border-amber-800/40 p-5 sm:p-6 filter-hand-drawn shadow-md"
        style={{
          backgroundColor: "#d4a57440",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(139,90,43,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139,90,43,0.08) 0%, transparent 45%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-3 rounded-lg border border-dashed"
          style={{ borderColor: `${INK}66` }}
        />

        <div className="relative mb-5 text-center sm:text-left">
          <p className="font-display text-xl font-bold" style={{ color: INK }}>
            Our keepsake spread
          </p>
          {completedAt && (
            <p className="mt-1 text-sm font-display font-bold" style={{ color: SIENNA }}>
              Finished <RelativeTime date={completedAt} />
            </p>
          )}
        </div>

        <ul
          className={cn(
            "relative flex",
            isSpread
              ? "flex-row flex-wrap items-start justify-center gap-y-6 px-2 pb-2"
              : "flex-col gap-5"
          )}
        >
          {targets.map((t, i) => (
            <KeepsakePolaroid key={t.id} target={t} index={i} spread={isSpread} />
          ))}
        </ul>
      </div>

      {sharedSpace?.coupleId && (
        <motion.button
          type="button"
          disabled={archived || archiving}
          onClick={handleArchive}
          className="mx-auto block w-full max-w-md border-[2.5px] px-4 py-3 text-sm font-bold font-display filter-hand-drawn sketchy-focus disabled:opacity-60"
          style={{
            borderColor: INK,
            backgroundColor: archived ? "#d1fae5" : "#FEF3C7",
            color: INK,
          }}
          whileHover={!archived ? { scale: 1.02, rotate: -0.5 } : undefined}
          whileTap={!archived ? { scale: 0.98 } : undefined}
        >
          {archived
            ? "Tucked into our journal 📔"
            : archiving
              ? "Tucking away…"
              : "Tuck into our Shared Scrapbook 📔"}
        </motion.button>
      )}
    </div>
  );
}

/** @deprecated Use HuntKeepsakeSpread with layout="spread" */
export function HuntKeepsakeMobile({
  targets,
  completedAt,
  huntId,
}: {
  targets: HuntTargetWithItem[];
  completedAt?: string | null;
  huntId?: string;
}) {
  return (
    <HuntKeepsakeSpread
      targets={targets}
      completedAt={completedAt}
      huntId={huntId}
      layout="spread"
    />
  );
}

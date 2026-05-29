"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HUNT_TARGET_COUNT } from "@/lib/constants";
import { SketchyStickyNote } from "@/components/ui/SketchyStickyNote";
import { usePaperAirplaneNudge } from "@/lib/hooks/usePaperAirplaneNudge";
import { PaperAirplaneFlight } from "./PaperAirplaneFlight";

const INK = "#3F220F";
const SIENNA = "#895435";

function RollTopShutterIllustration() {
  return (
    <svg
      className="mx-auto w-full max-w-[280px] opacity-90"
      viewBox="0 0 280 120"
      fill="none"
      aria-hidden
    >
      {/* Drop-cloth drape */}
      <path
        d="M20 28 Q140 8 260 28 L260 100 Q140 118 20 100 Z"
        fill="#E8DCC8"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M40 38 Q140 22 240 38"
        stroke={SIENNA}
        strokeWidth="2"
        strokeDasharray="6 4"
        opacity="0.6"
      />
      {/* Roll-top slats */}
      {Array.from({ length: 8 }).map((_, i) => {
        const y = 32 + i * 8;
        return (
          <path
            key={i}
            d={`M36 ${y} H244`}
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.35 + i * 0.06}
          />
        );
      })}
      {/* Side brackets */}
      <path
        d="M28 24 V104 M252 24 V104"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Under construction sign */}
      <rect
        x="95"
        y="52"
        width="90"
        height="28"
        rx="4"
        fill="#FCD34D"
        stroke={INK}
        strokeWidth="2"
      />
      <text
        x="140"
        y="71"
        textAnchor="middle"
        fill={INK}
        fontSize="11"
        fontFamily="var(--font-dyna-puff), cursive"
        fontWeight="700"
      >
        Under wraps
      </text>
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden>
      <path
        d="M1 3 H19 V13 H1 Z"
        fill="#FDFBF7"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M1 3 L10 10 L19 3" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function PartnerDeskWaitingState({
  partnerId,
  partnerName,
}: {
  partnerId: string;
  partnerName: string;
}) {
  const reduceMotion = useReducedMotion();
  const {
    sendNudge,
    sent,
    onCooldown,
    cooldownLabel,
    showFlight,
    dismissFlight,
    disabled,
    error,
  } = usePaperAirplaneNudge(partnerId);

  const firstName = partnerName.split(/\s+/)[0] || partnerName;

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border-4 border-amber-950/60",
          "bg-[#e8dcc8]/80 filter-hand-drawn shadow-[inset_0_2px_12px_rgba(63,34,15,0.08)]",
          "h-[260px] sm:h-[280px] lg:h-[300px]"
        )}
      >
        {/* Wood grain texture */}
        <div className="absolute inset-0 desk-wood-grain opacity-20 pointer-events-none" />
        <div
          className="absolute inset-[6%] rounded-lg pointer-events-none"
          style={{ border: `2px dashed ${INK}`, opacity: 0.3 }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-4 py-6">
          <RollTopShutterIllustration />

          <SketchyStickyNote
            tapeColor="mint"
            tapeOffset="center"
            rotation={-1.5}
            className="max-w-sm text-center !p-4 !text-base shadow-lg"
          >
            Shh! {firstName} is still busy hiding your {HUNT_TARGET_COUNT}{" "}
            surprises! Check back shortly… 🕵️‍♂️
          </SketchyStickyNote>
        </div>

        {showFlight && (
          <PaperAirplaneFlight onComplete={dismissFlight} />
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        {onCooldown ? (
          <div
            className="flex items-center gap-2 border-2 px-5 py-2.5 filter-hand-drawn opacity-80"
            style={{ borderColor: INK, backgroundColor: "#FDFBF7" }}
          >
            <EnvelopeIcon />
            <span
              className="text-sm font-bold font-display"
              style={{ color: INK }}
            >
              Resting… try again in {cooldownLabel}
            </span>
          </div>
        ) : (
          <motion.button
            type="button"
            disabled={disabled && !sent}
            onClick={sendNudge}
            className={cn(
              "flex items-center gap-2 border-2 px-5 py-2.5 filter-hand-drawn sketchy-focus",
              "font-bold font-display text-sm disabled:opacity-70 disabled:cursor-not-allowed",
              sent ? "cursor-default" : "cursor-pointer"
            )}
            style={{
              borderColor: INK,
              backgroundColor: sent ? "#FEF3C7" : "#FCD34D",
              color: INK,
            }}
            whileHover={
              !disabled && !sent && !reduceMotion
                ? {
                    scale: 1.05,
                    rotate: -2,
                    boxShadow: "0 8px 20px rgba(137, 84, 53, 0.35)",
                  }
                : undefined
            }
            whileTap={!disabled && !sent ? { scale: 0.97 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 16 }}
          >
            {sent ? "Sent! 🕊️" : "Send a Paper Airplane to " + firstName + " ✈️"}
          </motion.button>
        )}

        {error && (
          <p className="text-sm text-red-700 font-display text-center">{error}</p>
        )}

        <p className="text-xs text-center font-display max-w-sm" style={{ color: `${INK}99` }}>
          A gentle nudge while you wait — {firstName} will see it fly across their screen.
        </p>
      </div>
    </div>
  );
}

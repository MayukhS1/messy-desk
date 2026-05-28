"use client";

import type { SharedItemType } from "@/types/database";
import { cn } from "@/lib/utils";

export function SharedItemVisual({
  type,
  className,
  size = 56,
  floraStage = 1,
  spinning = false,
  ruffle = false,
}: {
  type: SharedItemType;
  className?: string;
  size?: number;
  floraStage?: number;
  spinning?: boolean;
  ruffle?: boolean;
}) {
  const props = {
    width: size,
    height: size,
    className: cn("drop-shadow-lg filter-hand-drawn", className),
  };

  switch (type) {
    case "journal":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          {/* Leather cover */}
          <rect x="12" y="8" width="40" height="48" rx="3" fill="#5c2a0a" stroke="#78350f" strokeWidth="1.5" />
          <rect x="14" y="10" width="36" height="44" rx="2" fill="#92400e" />
          {/* Pages */}
          <g
            style={
              ruffle
                ? { transformOrigin: "32px 32px", animation: "sketch-wobble 0.4s ease-in-out" }
                : undefined
            }
          >
            <rect x="16" y="12" width="32" height="40" rx="1" fill="#fef3c7" stroke="#d6d3d1" strokeWidth="0.5" />
            <path d="M22 22h22M22 28h18M22 34h14" stroke="#d6d3d1" strokeWidth="1" strokeLinecap="round" />
          </g>
          {/* Spine */}
          <rect x="12" y="8" width="7" height="48" rx="2" fill="#7c2d12" />
          {/* Ribbon bookmark */}
          <path d="M38 8 L42 8 L40 28 L38 24 Z" fill="#ef4444" />
          <path d="M40 8 L44 8 L42 28 L40 24 Z" fill="#f87171" />
          {/* Stitching */}
          <path d="M18 14 v36" stroke="#78350f" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
        </svg>
      );

    case "record_player":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          {/* Turquoise body */}
          <rect x="6" y="26" width="52" height="24" rx="5" fill="#5eead4" stroke="#0d9488" strokeWidth="1.5" />
          <rect x="8" y="28" width="48" height="20" rx="4" fill="#2dd4bf" />
          {/* Platter */}
          <circle cx="32" cy="38" r="13" fill="#1c1917" stroke="#44403c" strokeWidth="1.5" />
          <g
            style={
              spinning
                ? { transformOrigin: "32px 38px", animation: "record-spin 2s linear infinite" }
                : undefined
            }
          >
            <circle cx="32" cy="38" r="10" fill="#292524" />
            <circle cx="32" cy="38" r="3" fill="#d6d3d1" />
            <circle cx="32" cy="38" r="1" fill="#78716c" />
            <path d="M32 28 v20" stroke="#44403c" strokeWidth="0.5" opacity="0.5" />
          </g>
          {/* Tone arm */}
          <path d="M44 30 L50 24 L52 26 L46 32" stroke="#78716c" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Knobs */}
          <circle cx="14" cy="34" r="2" fill="#fcd34d" stroke="#78350f" strokeWidth="0.5" />
          <circle cx="50" cy="34" r="2" fill="#fcd34d" stroke="#78350f" strokeWidth="0.5" />
        </svg>
      );

    case "flora_vase":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          {/* Glass vase */}
          <path
            d="M20 48 L24 30 L40 30 L44 48 Z"
            fill="rgba(186,230,253,0.4)"
            stroke="#0ea5e9"
            strokeWidth="1.5"
          />
          <path d="M18 48 H46" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="32" cy="30" rx="8" ry="2" fill="rgba(186,230,253,0.3)" stroke="#0ea5e9" strokeWidth="0.5" />
          {/* Wildflowers */}
          {floraStage >= 2 && (
            <path d="M32 30 Q28 22 32 14 Q36 22 32 30" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
          )}
          {floraStage >= 3 && (
            <>
              <circle cx="24" cy="18" r="4" fill="#f472b6" />
              <circle cx="40" cy="16" r="3.5" fill="#fb7185" />
              <circle cx="32" cy="12" r="3" fill="#fde047" />
            </>
          )}
          {floraStage >= 4 && (
            <circle cx="28" cy="10" r="2.5" fill="#a78bfa" />
          )}
          {floraStage <= 1 && (
            <circle cx="32" cy="22" r="2.5" fill="#84cc16" />
          )}
          {/* Fireflies */}
          <circle cx="18" cy="20" r="1.5" fill="#fcd34d" style={{ animation: "firefly 2s ease-in-out infinite" }} />
          <circle cx="46" cy="24" r="1" fill="#fcd34d" style={{ animation: "firefly 2.5s ease-in-out 0.5s infinite" }} />
          <circle cx="32" cy="8" r="1.2" fill="#fcd34d" style={{ animation: "firefly 1.8s ease-in-out 1s infinite" }} />
        </svg>
      );

    case "haptic_photo_frame":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          {/* Wooden frame */}
          <rect x="10" y="12" width="44" height="40" rx="2" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
          <rect x="12" y="14" width="40" height="36" rx="1" fill="#fef3c7" />
          {/* Photo area */}
          <rect x="16" y="18" width="32" height="28" rx="1" fill="#fde68a" />
          {/* Caricature silhouettes */}
          <circle cx="24" cy="28" r="5" fill="#fdba74" />
          <circle cx="38" cy="28" r="5" fill="#fca5a5" />
          <path d="M20 40 Q24 36 28 40" stroke="#78350f" strokeWidth="1" fill="none" />
          <path d="M34 40 Q38 36 42 40" stroke="#78350f" strokeWidth="1" fill="none" />
          {/* Washi tape corners */}
          <rect x="8" y="10" width="10" height="5" rx="1" fill="#fca5a5" opacity="0.7" transform="rotate(-15 13 12.5)" />
          <rect x="46" y="10" width="10" height="5" rx="1" fill="#a7f3d0" opacity="0.7" transform="rotate(15 51 12.5)" />
          <rect x="8" y="48" width="10" height="5" rx="1" fill="#fcd34d" opacity="0.7" transform="rotate(15 13 50.5)" />
          <rect x="46" y="48" width="10" height="5" rx="1" fill="#c4b5fd" opacity="0.7" transform="rotate(-15 51 50.5)" />
        </svg>
      );

    default:
      return null;
  }
}

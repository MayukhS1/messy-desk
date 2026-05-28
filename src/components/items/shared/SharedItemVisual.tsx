"use client";

import type { SharedItemType } from "@/types/database";
import { cn } from "@/lib/utils";

export function SharedItemVisual({
  type,
  className,
  size = 56,
  floraStage = 1,
}: {
  type: SharedItemType;
  className?: string;
  size?: number;
  floraStage?: number;
}) {
  const props = {
    width: size,
    height: size,
    className: cn("drop-shadow-md", className),
  };

  switch (type) {
    case "journal":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <rect x="14" y="10" width="36" height="44" rx="3" fill="#7c2d12" />
          <rect x="16" y="12" width="32" height="40" rx="2" fill="#fef3c7" />
          <rect x="14" y="10" width="8" height="44" rx="2" fill="#991b1b" />
          <path
            d="M22 22h24M22 28h20M22 34h16"
            stroke="#d6d3d1"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="44" cy="18" r="4" fill="#fbbf24" opacity="0.8" />
          <path
            d="M42 18h4M44 16v4"
            stroke="#92400e"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "record_player":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <rect x="8" y="28" width="48" height="22" rx="4" fill="#44403c" />
          <rect x="10" y="30" width="44" height="18" rx="3" fill="#292524" />
          <circle cx="32" cy="39" r="12" fill="#1c1917" stroke="#78716c" strokeWidth="1.5" />
          <circle cx="32" cy="39" r="4" fill="#d6d3d1" />
          <circle cx="32" cy="39" r="1.5" fill="#78716c" />
          <path
            d="M32 27v-6M24 21h16"
            stroke="#78716c"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="14" y="34" width="6" height="2" rx="1" fill="#a8a29e" />
          <rect x="44" y="34" width="6" height="2" rx="1" fill="#a8a29e" />
        </svg>
      );
    case "flora_vase":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <path
            d="M22 48 L26 32 L38 32 L42 48 Z"
            fill="#d6d3d1"
            stroke="#a8a29e"
            strokeWidth="1.5"
          />
          <path
            d="M20 48 H44"
            stroke="#78716c"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {floraStage >= 2 && (
            <path
              d="M32 32 Q28 24 32 16 Q36 24 32 32"
              fill="#22c55e"
              stroke="#15803d"
              strokeWidth="1"
            />
          )}
          {floraStage >= 3 && (
            <>
              <circle cx="26" cy="20" r="5" fill="#f472b6" opacity="0.9" />
              <circle cx="38" cy="18" r="4" fill="#fb7185" opacity="0.85" />
            </>
          )}
          {floraStage >= 4 && (
            <circle cx="32" cy="14" r="6" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
          )}
          {floraStage <= 1 && (
            <circle cx="32" cy="24" r="3" fill="#84cc16" opacity="0.7" />
          )}
        </svg>
      );
    case "haptic_photo_frame":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <rect x="12" y="14" width="40" height="36" rx="2" fill="#78350f" />
          <rect x="14" y="16" width="36" height="32" rx="1" fill="#fef3c7" />
          <rect x="18" y="20" width="28" height="24" rx="1" fill="#e7e5e4" />
          <circle cx="26" cy="28" r="4" fill="#fbbf24" opacity="0.6" />
          <path
            d="M18 40 L28 32 L36 38 L46 28 L46 44 L18 44 Z"
            fill="#a8a29e"
            opacity="0.5"
          />
          <rect x="10" y="12" width="4" height="40" rx="1" fill="#92400e" />
          <rect x="50" y="12" width="4" height="40" rx="1" fill="#92400e" />
        </svg>
      );
    default:
      return null;
  }
}

"use client";

import type { HuntItemType } from "@/types/database";
import { cn } from "@/lib/utils";

const INK = "#3F220F";

export function ItemVisual({
  type,
  className,
  size: s = 64,
  opened = false,
}: {
  type: HuntItemType;
  className?: string;
  size?: number;
  opened?: boolean;
}) {
  const props = {
    width: s,
    height: s,
    className: cn("drop-shadow-lg", className),
  };

  if (opened) {
    switch (type) {
      case "laptop":
        return (
          <svg viewBox="0 0 64 64" fill="none" {...props}>
            <path d="M8 28 L32 12 L56 28 L56 44 L8 44 Z" fill="#374151" stroke={INK} strokeWidth="1.5" />
            <path d="M12 30 L32 16 L52 30 L52 40 L12 40 Z" fill="#1f2937" />
            <path d="M28 32 C28 32 30 36 32 36 C34 36 36 32 36 32" fill="#f472b6" stroke="#ec4899" strokeWidth="1" />
            <rect x="4" y="44" width="56" height="6" rx="2" fill="#6b7280" stroke={INK} strokeWidth="1" />
          </svg>
        );
      case "envelope":
        return (
          <svg viewBox="0 0 64 64" fill="none" {...props}>
            <rect x="10" y="22" width="44" height="28" rx="2" fill="#fef3c7" stroke={INK} strokeWidth="2" />
            <path d="M10 22 L32 38 L54 22" stroke={INK} strokeWidth="1.5" fill="none" />
            <path d="M10 22 L10 14 L54 14 L54 22" fill="#fde68a" stroke={INK} strokeWidth="1.5" />
            <rect x="18" y="28" width="20" height="14" rx="1" fill="#fffbeb" stroke={INK} strokeWidth="1" />
            <circle cx="46" cy="18" r="5" fill="#fca5a5" stroke={INK} strokeWidth="1" opacity="0.7" />
          </svg>
        );
      case "box":
        return (
          <svg viewBox="0 0 64 64" fill="none" {...props}>
            <rect x="12" y="28" width="40" height="26" rx="2" fill="#92400e" stroke={INK} strokeWidth="2" />
            <path d="M10 28 L32 14 L54 28" fill="#b45309" stroke={INK} strokeWidth="2" />
            <ellipse cx="32" cy="38" rx="12" ry="8" fill="#fcd34d" opacity="0.6" />
            <circle cx="32" cy="38" r="4" fill="#fef08a" stroke={INK} strokeWidth="1" />
          </svg>
        );
      case "book":
        return (
          <svg viewBox="0 0 64 64" fill="none" {...props}>
            <path d="M14 18 L32 14 L50 18 L50 48 L32 52 L14 48 Z" fill="#fef3c7" stroke={INK} strokeWidth="2" />
            <path d="M32 14 V52" stroke={INK} strokeWidth="1.5" />
            <circle cx="22" cy="28" r="4" fill="#fda4af" opacity="0.8" />
            <circle cx="42" cy="34" r="3" fill="#86efac" opacity="0.8" />
            <rect x="16" y="14" width="5" height="34" rx="1" fill="#991b1b" />
          </svg>
        );
      case "mug":
        return (
          <svg viewBox="0 0 64 64" fill="none" {...props}>
            <path
              d="M18 28 h28 v22 a4 4 0 0 1 -4 4 H22 a4 4 0 0 1 -4 -4 V28z"
              fill="#FDFBF7"
              stroke={INK}
              strokeWidth="2.5"
            />
            <path
              d="M46 32 h6 a6 6 0 0 1 0 12 h-6"
              stroke={INK}
              strokeWidth="2.5"
              fill="none"
            />
            <rect x="20" y="32" width="22" height="14" rx="1" fill="#78350f" />
            <path
              d="M24 18 Q26 8 28 18"
              stroke={INK}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M32 14 Q34 2 36 14"
              stroke={INK}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M40 18 Q42 8 44 18"
              stroke={INK}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );
      case "sticky_note":
        return (
          <svg viewBox="0 0 64 64" fill="none" {...props}>
            <path d="M14 16 L46 16 L46 48 L14 48 Z" fill="#fef08a" stroke={INK} strokeWidth="2" />
            <path d="M46 16 L54 24 L54 40 L46 48" fill="#fde047" stroke={INK} strokeWidth="1.5" />
            <path d="M38 16 L46 24 L46 16" fill="#fcd34d" stroke={INK} strokeWidth="1" />
            <path d="M20 26 L38 26" stroke={INK} strokeWidth="1.5" opacity="0.4" />
            <path d="M20 32 L34 32" stroke={INK} strokeWidth="1.5" opacity="0.4" />
          </svg>
        );
      default:
        return null;
    }
  }

  switch (type) {
    case "laptop":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <rect x="8" y="20" width="48" height="32" rx="3" fill="#374151" stroke={INK} strokeWidth="1.5" />
          <rect x="10" y="22" width="44" height="26" rx="2" fill="#1f2937" />
          <rect x="14" y="26" width="36" height="18" rx="1" fill="#4b5563" />
          <rect x="4" y="50" width="56" height="6" rx="2" fill="#6b7280" stroke={INK} strokeWidth="1" />
          <rect x="28" y="52" width="8" height="2" rx="1" fill="#9ca3af" />
        </svg>
      );
    case "envelope":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <rect x="10" y="16" width="44" height="32" rx="2" fill="#fef3c7" stroke={INK} strokeWidth="2" />
          <rect x="12" y="18" width="40" height="28" rx="1" fill="#fffbeb" opacity="0.6" />
          <path d="M10 18 L32 34 L54 18" stroke={INK} strokeWidth="1.5" fill="none" />
          <circle cx="46" cy="20" r="7" fill="#b91c1c" stroke={INK} strokeWidth="1.5" />
          <circle cx="46" cy="20" r="5" fill="#dc2626" opacity="0.8" />
        </svg>
      );
    case "box":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <rect x="12" y="22" width="40" height="32" rx="2" fill="#92400e" stroke={INK} strokeWidth="2" />
          <rect x="14" y="24" width="36" height="28" rx="1" fill="#b45309" />
          <rect x="12" y="22" width="40" height="8" rx="2" fill="#78350f" />
          <circle cx="32" cy="38" r="6" fill="#fcd34d" stroke={INK} strokeWidth="2" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <rect x="16" y="14" width="32" height="40" rx="2" fill="#7c2d12" stroke={INK} strokeWidth="1.5" />
          <rect x="18" y="16" width="28" height="36" rx="1" fill="#fef3c7" />
          <rect x="16" y="14" width="6" height="40" rx="1" fill="#991b1b" />
          <line x1="22" y1="24" x2="42" y2="24" stroke="#d6d3d1" strokeWidth="1" />
          <line x1="22" y1="30" x2="40" y2="30" stroke="#d6d3d1" strokeWidth="1" />
        </svg>
      );
    case "mug":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <path
            d="M18 28 h28 v22 a4 4 0 0 1 -4 4 H22 a4 4 0 0 1 -4 -4 V28z"
            fill="#FDFBF7"
            stroke={INK}
            strokeWidth="2.5"
          />
          <path
            d="M46 32 h6 a6 6 0 0 1 0 12 h-6"
            stroke={INK}
            strokeWidth="2.5"
            fill="none"
          />
          <rect x="20" y="32" width="22" height="14" rx="1" fill="#78350f" />
          <path
            d="M24 20 Q26 10 28 20"
            stroke={INK}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M32 18 Q34 6 36 18"
            stroke={INK}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M40 20 Q42 10 44 20"
            stroke={INK}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
    case "sticky_note":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <path d="M14 16 L46 16 L46 48 L14 48 Z" fill="#fef08a" stroke={INK} strokeWidth="2" />
          <path d="M46 16 L46 48 L54 40 L54 24 Z" fill="#fde047" stroke={INK} strokeWidth="1" />
          <line x1="20" y1="26" x2="40" y2="26" stroke={INK} strokeWidth="1" opacity="0.4" />
          <line x1="20" y1="32" x2="36" y2="32" stroke={INK} strokeWidth="1" opacity="0.4" />
        </svg>
      );
    default:
      return null;
  }
}

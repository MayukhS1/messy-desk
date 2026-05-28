"use client";

import type { HuntItemType } from "@/types/database";
import { cn } from "@/lib/utils";

const size = 64;

export function ItemVisual({
  type,
  className,
  size: s = size,
}: {
  type: HuntItemType;
  className?: string;
  size?: number;
}) {
  const props = { width: s, height: s, className: cn("drop-shadow-lg", className) };

  switch (type) {
    case "laptop":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <rect x="8" y="20" width="48" height="32" rx="3" fill="#374151" />
          <rect x="10" y="22" width="44" height="26" rx="2" fill="#1f2937" />
          <rect x="14" y="26" width="36" height="18" rx="1" fill="#4b5563" />
          <rect x="4" y="50" width="56" height="6" rx="2" fill="#6b7280" />
          <rect x="28" y="52" width="8" height="2" rx="1" fill="#9ca3af" />
        </svg>
      );
    case "envelope":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          {/* Canvas paper texture */}
          <rect x="10" y="16" width="44" height="32" rx="2" fill="#fef3c7" stroke="#78350f" strokeWidth="1.5" />
          <rect x="12" y="18" width="40" height="28" rx="1" fill="#fffbeb" opacity="0.6" />
          <path d="M10 18 L32 34 L54 18" stroke="#92400e" strokeWidth="1.5" fill="none" />
          <path d="M10 48 L26 34" stroke="#d97706" strokeWidth="1" opacity="0.5" />
          <path d="M54 48 L38 34" stroke="#d97706" strokeWidth="1" opacity="0.5" />
          {/* Wax seal */}
          <circle cx="46" cy="20" r="7" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
          <circle cx="46" cy="20" r="5" fill="#dc2626" opacity="0.8" />
          <path d="M44 20 Q46 17 48 20 Q46 23 44 20" fill="#fca5a5" opacity="0.5" />
        </svg>
      );
    case "box":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <rect x="12" y="22" width="40" height="32" rx="2" fill="#92400e" />
          <rect x="14" y="24" width="36" height="28" rx="1" fill="#b45309" />
          <rect x="12" y="22" width="40" height="8" rx="2" fill="#78350f" />
          <circle cx="32" cy="38" r="6" fill="#fcd34d" stroke="#d97706" strokeWidth="2" />
          <rect x="30" y="36" width="4" height="6" rx="1" fill="#92400e" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <rect x="16" y="14" width="32" height="40" rx="2" fill="#7c2d12" />
          <rect x="18" y="16" width="28" height="36" rx="1" fill="#fef3c7" />
          <rect x="16" y="14" width="6" height="40" rx="1" fill="#991b1b" />
          <line x1="22" y1="24" x2="42" y2="24" stroke="#d6d3d1" strokeWidth="1" />
          <line x1="22" y1="30" x2="40" y2="30" stroke="#d6d3d1" strokeWidth="1" />
          <line x1="22" y1="36" x2="38" y2="36" stroke="#d6d3d1" strokeWidth="1" />
        </svg>
      );
    case "mug":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <path d="M18 28 h28 v22 a4 4 0 0 1 -4 4 H22 a4 4 0 0 1 -4 -4 V28z" fill="#f5f5f4" stroke="#78716c" strokeWidth="1.5" />
          <path d="M46 32 h6 a6 6 0 0 1 0 12 h-6" stroke="#78716c" strokeWidth="2" fill="none" />
          <rect x="20" y="32" width="22" height="14" rx="1" fill="#78350f" opacity="0.85" />
          <path d="M26 18 Q28 12 30 18" stroke="#a8a29e" strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M32 16 Q34 10 36 16" stroke="#a8a29e" strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M38 18 Q40 12 42 18" stroke="#a8a29e" strokeWidth="1.5" fill="none" opacity="0.7" />
        </svg>
      );
    case "sticky_note":
      return (
        <svg viewBox="0 0 64 64" fill="none" {...props}>
          <path d="M14 16 L46 16 L46 48 L14 48 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <path d="M46 16 L46 48 L54 40 L54 24 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
          <line x1="20" y1="26" x2="40" y2="26" stroke="#ca8a04" strokeWidth="1" opacity="0.5" />
          <line x1="20" y1="32" x2="36" y2="32" stroke="#ca8a04" strokeWidth="1" opacity="0.5" />
          <line x1="20" y1="38" x2="32" y2="38" stroke="#ca8a04" strokeWidth="1" opacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
}

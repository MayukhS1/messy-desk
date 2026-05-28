"use client";

import { cn } from "@/lib/utils";

export function CozyMessDecor({
  variant = "full",
  className,
}: {
  variant?: "full" | "subtle" | "landing";
  className?: string;
}) {
  const showExtras = variant !== "subtle";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      {/* Coffee mug bottom-right */}
      {showExtras && (
        <div className="hidden sm:block absolute bottom-4 right-4 z-0">
          <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
            {/* Coffee stain */}
            <ellipse
              cx="24"
              cy="52"
              rx="18"
              ry="4"
              fill="rgba(120,53,15,0.08)"
            />
            {/* Mug */}
            <path
              d="M8 28 h24 v16 a4 4 0 0 1 -4 4 H12 a4 4 0 0 1 -4 -4 V28"
              fill="#fef3c7"
              stroke="#78350f"
              strokeWidth="1.5"
            />
            <path
              d="M32 32 h6 a6 6 0 0 1 0 12 h-6"
              stroke="#78350f"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Steam */}
            <path
              d="M16 20 Q14 14 16 8"
              stroke="#78350f"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
              style={{ animation: "steam-rise 2s ease-in-out infinite" }}
            />
            <path
              d="M24 18 Q22 12 24 6"
              stroke="#78350f"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.4"
              style={{ animation: "steam-rise 2.5s ease-in-out 0.3s infinite" }}
            />
            <path
              d="M32 20 Q30 14 32 8"
              stroke="#78350f"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
              style={{ animation: "steam-rise 2.2s ease-in-out 0.6s infinite" }}
            />
          </svg>
        </div>
      )}

      {/* Doodle stars and hearts */}
      {showExtras && (
        <>
          <svg
            className="hidden md:block absolute top-8 left-[5%] opacity-30"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2 L14 9 L22 9 L16 14 L18 22 L12 17 L6 22 L8 14 L2 9 L10 9 Z"
              fill="none"
              stroke="#78350f"
              strokeWidth="1.2"
            />
          </svg>
          <svg
            className="hidden md:block absolute top-16 right-[8%] opacity-25"
            width="20"
            height="18"
            viewBox="0 0 20 18"
          >
            <path
              d="M10 16 C10 16 2 10 2 6 C2 3 4 1 7 1 C8.5 1 10 2 10 2 C10 2 11.5 1 13 1 C16 1 18 3 18 6 C18 10 10 16 10 16"
              fill="none"
              stroke="#78350f"
              strokeWidth="1.2"
            />
          </svg>
        </>
      )}

      {/* Sticky note hint */}
      {variant === "full" && (
        <div
          className="hidden lg:block absolute top-12 right-[3%] w-28 p-2 bg-yellow-100/80 border border-amber-800/30 shadow-sm rotate-[3deg] filter-hand-drawn"
        >
          <p className="font-display text-[10px] text-amber-900 leading-tight">
            Tap items to explore!
          </p>
        </div>
      )}

      {/* Graph paper scrap */}
      {variant === "landing" && (
        <div className="hidden sm:block absolute bottom-20 left-[8%] w-24 h-20 bg-blue-50/60 border border-blue-200/50 rotate-[-2deg] opacity-60">
          <div
            className="w-full h-full opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(#93c5fd 1px, transparent 1px), linear-gradient(90deg, #93c5fd 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />
        </div>
      )}

      {/* Arrow doodle */}
      {variant === "full" && (
        <svg
          className="hidden xl:block absolute bottom-32 left-[12%] opacity-20"
          width="40"
          height="30"
          viewBox="0 0 40 30"
        >
          <path
            d="M2 15 H30 M26 10 L32 15 L26 20"
            stroke="#78350f"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
    </div>
  );
}

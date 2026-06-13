"use client";

import { cn } from "@/lib/utils";

const INK = "#3F220F";

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
      {showExtras && (
        <div className="hidden sm:block absolute bottom-2 right-2 z-0">
          <svg width="68" height="80" viewBox="0 0 68 80" fill="none">
            <ellipse
              cx="34"
              cy="74"
              rx="24"
              ry="5"
              fill="rgba(63,34,15,0.15)"
            />
            <path
              d="M11 38 h34 v22 a5 5 0 0 1 -5 5 H16 a5 5 0 0 1 -5 -5 V38"
              fill="#FDFBF7"
              stroke={INK}
              strokeWidth="2.5"
            />
            <path
              d="M15 42 h26 v16 a2 2 0 0 1 -2 2 H17 a2 2 0 0 1 -2 -2 V42"
              fill="#fde68a"
              opacity="0.9"
            />
            <path
              d="M45 42 h9 a8 8 0 0 1 0 16 h-9"
              stroke={INK}
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M24 30 Q22 22 25 14 Q23 6 27 0"
              stroke={INK}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              style={{ animation: "steam-rise 2.4s ease-in-out infinite" }}
            />
            <path
              d="M34 28 Q32 18 35 8 Q33 0 37 -4"
              stroke={INK}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              style={{ animation: "steam-rise 2.8s ease-in-out 0.4s infinite" }}
            />
            <path
              d="M44 30 Q46 20 43 12 Q45 4 41 -2"
              stroke={INK}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              style={{ animation: "steam-rise 2.2s ease-in-out 0.8s infinite" }}
            />
          </svg>
        </div>
      )}

      {showExtras && (
        <>
          <svg
            className="hidden md:block absolute top-10 left-[4%] opacity-50"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2 L14 9 L22 9 L16 14 L18 22 L12 17 L6 22 L8 14 L2 9 L10 9 Z"
              fill="none"
              stroke={INK}
              strokeWidth="2.5"
            />
          </svg>
          <svg
            className="hidden md:block absolute top-20 right-[6%] opacity-45"
            width="18"
            height="16"
            viewBox="0 0 20 18"
          >
            <path
              d="M10 16 C10 16 2 10 2 6 C2 3 4 1 7 1 C8.5 1 10 2 10 2 C10 2 11.5 1 13 1 C16 1 18 3 18 6 C18 10 10 16 10 16"
              fill="none"
              stroke={INK}
              strokeWidth="2.5"
            />
          </svg>
          <svg
            className="hidden lg:block absolute top-[45%] left-[2%] opacity-40"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 14 C8 14 2 10 2 6 C2 4 4 2 6 2 C7 2 8 3 8 3 C8 3 9 2 10 2 C12 2 14 4 14 6 C14 10 8 14 8 14"
              fill="none"
              stroke={INK}
              strokeWidth="2.5"
            />
          </svg>
        </>
      )}

      {variant === "full" && (
        <>
          <div
            className="hidden lg:block absolute top-14 right-[2%] w-28 p-2.5 bg-yellow-100 shadow-md rotate-[3deg] filter-hand-drawn"
            style={{ border: `2px solid ${INK}` }}
          >
            <p
              className="font-display text-xs font-bold leading-tight"
              style={{ color: INK }}
            >
              Tap items to explore!
            </p>
          </div>
          <svg
            className="hidden xl:block absolute bottom-[40%] left-[3%] opacity-40"
            width="36"
            height="28"
            viewBox="0 0 40 30"
          >
            <path
              d="M2 15 H28 M24 10 L30 15 L24 20"
              stroke={INK}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <svg
            className="hidden md:block absolute bottom-[55%] right-[4%] opacity-35"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <path
              d="M4 4 L16 16 M16 4 L4 16"
              stroke={INK}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="10" cy="10" r="7" stroke={INK} strokeWidth="2.5" fill="none" />
          </svg>
        </>
      )}

      {variant === "landing" && (
        <div
          className="hidden sm:block absolute bottom-20 left-[8%] w-24 h-20 bg-blue-50/60 rotate-[-2deg] opacity-60"
          style={{ border: `2px solid ${INK}` }}
        >
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
    </div>
  );
}

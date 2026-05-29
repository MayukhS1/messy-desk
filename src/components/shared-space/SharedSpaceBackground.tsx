"use client";

export function SharedSpaceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-t-xl">
      {/* Warm wall */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100/85 via-orange-50/55 to-stone-100/40" />

      {/* Subtle wall texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #78350f 0px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Window sunlight */}
      <div className="absolute top-0 right-0 h-44 w-64 bg-gradient-to-bl from-accent-sunflower/30 via-accent-peach/12 to-transparent blur-2xl" />

      <div className="absolute top-4 left-4 sm:left-6 font-display text-sm font-bold text-[#2F1A0C]/75">
        Our Nook
      </div>
    </div>
  );
}

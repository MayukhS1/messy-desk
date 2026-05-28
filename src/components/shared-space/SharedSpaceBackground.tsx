"use client";

export function SharedSpaceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100/90 via-orange-50/70 to-stone-100/50" />
      <div
        className="absolute inset-x-[10%] bottom-0 h-16 rounded-t-[40%] bg-gradient-to-t from-amber-200/30 to-transparent"
        aria-hidden
      />
      <div className="absolute top-6 right-10 h-28 w-28 rounded-full bg-yellow-200/40 blur-3xl" />
      <div className="absolute top-8 left-8 h-20 w-20 rounded-full bg-rose-200/25 blur-2xl" />
      <div className="absolute top-4 left-4 sm:left-8 text-xs uppercase tracking-[0.2em] text-amber-800/50 font-medium">
        Our Nook
      </div>
    </div>
  );
}

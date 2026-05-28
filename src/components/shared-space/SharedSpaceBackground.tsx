"use client";

export function SharedSpaceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-t-xl">
      {/* Warm wall behind shelf */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100/80 via-orange-50/60 to-amber-50/40" />

      {/* Window sunlight from upper-right */}
      <div className="absolute top-0 right-0 h-40 w-56 bg-gradient-to-bl from-accent-sunflower/25 via-accent-peach/10 to-transparent blur-2xl" />

      {/* Wooden shelf plank */}
      <div className="absolute inset-x-[4%] bottom-[18%] h-14 sm:h-16">
        <div className="absolute inset-0 desk-wood rounded-lg shadow-lg filter-hand-drawn border-2 border-amber-950/30">
          <div className="absolute inset-0 desk-wood-grain opacity-60 pointer-events-none rounded-lg" />
          <div className="absolute inset-0 desk-wood-specular pointer-events-none rounded-lg" />
          {/* Front edge bevel */}
          <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-amber-950/40 to-transparent rounded-b-lg pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-amber-100/20 to-transparent rounded-t-lg pointer-events-none" />
        </div>
        {/* Shelf drop shadow */}
        <div className="absolute -bottom-3 left-[5%] right-[5%] h-6 rounded-[50%] bg-black/15 blur-lg" />
      </div>

      {/* Label */}
      <div className="absolute top-4 left-4 sm:left-6 font-display text-sm text-amber-900/60">
        Our Nook
      </div>
    </div>
  );
}

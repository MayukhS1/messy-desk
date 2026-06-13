"use client";

import { motion, useReducedMotion } from "framer-motion";

const INK = "#3F220F";
const TERRACOTTA = "#AE5B22";

export function LogoutScrap({ onLogout }: { onLogout: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onLogout}
      className="absolute bottom-4 right-4 z-10 border-[2.5px] px-3 py-2 text-sm font-bold font-display filter-hand-drawn sketchy-focus cursor-pointer"
      style={{
        borderColor: `${INK}55`,
        backgroundColor: "#FDFBF7",
        color: TERRACOTTA,
        clipPath:
          "polygon(0% 8%, 6% 0%, 94% 4%, 100% 12%, 98% 88%, 92% 100%, 8% 96%, 2% 84%)",
      }}
      whileHover={
        reduceMotion ? undefined : { rotate: 1.2, y: -2, scale: 1.03 }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.97, rotate: -0.5 }}
      transition={{ type: "spring", stiffness: 380, damping: 18 }}
    >
      Log out
    </motion.button>
  );
}

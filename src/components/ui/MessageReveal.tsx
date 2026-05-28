"use client";

import { motion } from "framer-motion";

export function MessageReveal({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-stone-800 leading-relaxed"
    >
      <p className="text-xs uppercase tracking-wide text-amber-700 mb-2">
        Hidden message
      </p>
      <p className="whitespace-pre-wrap">{message}</p>
    </motion.div>
  );
}

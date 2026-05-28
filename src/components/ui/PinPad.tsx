"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./Button";

export function PinPad({
  length = 4,
  onSubmit,
  onCancel,
}: {
  length?: number;
  onSubmit: (pin: string) => void;
  onCancel?: () => void;
}) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);

  const addDigit = (d: string) => {
    if (pin.length < length) setPin((p) => p + d);
  };

  const handleSubmit = () => {
    if (pin.length === length) {
      onSubmit(pin);
      setPin("");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
        className="flex justify-center gap-2"
      >
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className="flex h-12 w-10 items-center justify-center rounded-lg border-2 border-stone-300 bg-stone-50 text-xl font-bold"
          >
            {pin[i] ? "•" : ""}
          </div>
        ))}
      </motion.div>
      <div className="grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "enter"].map(
          (key) => (
            <Button
              key={key}
              variant="secondary"
              className="min-h-[48px]"
              onClick={() => {
                if (key === "clear") setPin("");
                else if (key === "enter") handleSubmit();
                else addDigit(key);
              }}
            >
              {key === "clear" ? "⌫" : key === "enter" ? "OK" : key}
            </Button>
          )
        )}
      </div>
      {onCancel && (
        <Button variant="ghost" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
}

export function CombinationLock({
  onSubmit,
}: {
  onSubmit: (combo: string) => void;
}) {
  const [values, setValues] = useState(["0", "0", "0"]);

  const cycle = (index: number, dir: 1 | -1) => {
    setValues((prev) => {
      const next = [...prev];
      const current = parseInt(next[index], 10);
      next[index] = String((current + dir + 10) % 10);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <button
              className="rounded-lg px-4 py-2 text-stone-600 hover:bg-stone-100 min-h-[44px] min-w-[44px]"
              onClick={() => cycle(i, 1)}
            >
              ▲
            </button>
            <span className="text-3xl font-bold text-stone-800">{v}</span>
            <button
              className="rounded-lg px-4 py-2 text-stone-600 hover:bg-stone-100 min-h-[44px] min-w-[44px]"
              onClick={() => cycle(i, -1)}
            >
              ▼
            </button>
          </div>
        ))}
      </div>
      <Button className="w-full" onClick={() => onSubmit(values.join(""))}>
        Unlock
      </Button>
    </div>
  );
}

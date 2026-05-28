"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export type MiniPuzzleKind = "math" | "guess" | "confirm" | "sequence";

function useMathPuzzle() {
  return useMemo(() => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    return { answer: a + b, prompt: `What is ${a} + ${b}?` };
  }, []);
}

function useGuessPuzzle() {
  return useMemo(() => {
    const answer = Math.floor(Math.random() * 5) + 1;
    return { answer, prompt: "Guess a number from 1 to 5" };
  }, []);
}

export function MiniPuzzle({
  kind,
  onSuccess,
  className,
}: {
  kind: MiniPuzzleKind;
  onSuccess: () => void;
  className?: string;
}) {
  const math = useMathPuzzle();
  const guess = useGuessPuzzle();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [clicks, setClicks] = useState(0);
  const requiredClicks = 3;

  const trySubmit = () => {
    setError("");
    if (kind === "math") {
      if (parseInt(input, 10) === math.answer) onSuccess();
      else setError("Not quite — try again!");
    } else if (kind === "guess") {
      if (parseInt(input, 10) === guess.answer) onSuccess();
      else setError("Wrong number — give it another go!");
    } else if (kind === "confirm") {
      if (input.trim().toUpperCase() === "OPEN") onSuccess();
      else setError("Type OPEN to peek inside");
    }
  };

  if (kind === "sequence") {
    return (
      <div className={cn("space-y-3 text-center", className)}>
        <p className="text-sm text-stone-600">
          Tap the book {requiredClicks} times to open it
        </p>
        <button
          type="button"
          className="w-full rounded-xl border border-stone-200 py-6 hover:bg-stone-50 transition-colors"
          onClick={() => {
            const next = clicks + 1;
            setClicks(next);
            if (next >= requiredClicks) onSuccess();
          }}
        >
          <span className="text-2xl">📖</span>
          <span className="block text-sm text-stone-500 mt-2">
            {clicks}/{requiredClicks} taps
          </span>
        </button>
      </div>
    );
  }

  const prompt =
    kind === "math"
      ? math.prompt
      : kind === "guess"
        ? guess.prompt
        : "Type the word OPEN to unlock";

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm text-stone-600">{prompt}</p>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={kind === "confirm" ? "OPEN" : "Your answer"}
        onKeyDown={(e) => e.key === "Enter" && trySubmit()}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button size="sm" className="w-full" onClick={trySubmit}>
        Unlock
      </Button>
    </div>
  );
}

export function puzzleKindForItem(
  itemType: string,
  unlockType: string
): MiniPuzzleKind {
  if (unlockType === "sequence_clicks") return "sequence";
  if (itemType === "envelope") return "math";
  if (itemType === "sticky_note") return "guess";
  return "confirm";
}

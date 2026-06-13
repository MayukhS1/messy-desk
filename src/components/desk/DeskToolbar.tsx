"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const INK = "#3F220F";

function StampButton({
  children,
  onClick,
  disabled,
  variant,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant: "clear" | "save" | "publish";
  title?: string;
}) {
  const reduceMotion = useReducedMotion();
  const colors = {
    clear: { bg: "#AE5B22", text: "#FDFBF7" },
    save: { bg: "#DD954B", text: INK },
    publish: { bg: "#55702C", text: "#FDFBF7" },
  };
  const c = colors[variant];

  const className = cn(
    "inline-flex items-center justify-center px-3 py-1.5 text-sm font-bold font-display",
    "border-2 min-h-[44px] sm:min-h-[36px] filter-hand-drawn sketchy-focus",
    "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
  );

  if (reduceMotion || disabled) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={className}
        style={{ borderColor: INK, backgroundColor: c.bg, color: c.text }}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={className}
      style={{ borderColor: INK, backgroundColor: c.bg, color: c.text }}
      whileHover={{ scale: 1.04, rotate: 0.8 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 16 }}
    >
      {children}
    </motion.button>
  );
}

export function DeskToolbar({
  onSave,
  onPublish,
  onClearDesk,
  saving,
  canPublish,
  completedSteps,
  totalSteps,
  itemCount,
  publishHint,
}: {
  onSave: () => void;
  onPublish: () => void;
  onClearDesk: () => void;
  saving?: boolean;
  canPublish: boolean;
  completedSteps: number;
  totalSteps: number;
  itemCount: number;
  publishHint?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <StampButton
        variant="clear"
        onClick={onClearDesk}
        disabled={saving || itemCount === 0}
      >
        Clear desk
      </StampButton>
      <StampButton variant="save" onClick={onSave} disabled={saving}>
        Save draft
      </StampButton>
      <StampButton
        variant="publish"
        onClick={onPublish}
        disabled={saving || !canPublish}
        title={
          canPublish
            ? "Publish desk for your partner"
            : publishHint ?? "Complete your room list first"
        }
      >
        Publish
        {!canPublish && (
          <span className="ml-1.5 text-[10px] opacity-90">
            ({completedSteps}/{totalSteps})
          </span>
        )}
      </StampButton>
    </div>
  );
}

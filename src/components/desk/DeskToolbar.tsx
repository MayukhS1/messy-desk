"use client";

import { Button } from "@/components/ui/Button";
import { HUNT_TARGET_COUNT } from "@/lib/constants";

export function DeskToolbar({
  onSave,
  onPublish,
  onClearDesk,
  saving,
  targetCount,
  itemCount,
}: {
  onSave: () => void;
  onPublish: () => void;
  onClearDesk: () => void;
  saving?: boolean;
  targetCount: number;
  itemCount: number;
}) {
  const canPublish = targetCount === HUNT_TARGET_COUNT;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="danger"
        size="sm"
        onClick={onClearDesk}
        disabled={saving || itemCount === 0}
      >
        Clear desk
      </Button>
      <Button variant="secondary" size="sm" onClick={onSave} disabled={saving}>
        Save draft
      </Button>
      <Button
        size="sm"
        onClick={onPublish}
        disabled={saving}
        title={
          canPublish
            ? "Publish desk for your partner"
            : `Select ${HUNT_TARGET_COUNT} hunt targets first`
        }
      >
        Publish
        {!canPublish && (
          <span className="ml-1.5 text-[10px] opacity-80">
            ({targetCount}/{HUNT_TARGET_COUNT})
          </span>
        )}
      </Button>
    </div>
  );
}

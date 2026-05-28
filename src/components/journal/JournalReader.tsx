"use client";

import { useState } from "react";
import { JournalContent } from "@/components/journal/JournalContent";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { JournalEntry } from "@/types/database";
import { RelativeTime } from "@/components/ui/RelativeTime";

export function JournalReader({
  entries,
  onRequestEdit,
  onDeleteEntry,
}: {
  entries: JournalEntry[];
  onRequestEdit: () => void;
  onDeleteEntry: (entryId: string) => void | Promise<void>;
}) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;

    setDeleting(true);
    try {
      await onDeleteEntry(pendingDeleteId);
      setPendingDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={onRequestEdit}>
          Write entry
        </Button>
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">
          No entries yet. Start your shared journal!
        </p>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-border bg-secondary p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs text-muted">
                  <RelativeTime date={entry.created_at} />
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/5 min-h-0 py-1 px-2"
                  onClick={() => setPendingDeleteId(entry.id)}
                >
                  Delete
                </Button>
              </div>
              <JournalContent content={entry.content_md} />
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete journal entry?"
        description="This entry will be permanently removed from your shared journal. This can't be undone."
        confirmLabel="Delete entry"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}

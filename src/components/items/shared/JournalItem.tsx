"use client";

import { useState } from "react";
import { InteractionModal } from "@/components/ui/InteractionModal";
import { JournalEditor } from "@/components/journal/JournalEditor";
import { JournalReader } from "@/components/journal/JournalReader";
import { SharedItemVisual } from "./SharedItemVisual";
import { SharedItemButton } from "./SharedItemButton";
import { Button } from "@/components/ui/Button";
import { useJournalEntries, useJournalMutations } from "@/lib/hooks/useSharedSpace";
import type { SharedSpaceItem, RelationshipStats } from "@/types/database";

export function JournalItem({
  coupleId,
  item,
}: {
  coupleId?: string | null;
  item?: SharedSpaceItem;
  stats?: RelationshipStats | null;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const { data: entries = [] } = useJournalEntries(coupleId ?? undefined);
  const { saveEntry, deleteEntry } = useJournalMutations(coupleId ?? undefined);

  if (!item) {
    return <SharedItemVisual type="journal" size={48} className="opacity-40" />;
  }

  return (
    <>
      <SharedItemButton label="Open journal" onClick={() => { setOpen(true); setEditing(false); }}>
        <SharedItemVisual type="journal" size={48} />
      </SharedItemButton>
      <InteractionModal
        open={open}
        onClose={() => setOpen(false)}
        title="Shared Journal"
        className="max-w-2xl"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            size="sm"
            variant={editing ? "secondary" : "primary"}
            onClick={() => setEditing(false)}
          >
            Read entries
          </Button>
          <Button
            size="sm"
            variant={editing ? "primary" : "secondary"}
            onClick={() => setEditing(true)}
          >
            Write new entry
          </Button>
        </div>
        {editing ? (
          <JournalEditor
            onSave={async (content) => {
              await saveEntry.mutateAsync(content);
              setEditing(false);
            }}
          />
        ) : (
          <JournalReader
            entries={entries}
            onRequestEdit={() => setEditing(true)}
            onDeleteEntry={(entryId) => deleteEntry.mutateAsync(entryId)}
          />
        )}
      </InteractionModal>
    </>
  );
}

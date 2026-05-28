"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import {
  isJournalContentEmpty,
  JOURNAL_PLACEHOLDER,
} from "@/lib/journal";

export function JournalEditor({
  onSave,
}: {
  onSave: (content: string) => void | Promise<void>;
}) {
  const [canSave, setCanSave] = useState(false);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "outline-none min-h-[180px] journal-editor",
        "data-placeholder": JOURNAL_PLACEHOLDER,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      setCanSave(!isJournalContentEmpty(editor.getHTML()));
    };

    update();
    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) return null;

  const handleSave = async () => {
    const html = editor.getHTML();
    if (isJournalContentEmpty(html)) return;

    setSaving(true);
    try {
      await onSave(html);
      editor.commands.clearContent();
      setCanSave(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border p-3 min-h-[200px] prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
      <Button
        className="w-full"
        onClick={handleSave}
        disabled={!canSave || saving}
      >
        {saving ? "Saving…" : "Save entry"}
      </Button>
    </div>
  );
}

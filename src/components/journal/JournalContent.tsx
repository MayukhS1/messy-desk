"use client";

import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { looksLikeHtml } from "@/lib/journal";
import { cn } from "@/lib/utils";

export function JournalContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  if (looksLikeHtml(content)) {
    return (
      <div
        className={cn(
          "prose prose-stone prose-sm max-w-none [&_p]:my-1 [&_ul]:my-2 [&_ol]:my-2",
          className
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return <MarkdownRenderer content={content} />;
}

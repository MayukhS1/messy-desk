const PLACEHOLDER = "Write something together…";

export function getJournalPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isJournalContentEmpty(html: string): boolean {
  const plain = getJournalPlainText(html);
  return plain.length === 0 || plain === PLACEHOLDER;
}

export function looksLikeHtml(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

export const JOURNAL_PLACEHOLDER = PLACEHOLDER;

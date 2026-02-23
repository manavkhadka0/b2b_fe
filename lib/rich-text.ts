/**
 * Strip HTML tags and decode entities to get plain text for previews.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html || typeof html !== "string") return "";
  const tmp = typeof document !== "undefined" ? document.createElement("div") : null;
  if (tmp) {
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

/**
 * Check if content looks like HTML (contains tags).
 */
export function isHtml(content: string | null | undefined): boolean {
  if (!content || typeof content !== "string") return false;
  return /<[a-z][\s\S]*>/i.test(content);
}

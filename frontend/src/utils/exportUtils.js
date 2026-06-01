export const escapeHtml = (s = "") =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export function smartQuotes(text = "", locale = "en") {
  const isDe = locale.toLowerCase().startsWith("de");
  const OPEN  = isDe ? "„" : "“";
  const CLOSE = "”";
  return text.replace(/"/g, (_, offset) => {
    const prev = offset > 0 ? text[offset - 1] : "";
    return /\S/.test(prev) && !/[\(\[\{]/.test(prev) ? CLOSE : OPEN;
  });
}

// Split raw scene text into HTML <p> tags.
// Any number of consecutive newlines (including blank lines) counts as one paragraph break.
export function paragraphsHTML(text, firstIsDropcap = false, locale = "en") {
  const parts = (text || "")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return parts
    .map((p, i) => {
      const cls = firstIsDropcap && i === 0 ? ' class="dropcap"' : "";
      return `<p${cls}>${escapeHtml(smartQuotes(p, locale))}</p>`;
    })
    .join("\n");
}

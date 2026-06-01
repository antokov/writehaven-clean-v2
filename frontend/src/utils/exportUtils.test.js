import { describe, it, expect } from "vitest";
import { paragraphsHTML, escapeHtml, smartQuotes } from "./exportUtils";

describe("paragraphsHTML - paragraph splitting", () => {
  it("EC-02: single newline creates two paragraphs", () => {
    const html = paragraphsHTML("alpha\nbeta");
    expect(html).toBe("<p>alpha</p>\n<p>beta</p>");
  });

  it("EC-03: double newline is identical to single newline", () => {
    expect(paragraphsHTML("alpha\n\nbeta")).toBe(paragraphsHTML("alpha\nbeta"));
  });

  it("EC-01: only blank lines produces empty output", () => {
    expect(paragraphsHTML("\n\n\n")).toBe("");
  });

  it("EC-04: leading blank lines are ignored", () => {
    expect(paragraphsHTML("\n\nalpha")).toBe("<p>alpha</p>");
  });

  it("EC-05: trailing blank lines are ignored", () => {
    expect(paragraphsHTML("alpha\n\n")).toBe("<p>alpha</p>");
  });

  it("EC-06: lines with only spaces are ignored", () => {
    expect(paragraphsHTML("alpha\n   \nbeta")).toBe("<p>alpha</p>\n<p>beta</p>");
  });

  it("EC-07: empty / null / undefined returns empty without throwing", () => {
    expect(paragraphsHTML("")).toBe("");
    expect(paragraphsHTML(null)).toBe("");
    expect(paragraphsHTML(undefined)).toBe("");
  });

  it("EC-08: Windows CRLF line endings are handled like LF", () => {
    expect(paragraphsHTML("alpha\r\nbeta")).toBe("<p>alpha</p>\n<p>beta</p>");
  });

  it("three or more consecutive newlines still produce one paragraph break", () => {
    expect(paragraphsHTML("alpha\n\n\n\nbeta")).toBe("<p>alpha</p>\n<p>beta</p>");
  });
});

describe("paragraphsHTML - dropcap and structure", () => {
  it("first paragraph gets dropcap class when requested", () => {
    const html = paragraphsHTML("alpha\nbeta", true);
    expect(html).toContain('<p class="dropcap">alpha</p>');
    expect(html).toContain("<p>beta</p>");
  });

  it("no dropcap class without flag", () => {
    const html = paragraphsHTML("alpha\nbeta", false);
    expect(html).not.toContain('class="dropcap"');
  });
});

describe("escapeHtml", () => {
  it("escapes ampersands, less-than and greater-than", () => {
    expect(escapeHtml("a & b < c > d")).toBe("a &amp; b &lt; c &gt; d");
  });

  it("returns empty string for empty or undefined input", () => {
    expect(escapeHtml("")).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});

describe("smartQuotes", () => {
  it("en locale: straight quotes become curly quotes", () => {
    expect(smartQuotes('"hello"', "en")).toBe("“hello”");
  });

  it("de locale: uses low-9 opening and high closing quote", () => {
    expect(smartQuotes('"hello"', "de")).toBe("„hello”");
  });

  it("quote directly after a word character becomes closing quote", () => {
    expect(smartQuotes('word"', "en")).toBe("word”");
  });
});
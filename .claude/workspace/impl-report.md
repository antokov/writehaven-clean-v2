# Implementation Report: Markdown-Rendering in Schreibgeist-Antworten

## Approach

`react-markdown` installiert und in SchreibgeistPanel.jsx eingebunden. AI-Bubbles verwenden ReactMarkdown-Komponente, User-Bubbles bleiben Plain Text. CSS-Scope `.sg-bubble--md` verhindert Kollision mit globalem Layout.

## Files Changed

| File | Art |
|------|-----|
| `frontend/package.json` | react-markdown ^9 hinzugefügt |
| `frontend/src/components/SchreibgeistPanel.jsx` | ReactMarkdown import + konditionelles Rendering |
| `frontend/src/styles/schreibgeist.css` | `.sg-bubble--md` Styles für h1-h3, p, ul, ol, li, strong, em, code, pre |

## Edge Cases Handled

- EC-01: Kein Markdown → normaler Fließtext (p-Tag) — kein Fehler
- EC-02: Langer Text → `word-break: break-word` bleibt auf `.sg-bubble`
- EC-03: Verschachtelte Listen → Browser-Standard-Einrückung (margin-left: 18px)
- EC-04: Fettdruck + Heading → beide gerendert, h1/h2:first-child ohne top-margin
- EC-05: Leerstring → ReactMarkdown rendert nichts, keine Exception

## Assumptions

- `white-space: pre-wrap` für .sg-bubble--md auf `normal` zurückgesetzt, damit Markdown-Absätze nicht doppelt umgebrochen werden

## Tech Debt

Keine neuen.

## Open Items

Keine.

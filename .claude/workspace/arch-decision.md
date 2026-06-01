# Architect Decision: Markdown-Rendering in Schreibgeist-Antworten

## Library Decision

**Wahl: `react-markdown`**

Gründe:
- XSS-sicher by default (kein dangerouslySetInnerHTML nötig)
- Handles alle benötigten Elemente (h1-h3, bold, italic, ul, ol, code) korrekt
- React-idiomatisch: gibt JSX-Elemente zurück, die sich mit CSS stylen lassen
- Stable und maintained

Installation: `npm install react-markdown`

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/package.json` | `react-markdown` als Dependency hinzufügen (via npm install) |
| `frontend/src/components/SchreibgeistPanel.jsx` | Import `ReactMarkdown`; AI-Bubble auf `<ReactMarkdown>` umstellen |
| `frontend/src/styles/schreibgeist.css` | Neue `.sg-bubble--ai` Markdown-Styles: h2, h3, strong, em, ul, ol, li, p, code |

## Implementation Pattern

```jsx
// In SchreibgeistPanel.jsx
import ReactMarkdown from 'react-markdown';

// In der AI-Bubble:
{msg.role === 'ai'
  ? <ReactMarkdown className="sg-bubble sg-bubble--md">{msg.text}</ReactMarkdown>
  : <div className="sg-bubble">{msg.text}</div>
}
```

## CSS Pattern

Alle Markdown-Elemente im `.sg-bubble--md` Scope stylen, damit sie nicht aus dem Chat-Design fallen:

```css
.sg-bubble--md { ... }
.sg-bubble--md h2 { font-size: 14px; font-weight: 700; margin: 8px 0 4px; }
.sg-bubble--md h3 { font-size: 13px; font-weight: 700; margin: 6px 0 3px; }
.sg-bubble--md p  { margin: 0 0 6px; }
.sg-bubble--md p:last-child { margin-bottom: 0; }
.sg-bubble--md ul, .sg-bubble--md ol { margin: 4px 0 6px 16px; padding: 0; }
.sg-bubble--md li { margin: 2px 0; }
.sg-bubble--md strong { font-weight: 700; }
.sg-bubble--md em    { font-style: italic; }
.sg-bubble--md code  { font-family: monospace; font-size: 12px; background: rgba(0,0,0,0.06); padding: 1px 4px; border-radius: 2px; }
```

## Constraints (DO NOT)

- DO NOT `dangerouslySetInnerHTML` verwenden
- DO NOT `marked` oder andere HTML-String-Libraries verwenden
- DO NOT User-Nachrichten mit Markdown rendern
- DO NOT globale h2/h3/p Styles überschreiben — alles im `.sg-bubble--md` Scope
- DO NOT `remark-gfm` oder andere Plugins hinzufügen (nicht nötig)

## Reference Files

1. `frontend/src/components/SchreibgeistPanel.jsx` — Bubble-Rendering (Zeile ~200-215)
2. `frontend/src/styles/schreibgeist.css` — `.sg-bubble` Styles
3. `frontend/package.json` — für npm install

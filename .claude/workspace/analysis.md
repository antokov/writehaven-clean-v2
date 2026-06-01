# BA Analysis: Markdown-Rendering in Schreibgeist-Antworten

## Business Rules

- **BR-01** Markdown-Rendering gilt ausschließlich für AI-Nachrichten (`role === 'ai'`).
- **BR-02** Nutzer-Nachrichten (`role === 'user'`) werden weiterhin als Plain Text angezeigt.
- **BR-03** Folgende Markdown-Elemente müssen gerendert werden: Überschriften (h1–h3), Fettdruck, Kursiv, ungeordnete Listen (- / *), geordnete Listen (1.), Absätze.
- **BR-04** Die Größen/Farben der gerenderten Elemente müssen zum bestehenden Chat-Design passen (keine riesigen h1-Tags die das Layout sprengen).
- **BR-05** Code-Blöcke werden plain (kein Syntax-Highlighting) gerendert — nur visuelle Abgrenzung.
- **BR-06** Kein ungefiltertes HTML durch den AI-Output (XSS-Schutz).

## Edge Cases

- **EC-01** AI-Antwort enthält kein Markdown → normaler Fließtext, kein Fehler.
- **EC-02** Sehr langer Antworttext → Layout darf nicht brechen (word-break, overflow).
- **EC-03** Verschachtelte Listen → sauber eingerückt.
- **EC-04** Kombination aus Fettdruck + Überschrift → beide korrekt gerendert.
- **EC-05** Leerstring oder whitespace-only → leere Bubble, kein Crash.

## Data Model Implications

Keine — reine Frontend-Änderung.

## Open Questions

- **Q-01** [NON-BLOCKING] Welche Markdown-Library verwenden?  
  → Assumption: `react-markdown` (kein dangerouslySetInnerHTML nötig, sicher, handles alle EC)

# BA Analysis: KI-Kapitelname-Vorschläge

## Business Rules

**BR-01** — Claude (Haiku) generiert genau 3–5 Titelvorschläge als JSON-Array. Kein Freitext.

**BR-02** — Grundlage sind: Szenentitel + Szeneninhalt (getrimmt auf 500 Zeichen pro Szene) aller Szenen des aktiven Kapitels.

**BR-03** — Die Vorschläge werden in der Buchsprache des Projekts (`project.language`) generiert.

**BR-04** — Klick auf einen Vorschlag → `setChapterTitle(vorschlag)` + sofortiges Speichern + Vorschläge ausblenden.

**BR-05** — Neuer Klick auf Vorschlag-Button bei bereits sichtbaren Vorschlägen → neue Anfrage, alte Vorschläge ersetzen.

## Edge Cases

**EC-01** — Keine Szenen im Kapitel → Backend gibt `{"suggestions": []}` → Frontend zeigt „Keine Szeneninhalte vorhanden".

**EC-02** — Alle Szenen leer (kein content) → wie EC-01.

**EC-03** — API-Key fehlt → Fehlermeldung wie bei Schreibgeist.

**EC-04** — Claude gibt kein valides JSON-Array zurück → Backend fängt ParseError, gibt `{"error": "parse_error"}`.

**EC-05** — Nutzer wechselt Kapitel während Laden läuft → Vorschläge der alten Anfrage werden nicht angezeigt (race condition guard via chapterId).

## Data Model Implications
Kein DB-Change. Kein neues Feld. Kapiteltitel wird bereits als `Chapter.title` gespeichert.

## Open Questions
**Q-01** [NON-BLOCKING] — Soll der bestehende Kapiteltitel in den Prompt einfließen (als Kontext)?
→ Assumption: Nein — der Nutzer sucht ja gerade einen neuen Namen, der bestehende Titel könnte Claude einschränken.

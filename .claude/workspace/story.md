# User Story: Markdown-Rendering in Schreibgeist-Antworten

**Story Type:** Bug Fix / UX Enhancement

---

## User Story

Als Autor möchte ich, dass Schreibgeists Antworten ansprechend formatiert dargestellt werden (Überschriften, Fettdruck, Listen), damit ich die Antworten schnell erfassen und gut lesen kann.

---

## Acceptance Criteria

**AC-01** – Überschriften gerendert  
Given: Schreibgeist antwortet mit `## Titel` oder `### Abschnitt`  
When: Die Antwort im Chat angezeigt wird  
Then: Der Text erscheint als formatierte Überschrift (größer, fett) — nicht mit Sternchen/Rauten

**AC-02** – Fettdruck gerendert  
Given: Schreibgeist antwortet mit `**wichtig**`  
When: Die Antwort angezeigt wird  
Then: Der Text erscheint fett — nicht als `**wichtig**`

**AC-03** – Listen gerendert  
Given: Schreibgeist antwortet mit `- Punkt 1\n- Punkt 2`  
When: Die Antwort angezeigt wird  
Then: Eine echte visuelle Liste erscheint mit Aufzählungszeichen

**AC-04** – Nutzer-Nachrichten unverändert  
Given: Der Nutzer tippt eine Nachricht  
When: Sie im Chat angezeigt wird  
Then: Sie erscheint unverändert als Plain Text (kein Markdown-Rendering für User-Bubbles)

**AC-05** – Visueller Stil passt zum bestehenden Design  
Given: Eine Schreibgeist-Antwort mit Markdown wird gerendert  
When: Der Nutzer die Antwort sieht  
Then: Schriftgröße, Farben und Abstände passen zum restlichen Chat-Design

---

## Out of Scope

- Code-Blöcke mit Syntax-Highlighting
- Tabellen-Rendering
- Bilder oder Links
- Rendering in Nutzer-Nachrichten
- Änderungen am Backend-System-Prompt

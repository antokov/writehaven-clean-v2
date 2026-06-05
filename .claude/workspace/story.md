# User Story: KI-Kapitelname-Vorschläge

**Story Type:** Business Feature

---

## User Story

Als Autor möchte ich per Knopfdruck mehrere Titelvorschläge für mein aktuelles Kapitel von der KI erhalten, die auf dem Inhalt der vorhandenen Szenen basieren, damit ich schnell einen passenden Kapitelnamen finden kann ohne selbst lange nachzudenken.

---

## Acceptance Criteria

**AC-01** — Given ich befinde mich in der Kapitel-Übersicht (nicht in einer Szene), When ich auf den Vorschlag-Button klicke, Then sendet die App die Szeneninhalte des Kapitels an Claude (Haiku) und zeigt 3–5 Titelvorschläge an.

**AC-02** — Given Vorschläge werden generiert, When ich auf den Button geklickt habe, Then sehe ich einen Lade-Indikator und der Button ist deaktiviert.

**AC-03** — Given die Vorschläge sind erschienen, When ich auf einen Vorschlag klicke, Then wird er in das Kapitel-Titel-Eingabefeld übernommen und gespeichert.

**AC-04** — Given das Kapitel hat keine Szenen oder alle Szenen sind leer, When ich auf den Vorschlag-Button klicke, Then erscheint eine sinnvolle Rückmeldung (z.B. „Keine Szeneninhalte vorhanden").

**AC-05** — Given Vorschläge wurden angezeigt, When ich einen davon anklicke, Then verschwinden die Vorschläge und der gewählte Titel ist im Feld.

---

## Out of Scope

- Vorschläge für Szenentitel
- Automatische Übernahme ohne Bestätigung
- Speichern der abgelehnten Vorschläge
- Streaming der Antwort

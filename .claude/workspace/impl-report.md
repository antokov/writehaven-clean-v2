# Implementation Report: KI-Kapitelname-Vorschläge

## Approach
Neuer Backend-Endpoint + State/Handler in ProjectView + UI in ChapterOverview. Kein neues File.

## Files Changed
- `backend/app.py` — Endpoint `POST /api/chapters/<cid>/suggest-title`
- `frontend/src/pages/ProjectView.jsx` — State, Handler, Props, ChapterOverview UI
- `frontend/src/styles/projectview.css` — `.chapter-suggestions`, grid-columns angepasst

## Key Details
- Haiku, max_tokens=256 (Titles sind kurz)
- Regex `\[[\s\S]*\]` für robuste JSON-Array-Extraktion
- Race-Guard: `capturedChapterId` nach await geprüft
- `saveChapterNow` direkt beim Übernehmen eines Vorschlags (kein Debounce)
- `chapter-head` grid: `1fr auto auto` (Input + Button + Meta)

## Edge Cases Handled
- EC-01/02: Keine/leere Szenen → `ok({"suggestions": []})` → Frontend zeigt nichts
- EC-03: API-Key fehlt → Fehlermeldung
- EC-04: Parse-Error → `{"error": "parse_error"}`
- EC-05: Race condition → capturedChapterId guard

## Tech Debt / Open Items
Keine

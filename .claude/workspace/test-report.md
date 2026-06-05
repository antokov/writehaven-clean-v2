# Test Report: KI-Kapitelname-Vorschläge

## Verdict: PASS

| AC | Status | Nachweis |
|----|--------|---------|
| AC-01 Vorschläge erscheinen | ✅ | `POST /api/chapters/${activeChapterId}/suggest-title` → `setTitleSuggestions` → chips gerendert |
| AC-02 Lade-Indikator | ✅ | `suggestingTitle` State → `disabled={suggestingTitle}`, Button-Text `'…'` |
| AC-03 Klick übernimmt Titel | ✅ | `onApplySuggestion` → `setChapterTitle` + `saveChapterNow` + `setTitleSuggestions([])` |
| AC-04 Keine Szenen | ✅ | Backend: `non_empty` leer → `ok({"suggestions": []})` → Frontend zeigt keine chips |
| AC-05 Vorschläge verschwinden | ✅ | `setTitleSuggestions([])` in `onApplySuggestion` |

| EC | Status |
|----|--------|
| EC-01/02 Keine/leere Szenen | ✅ |
| EC-03 API-Key fehlt | ✅ |
| EC-04 Parse-Error | ✅ regex + try/except |
| EC-05 Race condition | ✅ capturedChapterId guard |

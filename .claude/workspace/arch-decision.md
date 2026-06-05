# Architect Decision: KI-Kapitelname-Vorschläge

## Files to Modify

| Datei | Änderung |
|-------|---------|
| `backend/app.py` | Neuer Endpoint `POST /api/chapters/<cid>/suggest-title` |
| `frontend/src/pages/ProjectView.jsx` | State + Handler + Props an ChapterOverview |

## New Files to Create
Keine.

---

## Backend: Neuer Endpoint

**Route:** `POST /api/chapters/<int:cid>/suggest-title`  
**Platzierung:** Nach dem `extract_character_from_text` Endpoint, vor `return app`.

**Logik:**
1. Chapter laden + Projekt-Ownership prüfen
2. Alle Szenen des Kapitels laden (title + content[:500])
3. Buchsprache aus `chapter.project.language` (via JOIN oder separater Query)
4. Claude Haiku: System-Prompt → JSON-Array mit 3–5 Titeln
5. Array parsen, `ok({"suggestions": [...]})` zurückgeben

**System-Prompt:**
```
Du bist ein Titelgenerator für Romankapitel.
Analysiere die folgenden Szeneninhalte und schlage 3 bis 5 prägnante Kapiteltitel vor.
Antworte NUR mit einem JSON-Array von Strings. Kein Freitext, kein Markdown.
Beispiel: ["Titel 1", "Titel 2", "Titel 3"]
Schreibe die Titel auf {book_language}.
```

**User-Message:** Szenentitel + Szeneninhalt (je 500 Zeichen) aller Szenen des Kapitels.

---

## Frontend: Änderungen in ProjectView.jsx

**Neuer State:**
```js
const [titleSuggestions, setTitleSuggestions] = useState([]);
const [suggestingTitle, setSuggestingTitle]   = useState(false);
```

**Neuer Handler:**
```js
const handleSuggestChapterTitle = async () => {
  if (!activeChapterId || suggestingTitle) return;
  setSuggestingTitle(true);
  setTitleSuggestions([]);
  const capturedChapterId = activeChapterId;
  try {
    const r = await axios.post(`/api/chapters/${activeChapterId}/suggest-title`);
    if (activeChapterId !== capturedChapterId) return; // race guard
    if (r.data?.error || !r.data?.suggestions?.length) {
      setTitleSuggestions([]);
    } else {
      setTitleSuggestions(r.data.suggestions);
    }
  } catch (e) {
    setTitleSuggestions([]);
  } finally {
    setSuggestingTitle(false);
  }
};
```

**Neue Props an ChapterOverview:**
```jsx
<ChapterOverview
  ...
  onSuggestTitle={handleSuggestChapterTitle}
  suggestingTitle={suggestingTitle}
  titleSuggestions={titleSuggestions}
  onApplySuggestion={(title) => {
    setChapterTitle(title);
    patchChapterInList(activeChapterId, { title });
    setTitleSuggestions([]);
    saveChapterNow(activeChapterId, title);
  }}
/>
```

**In ChapterOverview — neue Props + UI:**
```jsx
function ChapterOverview({
  chapterTitle, setChapterTitle, lastChapterSavedAt, saveChapter,
  scenesOfActive, scenePreviewById, openScene, deleteScene, addScene,
  onSuggestTitle, suggestingTitle, titleSuggestions, onApplySuggestion  // NEU
})
```

Button neben dem Titel-Input:
```jsx
<div className="chapter-head">
  <input className="chapter-title-input" ... />
  <button className="btn small" onClick={onSuggestTitle} disabled={suggestingTitle}>
    {suggestingTitle ? '…' : '✦'}
  </button>
  <div className="chapter-meta">...</div>
</div>

{titleSuggestions.length > 0 && (
  <div className="chapter-suggestions">
    {titleSuggestions.map((s, i) => (
      <button key={i} className="btn small" onClick={() => onApplySuggestion(s)}>{s}</button>
    ))}
  </div>
)}
```

CSS (in `projectview.css`):
```css
.chapter-suggestions {
  display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem;
}
```

## Patterns Dev Must Follow
1. Backend: selbes Muster wie `extract_character_from_text` (Ownership → API-Key → DB → Claude → ok())
2. Buchsprache via `LANG_MAP` wie im extract-Endpoint (copy-paste Muster)
3. Race-Condition-Guard: `capturedChapterId` prüfen nach await
4. `saveChapterNow` beim Anwenden eines Vorschlags direkt aufrufen (kein 500ms Debounce)

## Constraints (DO NOT)
- **DO NOT** ChapterOverview in eine eigene Datei auslagern
- **DO NOT** Backend-Schreibgeist-Endpoint anfassen
- **DO NOT** neue CSS-Datei erstellen — CSS in `projectview.css`
- **DO NOT** Autosave-Debounce für die Titelübernahme nutzen — direkt `saveChapterNow`

## Reference Files
1. `backend/app.py` — extract_character_from_text ab Zeile ~2279 (Muster)
2. `frontend/src/pages/ProjectView.jsx` — ChapterOverview, saveChapterNow, handleExtract-Muster
3. `frontend/src/styles/projectview.css` — chapter-head Styles

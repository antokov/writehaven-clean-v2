# NLP Entity Recognition - MVP v0.1

## Overview

Automatic entity recognition for **PERSON** and **LOC** (location) entities while writing in the scene editor. The system uses spaCy NLP models to detect entities in real-time and provides quick-create workflows for new characters and locations.

## Features

### ✅ Live Highlighting
- **Debounced analysis** (600ms after typing stops)
- **Visual feedback**:
  - PERSON entities: Blue underline
  - LOC entities: Green underline
- **Language-aware**: Automatically uses German or English model based on project settings

### ✅ Fuzzy Matching
- Detects similar existing entities (≥90% similarity)
- Shows suggestion badge (`?`) for potential matches
- Example: "Jon" in text matches existing character "John"

### ✅ Quick-Create Workflow
- Click on highlighted entity to open action menu
- **For new entities**: "+ Create as Character/Location"
- **For suggestions**: "Link to [EntityName]" or "Ignore"
- Creates entity and navigates to respective section

### ✅ Persistent Mentions
- All entity mentions are saved to database
- Mentions track:
  - Text and type (PERSON/LOC)
  - Character offsets (start/end)
  - Optional link to existing character/worldnode
  - Ignore flag for dismissed suggestions

## Technical Details

### Backend

**Dependencies:**
- `spacy==3.7.2` - NLP processing
- `rapidfuzz==3.6.1` - Fuzzy string matching
- Models: `de_core_news_sm` (German), `en_core_web_sm` (English)

**Database:**
```sql
CREATE TABLE mention (
    id INTEGER PRIMARY KEY,
    scene_id INTEGER NOT NULL,
    text VARCHAR(200) NOT NULL,
    entity_type VARCHAR(20) NOT NULL,  -- PERSON or LOC
    start_offset INTEGER NOT NULL,
    end_offset INTEGER NOT NULL,
    character_id INTEGER,  -- FK to character
    worldnode_id INTEGER,  -- FK to worldnode
    ignored BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**API Endpoints:**
- `POST /api/scenes/:id/analyze` - Analyze paragraph for entities
- `GET /api/scenes/:id/mentions` - Get all mentions for scene
- `POST /api/scenes/:id/mentions` - Save mentions (bulk replace)
- `PUT /api/mentions/:id` - Update mention (link/ignore)
- `DELETE /api/mentions/:id` - Delete mention

### Frontend

**Component:** `EntityHighlighter.jsx`

**How it works:**
1. Textarea with transparent background overlays highlighting layer
2. Debounced analysis sends content to backend (600ms)
3. Entities rendered as `<mark>` elements in highlight layer
4. Scroll position synced between layers
5. Click handler opens tooltip with actions

**Styling:** Matches existing editor (monospace font, same padding/colors)

## Usage

### For Users

1. **Write naturally** in the scene editor
2. **Wait ~600ms** after typing - entities will be highlighted
3. **Click highlighted text** to see options:
   - Create new character/location
   - Link to existing entity (if suggestion appears)
   - Ignore suggestion

### For Developers

**Install spaCy models:**
```bash
# In backend directory with venv activated
python -m pip install https://github.com/explosion/spacy-models/releases/download/de_core_news_sm-3.7.0/de_core_news_sm-3.7.0-py3-none-any.whl
python -m pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0-py3-none-any.whl
```

**Test NLP service:**
```python
from nlp_service import extract_entities

text = "John Smith went to Paris yesterday."
entities = extract_entities(text, language="en")
# [{'text': 'John Smith', 'label': 'PERSON', 'start': 0, 'end': 10},
#  {'text': 'Paris', 'label': 'LOC', 'start': 19, 'end': 24}]
```

## Future Enhancements

### Phase 2 (Planned)
- [ ] Alias support (e.g., "Jon" = "Jonathan")
- [ ] Multi-word entity handling improvements
- [ ] Confidence scores display
- [ ] Batch entity management UI
- [ ] Export entity mentions as graph

### Phase 3 (Ideas)
- [ ] Custom entity types (ORG, EVENT, etc.)
- [ ] Relationship extraction from text
- [ ] Character co-occurrence analysis
- [ ] Timeline extraction for events
- [ ] TipTap integration for richer editing

## Known Limitations

- **Offset drift**: If user edits text before a mention, offsets become invalid → Re-analysis required
- **No real-time sync**: Highlights don't update during fast typing (by design - debounce prevents API spam)
- **Simple fuzzy matching**: Only compares entity text to existing names, not aliases
- **Language per project**: Cannot mix languages within same project
- **No undo**: Creating entity from mention is immediate (no confirmation dialog)

## Performance

- **Analysis latency**: ~100-300ms per paragraph (depends on text length)
- **Debounce**: 600ms prevents excessive API calls
- **Rate limiting**: Not yet implemented (TODO)

## Security

- **Authentication**: All endpoints require valid JWT token
- **Authorization**: Project ownership verified via scene → chapter → project chain
- **Input validation**: Text content sanitized, max length enforced
- **SQL injection**: Protected by SQLAlchemy ORM

## Credits

Built with:
- [spaCy](https://spacy.io/) - Industrial-strength NLP
- [rapidfuzz](https://github.com/maxbachmann/rapidfuzz) - Fast string matching
- React Hooks for state management
- Claude Code for implementation

---

**Version:** 0.1.0 (MVP)
**Last Updated:** 2025-10-28
**Status:** ✅ Ready for Testing

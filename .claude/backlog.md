# Project Backlog

## 🔴 Technical Debt
<!-- Items added by Architect post-dev review -->
<!-- Format: - [ ] TD-XX: description (introduced in: feature name, file: path) -->
- [ ] TD-01: `map` table remains in the database as an orphaned artefact.
- [ ] TD-02: Gallery and avatar image files are never deleted from `static/uploads/` when replaced or character is deleted (see FS-03). Drop it with a manual SQL migration when convenient. (introduced in: Remove Map Feature)

## 🟢 Architecture Log

- **2026-06-05** — Export-UI vereinheitlicht: `bookexport.css` komplett auf CSS-Variablen umgestellt. Alle Hardcoded-Farben und `border-radius`-Werte entfernt. Buttons auf globales `.btn`-System migriert. Nicht verwendete Legacy-Klassen (`.book-page`, `.book-controls`, etc.) entfernt.
- **2026-06-05** — KI-Kapitelname-Vorschläge: Endpoint `POST /api/chapters/<cid>/suggest-title` (Haiku, max 256 Tokens), 3–5 Vorschläge als JSON-Array, klickbare Chips in ChapterOverview, race-guard, Buchsprache via LANG_MAP.
- **2026-06-05** — Autoload „In dieser Szene": ⟳-Button in SceneManifestPanel, pure Frontend-Textsuche (case-insensitive, Namensteil-Split ≥3 Zeichen), kein Backend-Call. `sceneContent` als Prop aus ProjectView.
- **2026-06-05** — Charakter-Extraktion Buchsprache: `LANG_MAP` + Prompt-Ergänzung "Schreibe alle Feldwerte auf {book_language}" im extract-Endpoint. Fallback: Deutsch.
- **2026-06-05** — Charakter-Extraktion: Neuer Endpoint `POST /api/projects/<pid>/characters/<cid>/extract-from-text` (Haiku, max 50×300 Zeichen). Frontend: `applyExtracted` Merge-Funktion + Button in CharacterEditor-TabNav. Kein DB-Schema-Change.

## 🟡 Follow-up Stories
<!-- Items deferred by Dev or identified by Tester -->
<!-- Format: - [ ] FS-XX: description -->
- [x] FS-13: Schreibgeist — log `cache_read_input_tokens` per request — DONE (console log mit model, in, out, cache_write, cache_read).
- [ ] FS-15: Schreibgeist — Streaming für Szenen >3000 Wörter (Output-Tokens > 4096).
- [ ] FS-14: Schreibgeist — switch model to `claude-opus-4-8` (separate from caching change).
- [x] FS-01: Add Vitest unit tests for `paragraphsHTML` — DONE (16 tests in exportUtils.test.js)
- [x] FS-04: Connect Schreibgeist to real Claude/AI backend — DONE.
- [x] FS-07: Schreibgeist — selective context (chapters, scenes, characters) — DONE.
- [x] FS-12: Schreibgeist — „Aktuelle Szene" als auswählbarer Kontext — DONE.
- [ ] FS-10: Schreibgeist — add world nodes to context selector.
- [ ] FS-11: Schreibgeist — token estimate warning when many items selected.
- [ ] FS-08: Schreibgeist streaming responses (token-by-token display).
- [ ] FS-09: Persist Schreibgeist chat history per project in DB.
- [ ] FS-05: Add Schreibgeist tab to Characters and World sidebars (scope was limited to ProjectView).
- [ ] FS-06: Persist Schreibgeist chat context per project (currently session-only). in BookExport.jsx covering all EC inputs (single-newline, double-newline, empty, mixed, leading/trailing newlines).
- [ ] FS-16: Unit-Tests für `applyExtracted` in Characters.jsx (Vitest) — alle EC-Szenarien abdecken.
- [ ] FS-17: „Erzwingen"-Modus für Extraktion — Option zum Überschreiben bestehender Felder (aktuell: existing wins).
- [ ] FS-18: Beziehungs-Extraktion aus Text — Charakter-zu-Charakter-Beziehungen automatisch erkennen (eigene Story, deutlich komplexer).
- [ ] FS-02: Add Vitest/Playwright tests for character avatar upload flow (mock axios, test error handling, test EC-05 mid-switch guard).
- [ ] FS-03: Add a cleanup job / admin script to delete orphaned avatar files from `static/uploads/avatars/` when a character is deleted or its avatar replaced.

## 🟢 Feature Ideas
<!-- Ideas that came up during implementation but are out of scope -->
<!-- Format: - [ ] FI-XX: description -->

## 🔵 Open Questions
<!-- Unresolved assumptions from BA analysis -->
<!-- Format: - [ ] OQ-XX: question (raised in: feature name) -->
- [ ] OQ-01: Welche Docker-Netzwerkkonfiguration nutzt das NAS? Falls `host-gateway` nicht funktioniert, muss NAS-IP direkt in `DATABASE_URL` eingetragen werden. (raised in: NAS PostgreSQL Deployment)

## 🏛️ Architecture Log
<!-- One-line per feature: key structural decision made -->
<!-- Format: - [Feature Name]: summary of decision -->
- [Remove Map Feature (2026-06-01)]: Deleted 3 frontend files, removed 7 file edits; Map ORM model and 3 API routes removed; `map` DB table intentionally left to avoid data loss.
- [Fix Export Paragraph Rendering (2026-06-01)]: One-line regex fix in `paragraphsHTML` (`/\n\s*\n/` → `/\n+/`); single Enter in textarea now creates separate `<p>` in preview.
- [Character Avatar Upload (2026-06-01)]: New `POST /api/characters/<cid>/upload-avatar` endpoint; `CharacterAvatar` UI above tabs; `avatar_url` column was already in DB — no migration needed; files stored in `static/uploads/avatars/`.
- [Schreibgeist Markdown Rendering (2026-06-01)]: react-markdown installiert; AI-Bubbles verwenden ReactMarkdown-Komponente; User-Bubbles bleiben plain text; alle Styles im .sg-bubble--md Scope.
- [Schreibgeist Aktuelle Szene Kontext (2026-06-01)]: currentScene prop-drilling von ProjectView; neue „Aktuelle Szene"-Sektion als erster Block im Kontext-Panel; sceneSelected-State mit Auto-Reset bei Szenenwechsel; scene_id in entity_context payload; Backend SQL-Lookup mit project_id-Ownership, Inhalt auf 2000 Zeichen begrenzt.
- [Schreibgeist Multi-Entity Context (2026-06-01)]: Simplified to single multi-checkbox panel (characters + locations); removed scene/manual modes; backend union-deduplicates tagged scenes across all selected entities.
- [Schreibgeist Entity Context (2026-06-01)]: 3-way mode (Szene/Entität/Manuell); entity mode reverse-looks up all scenes tagged with selected character or location; full profile + scene contents sent to Claude.
- [Scene Context Manifest (2026-06-01)]: context_manifest JSON on Scene; SceneManifestPanel tag editor in Tools sidebar; Schreibgeist "Aus aktiver Szene" mode auto-loads full character profiles + world node descriptions.
- [Schreibgeist Context Selector (2026-06-01)]: Collapsible context picker in sidebar; select individual chapters, scenes, characters; backend loads full content for selected items and appends to system prompt.
- [Schreibgeist Live AI (2026-06-01)]: Real Claude API (claude-sonnet-4-6) connected; book context (title, chapters, characters) in system prompt; error handling for missing key.
- [UI/UX Consistency Pass (2026-06-01)]: Fixed 9 CSS inconsistencies: chat bubble radius, input/btn radius, tab animation pattern, CSS variable aliases, missing btn classes.
- [Schreibgeist Chat Panel (2026-06-01)]: Frontend-only prototype; tabs "Tools"/"Schreibgeist" in ProjectView right sidebar; chat UI with user/AI bubbles, typing indicator, mock responses; no backend.
- [Export Szenentrenner (2026-06-01)]: `<p class="scene-sep">` zwischen Szenen; CSS height:1.42em + scene-sep+p no-indent; Backend Spacer(15.62pt) + scene_break_next Flag für body_first_style.
- [Export Input Handling + Tests (2026-06-01)]: `escapeHtml`/`smartQuotes`/`paragraphsHTML` extrahiert nach `exportUtils.js`; 16 Vitest-Tests (EC-01–EC-08); FS-01 resolved; `vite.config.js` mit `test.environment: node`.
- [Export Absatzabstand entfernt (2026-06-01)]: 2 chirurgische Änderungen; `spaceAfter=0` in ReportLab `body_style`; `margin:0` in `.book p` CSS; Einzug und Kapitel-Stile unberührt.
- [Fix smartQuotes contextual detection (2026-06-01)]: Replaced blind toggle with prev-char heuristic; `"` after non-whitespace/non-bracket → CLOSE. Fixes single trailing `"` being wrongly rendered as `„`.
- [Character Gallery (2026-06-01)]: New `gallery_json` TEXT column on `character`; migration in `auto_migrate.py`; `POST/DELETE /api/characters/<cid>/gallery`; `CharacterGallery` + `GalleryLightbox` components; images stored in `static/uploads/gallery/<cid>/`.
- [NAS PostgreSQL Deployment (2026-06-02)]: Rein konfigurationsbasiert; `docker-compose.nas.yml` + `.env.nas.example` als NAS-Templates; `extra_hosts: host-gateway` für container→host-PostgreSQL-Verbindung; bestehender Code (auto_migrate, psycopg, create_all) bereits vollständig PostgreSQL-fähig.
- [Schreibgeist Prompt Caching (2026-06-03)]: `system` in `schreibgeist_chat` von string auf list umgebaut; stabiler Block (Rolle + Buchstruktur) mit `cache_control: ephemeral`; dynamischer Entity-Kontext-Block ohne Cache; 3 Zeilen geändert in app.py.
- [Schreibgeist Output-Limit (2026-06-03)]: `max_tokens` 1024→4096; "300 Wörter"-Instruction durch adaptive Längen-Instruction ersetzt; 2 Zeilen in app.py.
- [Schreibgeist → Szene übertragen (2026-06-03)]: Claude umschließt Szenentext mit `<scene>`-Tags; Backend parst + entfernt Tags; Frontend zeigt "In Szene übertragen"-Button wenn `scene_content` vorhanden + aktive Szene offen; `onApplyToScene` Callback via ProjectView → `setSceneContent`.
- [Schreibgeist Caching Fix (2026-06-03)]: `cache_control` von hardcodiertem base_system-Block auf dynamisches `system_blocks[-1]` verschoben; Cache deckt jetzt base_system + entity_context (den tatsächlich großen Teil).
- [Schreibgeist Modell-Auswahl (2026-06-03)]: Toggle "Haiku/Sonnet" zwischen Kontext-Panel und Input; `MODEL_MAP` im Backend mit Whitelist-Fallback; `model`-State im Frontend per Nachricht gesendet.
- [Schreibgeist Input-Truncation Fix (2026-06-03)]: Szeneninhalt-Limit (2000 Zeichen) und `[… Inhalt gekürzt]`-Marker entfernt; vollständiger Szenentext wird jetzt an Claude übergeben; 3 Zeilen → 1 Zeile in app.py.
- [Character Avatar Lightbox (2026-06-01)]: Click on avatar opens `AvatarLightbox` portal (90vw/85vh, Escape to close); separate edit-icon button triggers file picker; character name shown as caption.

## ✅ Done
<!-- Resolved items -->
<!-- Format: - [x] TD-XX: description (resolved in: feature name) -->

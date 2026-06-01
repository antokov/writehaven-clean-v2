# Project Backlog

## 🔴 Technical Debt
<!-- Items added by Architect post-dev review -->
<!-- Format: - [ ] TD-XX: description (introduced in: feature name, file: path) -->
- [ ] TD-01: `map` table remains in the database as an orphaned artefact.
- [ ] TD-02: Gallery and avatar image files are never deleted from `static/uploads/` when replaced or character is deleted (see FS-03). Drop it with a manual SQL migration when convenient. (introduced in: Remove Map Feature)

## 🟡 Follow-up Stories
<!-- Items deferred by Dev or identified by Tester -->
<!-- Format: - [ ] FS-XX: description -->
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
- [ ] FS-02: Add Vitest/Playwright tests for character avatar upload flow (mock axios, test error handling, test EC-05 mid-switch guard).
- [ ] FS-03: Add a cleanup job / admin script to delete orphaned avatar files from `static/uploads/avatars/` when a character is deleted or its avatar replaced.

## 🟢 Feature Ideas
<!-- Ideas that came up during implementation but are out of scope -->
<!-- Format: - [ ] FI-XX: description -->

## 🔵 Open Questions
<!-- Unresolved assumptions from BA analysis -->
<!-- Format: - [ ] OQ-XX: question (raised in: feature name) -->

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
- [Character Avatar Lightbox (2026-06-01)]: Click on avatar opens `AvatarLightbox` portal (90vw/85vh, Escape to close); separate edit-icon button triggers file picker; character name shown as caption.

## ✅ Done
<!-- Resolved items -->
<!-- Format: - [x] TD-XX: description (resolved in: feature name) -->

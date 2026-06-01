# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**WriteHaven** is a full-stack web app for creative writers to manage novels — structuring chapters/scenes, building characters and worlds, generating procedural maps, and exporting to PDF.

- **Backend:** Flask 3 REST API with JWT auth, SQLAlchemy ORM, SQLite (dev) / PostgreSQL (prod)
- **Frontend:** React 18 + Vite, React Router 6, i18next (EN/DE), Axios
- **E2E Tests:** Playwright (root level)
- **Unit Tests:** Vitest (frontend only)

---

## Commands

### Start local dev (two terminals)

```bash
# Backend
cd backend
.venv\Scripts\Activate.ps1   # Windows
python app.py                 # runs on http://localhost:5000

# Frontend
cd frontend
npm run dev                   # runs on http://localhost:5173, proxies /api/* → :5000
```

### Frontend

```bash
cd frontend
npm run dev              # dev server
npm run build            # production build
npm run test             # vitest unit tests
npm run test:coverage    # coverage report
```

### E2E (Playwright — from repo root)

```bash
npm test                 # headless
npm run test:headed      # with browser visible
npm run test:ui          # Playwright UI
npm run test:debug       # debug mode
```

### Backend (from `backend/`)

```bash
pytest                   # run all backend tests
pytest tests/test_foo.py::test_name   # single test
```

---

## Architecture

### Request flow

1. Browser hits Vite dev server → `/api/*` requests proxied to Flask on `:5000`
2. Axios (frontend) injects JWT `Authorization: Bearer <token>` header automatically
3. Flask validates token via `@token_auth_required` decorator
4. Ownership verified per resource (`verify_project_ownership()`, etc.) → 403 on mismatch

### Data model hierarchy

```
User
└── Project
    ├── Chapter → Scene → SceneNote / SceneTask
    ├── Character → CharacterNote / CharacterTask
    ├── WorldNode → WorldNodeNote / WorldNodeTask
    └── Map (procedurally generated, seed-based)
```

### Key source files

| File | Purpose |
|------|---------|
| `backend/app.py` | Flask app factory + **all** API route handlers |
| `backend/models.py` | SQLAlchemy ORM models for every entity |
| `backend/auto_migrate.py` | Idempotent column-add migrations run on startup |
| `backend/security_config.py` | Flask-Security-Too configuration |
| `backend/word_parser.py` | `.docx` import → chapter/scene hierarchy |
| `frontend/src/main.jsx` | Router setup, AuthProvider, i18n init |
| `frontend/src/context/AuthContext.jsx` | Auth state; token stored in `localStorage` |
| `frontend/src/pages/ProjectLayout.jsx` | Tab shell: Writing / Characters / World / Map / Export / Settings |
| `frontend/src/pages/MapView.jsx` | Procedural Voronoi world map (Simplex noise + d3-delaunay) |
| `frontend/src/i18n.js` | i18next config; translations in `src/locales/{en,de}.json` |

### Backend patterns

- All route handlers follow: ownership check → business logic → `ok()` / `not_found()` / `bad_request()` / `forbidden()` JSON helpers.
- `_loads()` / `_dumps()` used for safe JSON ↔ dict conversion throughout `app.py`.
- Schema migrations are handled by `auto_migrate.py` (not Alembic); add new columns there when changing models.

### Frontend patterns

- Axios instance with interceptors lives in `src/api/` — do not call `axios` directly.
- Page components in `src/pages/`, reusable UI in `src/components/`.
- Each major feature area has a dedicated CSS file alongside its component.
- Language preference stored in DB per user; `i18n.changeLanguage()` called on login/settings change.

---

## Environment variables

Copy `backend/.env.example` to `backend/.env` for local development. Key variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite path or PostgreSQL URL (default: `sqlite:///app.db`) |
| `SECRET_KEY` | Flask secret / JWT signing key |
| `SECURITY_PASSWORD_SALT` | Flask-Security password hashing salt |
| `ALLOWED_ORIGINS` | CORS whitelist (e.g. `http://localhost:5173`) |
| `RESEND_API_KEY` | Email sending via Resend (optional in dev) |
| `FRONTEND_URL` | Base URL for email confirmation/reset links |

---

## PDF export

Two parallel implementations exist — do not consolidate without testing both paths:

- **Backend:** ReportLab (`app.py` → `/api/projects/<id>/export-pdf`) — server-rendered, professional print layout with drop caps.
- **Frontend:** `html2pdf.js` in `BookExport.jsx` — browser-rendered, used as fallback / preview.

---

## Database migrations

There is no Alembic. Schema changes go into `backend/auto_migrate.py` as idempotent `ADD COLUMN IF NOT EXISTS` statements. The function runs automatically on every app startup.

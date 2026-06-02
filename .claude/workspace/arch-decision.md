# Architect Decision: NAS PostgreSQL Deployment

## Scope

Ausschließlich Deployment-Konfiguration — kein Anwendungscode wird geändert. Das Backend unterstützt PostgreSQL bereits vollständig via `DATABASE_URL`. Aufgabe ist das Erstellen von Deployment-Templates für das NAS.

## Codebase Assessment

| Was | Status |
|-----|--------|
| `auto_migrate.py` — PostgreSQL-Support | ✅ vorhanden, normalisiert URI, nutzt `psycopg` v3 |
| `app.py` — `DATABASE_URL`-Auswertung | ✅ vorhanden, delegiert an `auto_migrate.get_database_uri()` |
| `requirements.txt` — `psycopg[binary]` | ✅ vorhanden |
| `Dockerfile` — multi-stage, PostgreSQL-fähig | ✅ vorhanden |
| Lokales `.env` — SQLite | ✅ vorhanden, nicht anfassen |
| `docker-compose.nas.yml` | ❌ fehlt — muss erstellt werden |
| `.env.nas.example` | ❌ fehlt — muss erstellt werden |

## Files to Modify

Keine bestehenden Dateien werden geändert.

## New Files to Create

| Datei | Zweck |
|-------|-------|
| `docker-compose.nas.yml` | Docker Compose für NAS-Deployment mit PostgreSQL-Connection und Upload-Volume |
| `.env.nas.example` | NAS-spezifische Umgebungsvariablen-Vorlage |

## Patterns Dev Must Follow

**docker-compose.nas.yml:**
- Service-Name: `writehaven`
- Image: aus lokalem Dockerfile gebaut (`build: .`) ODER vorgefertigtes Image-Tag
- `env_file: .env.nas` (Nutzer benennt `.env.nas.example` → `.env.nas` um)
- `extra_hosts: ["host.docker.internal:host-gateway"]` — damit der Container NAS-PostgreSQL erreicht
- Volume für Uploads: `./uploads:/app/backend/static/uploads`
- Port: `8080:8080`
- `restart: unless-stopped`

**`.env.nas.example`:**
- `DATABASE_URL=postgresql+psycopg://writehaven:PASSWORT@host.docker.internal:5432/writehaven`
- Alle anderen Variablen aus `.env.example` übernehmen, NAS-spezifisch anpassen
- `ALLOWED_ORIGINS` auf NAS-URL setzen
- `FRONTEND_URL` auf NAS-URL setzen
- Kommentare auf Deutsch, mit PostgreSQL-Setup-Anweisungen (`psql`-Befehle)

## Constraints (DO NOT)

- DO NOT `.env` (lokale Dev-Konfiguration) anfassen
- DO NOT `auto_migrate.py`, `app.py`, `requirements.txt` oder `Dockerfile` ändern
- DO NOT Alembic oder andere Migrations-Tools einführen
- DO NOT einen separaten PostgreSQL-Container im docker-compose definieren (NAS-Postgres läuft nativ)
- DO NOT `network_mode: host` setzen (schlechte Praxis — `extra_hosts` reicht)

## Reference Files Dev Needs

1. `backend/.env.example` — Vorlage für alle Variablen
2. `backend/.env` — aktuelle lokale Konfiguration (nur lesen, nicht ändern)
3. `backend/auto_migrate.py` — zeigt wie URI normalisiert wird
4. `Dockerfile` — zeigt Build-Context und App-Pfade im Container

# Implementation Report: NAS PostgreSQL Deployment

## Approach

Rein konfigurationsbasiert — kein Anwendungscode geändert. Zwei neue Dateien erstellt, die ein schlüsselfertiges NAS-Deployment ermöglichen.

## Files Changed

| Datei | Art | Änderung |
|-------|-----|----------|
| `docker-compose.nas.yml` | NEU | Docker Compose für NAS: Build, Port 8080, `extra_hosts` für host.docker.internal, Upload-Volume, `restart: unless-stopped` |
| `.env.nas.example` | NEU | NAS-Env-Template: PostgreSQL-`DATABASE_URL`, alle benötigten Variablen mit deutschen Kommentaren und psql-Setup-Anleitung |

## Edge Cases Handled

| EC | Lösung |
|----|--------|
| EC-01 — `host.docker.internal` nicht auflösbar | `extra_hosts: host-gateway` in docker-compose.nas.yml |
| EC-02 — pg_hba.conf Hinweis | In `.env.nas.example` als Kommentar dokumentiert |
| EC-03 — Leere DB bei erstem Start | `db.create_all()` läuft beim App-Start automatisch — kein Handlungsbedarf |
| EC-04 — Uploads persistent | Volume `./uploads:/app/backend/static/uploads` in docker-compose.nas.yml |
| EC-05 — URI-Normalisierung | Bereits in `auto_migrate.py` gelöst — kein neuer Code nötig |

## Assumptions

- Nutzer benennt `.env.nas.example` → `.env.nas` um und trägt echte Werte ein
- NAS hat Docker + `docker compose` (v2) installiert
- PostgreSQL läuft nativ auf dem NAS-Host und ist für Docker-Netzwerk erreichbar

## Tech Debt

Keine neuen eingeführt.

## Open Items

Keine.

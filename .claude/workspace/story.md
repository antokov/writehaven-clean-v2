# User Story

**Als** Entwickler und Betreiber der WriteHaven-Instanz auf meinem NAS,
**möchte ich**, dass die App im NAS-Deployment PostgreSQL nutzt (statt SQLite),
**damit** die Daten persistent, wartbar und produktionsreif auf dem NAS gespeichert werden, während lokal weiterhin SQLite verwendet wird.

**Story Type:** Enabler

---

## Acceptance Criteria

**AC-01**
Given: Die App läuft lokal im Dev-Modus
When: `python app.py` gestartet wird (mit `.env` → `DATABASE_URL=sqlite:///app.db`)
Then: Verbindung zu SQLite — kein Postgres nötig, kein Fehler

**AC-02**
Given: Die App läuft als Docker-Container auf dem NAS
When: Der Container mit `DATABASE_URL=postgresql+psycopg://user:pass@host:5432/db` gestartet wird
Then: Verbindung zur PostgreSQL-Instanz auf dem NAS — alle Features funktionieren

**AC-03**
Given: PostgreSQL auf dem NAS ist frisch verbunden (leere DB)
When: Der Container startet
Then: `auto_migrate.py` legt alle Tabellen an (initiale Migration via Flask-SQLAlchemy `create_all`)

**AC-04**
Given: NAS-Deployment mit Volumes
When: Der Container neu gestartet oder ersetzt wird
Then: Upload-Dateien (Avatars, Gallery) und die PostgreSQL-Daten bleiben erhalten (persistente Volumes)

**AC-05**
Given: NAS-Deployment-Template (docker-compose.nas.yml + .env.nas.example)
When: Entwickler die Deployment-Dateien nutzen
Then: Alle erforderlichen Environment-Variablen sind dokumentiert und sinnvoll vorbefüllt

---

## Out of Scope

- Keine automatische Datenmigration von SQLite → PostgreSQL (kein Datentransfer-Tool)
- Kein Alembic / kein Schema-Versioning (bleibt auto_migrate.py)
- Keine Änderung an der lokalen Dev-Konfiguration
- Kein SSL/TLS für die Postgres-Verbindung (NAS-intern, LAN)
- Kein Kubernetes / kein Cloud-Deployment

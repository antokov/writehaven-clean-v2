# BA Analysis: NAS PostgreSQL Deployment

## Business Rules

**BR-01** — `DATABASE_URL` ist die einzige Schaltstelle zwischen SQLite und PostgreSQL.
Lokal: `sqlite:///app.db`. NAS: `postgresql+psycopg://user:pass@host:5432/dbname`.
`auto_migrate.py` und `app.py` erkennen den DB-Typ bereits anhand des URI-Präfixes.

**BR-02** — Uploads (Avatars, Galerie-Bilder) dürfen beim Container-Neustart nicht verloren gehen.
Pfad im Container: `/app/backend/static/uploads/` — muss als Docker-Volume gemountet werden.

**BR-03** — PostgreSQL auf dem NAS läuft nativ (nicht in Docker). Der Docker-Container muss den NAS-Host über das Docker-Bridge-Network erreichen.
Auf Synology/QNAP (Linux) ist `host.docker.internal` häufig nicht automatisch verfügbar — der Container muss die NAS-Host-IP (`--add-host=host.docker.internal:host-gateway`) oder `network_mode: host` nutzen.

**BR-04** — Die PostgreSQL-Datenbank und der User müssen vorab auf dem NAS angelegt sein (App erstellt keine DB, nur Tabellen).

**BR-05** — `auto_migrate.py` ruft `create_all()` nicht auf — das tut Flask-SQLAlchemy in `app.py` bei Start (`db.create_all()`). Die Funktion `auto_migrate()` fügt nur fehlende Spalten hinzu. Bei einer leeren PostgreSQL-DB muss `create_all()` zuerst laufen (passiert automatisch beim App-Start).

## Edge Cases

**EC-01** — `host.docker.internal` nicht auflösbar auf Linux-NAS:
→ Lösung: Im `docker-compose.nas.yml` `extra_hosts: ["host.docker.internal:host-gateway"]` setzen.

**EC-02** — PostgreSQL lässt keine Verbindung aus dem Docker-Netzwerk zu:
→ `pg_hba.conf` auf dem NAS muss `host all all 172.17.0.0/16 md5` (oder das jeweilige Docker-Subnetz) enthalten.
→ Und `postgresql.conf`: `listen_addresses = '*'` (oder NAS-IP).
→ Diese Konfiguration liegt außerhalb des Repos — wird in der `.env.nas.example` als Hinweis dokumentiert.

**EC-03** — Leere PostgreSQL-DB bei erstem Start:
→ Flask startet, `db.create_all()` legt alle Tabellen an, `auto_migrate()` findet `user`-Tabelle nicht (weil frisch) und gibt nur "schema created/verified" aus — korrekt.

**EC-04** — Uploads-Verzeichnis im Container nicht vorhanden:
→ Docker-Volume mountet auf `/app/backend/static/uploads/` — Flask erstellt Unterordner on demand (bereits implementiert).

**EC-05** — Falsche `DATABASE_URL`-Syntax (z.B. `postgres://` statt `postgresql://`):
→ `auto_migrate.py` normalisiert bereits beide Formen auf `postgresql+psycopg://`.

## Data Model Implications

Keine Änderung am Datenmodell. PostgreSQL-Schema wird durch `db.create_all()` + `auto_migrate.py` aufgebaut. Alle Migrations-Statements in `auto_migrate.py` sind bereits PostgreSQL-kompatibel (`information_schema.columns`, `EXTRACT(epoch FROM ...)`, etc.).

## Open Questions

**Q-01** [NON-BLOCKING] — Welche NAS-Host-Adresse soll im Template verwendet werden?
→ Assumption: `host.docker.internal` mit `extra_hosts: host-gateway` als Standard. Nutzer trägt eigene IP ein falls nötig.

**Q-02** [NON-BLOCKING] — Soll ein Setup-Script für den initialen PostgreSQL-User/DB-Anlage mitgeliefert werden?
→ Assumption: Nein. Nutzer hat PostgreSQL bereits installiert und kann `psql` selbst nutzen. Template dokumentiert die nötigen SQL-Befehle als Kommentar.

**Q-03** [NON-BLOCKING] — Soll die NAS-Version einen eigenen Frontend-Port exponieren oder hinter einem Reverse-Proxy (z.B. Nginx Proxy Manager) laufen?
→ Assumption: Container exponiert Port 8080 direkt. Reverse-Proxy ist Sache des Nutzers.

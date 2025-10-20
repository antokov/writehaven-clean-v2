# Supabase Setup Guide für WriteHaven

Dieses Dokument beschreibt, wie du WriteHaven mit Supabase einrichtest - sowohl für lokale Entwicklung als auch für Production.

## Inhaltsverzeichnis

1. [Voraussetzungen](#voraussetzungen)
2. [Supabase CLI Installation](#supabase-cli-installation)
3. [Lokale Entwicklung](#lokale-entwicklung)
4. [Production Deployment](#production-deployment)
5. [Migration zu Supabase](#migration-zu-supabase)
6. [Troubleshooting](#troubleshooting)

---

## Voraussetzungen

- Python 3.9+
- Node.js 18+ (für Frontend)
- Docker Desktop (für lokale Supabase-Entwicklung)
- Git

---

## Supabase CLI Installation

### Windows

**Option 1: Scoop (empfohlen)**
```powershell
scoop install supabase
```

**Option 2: npm**
```bash
npm install -g supabase
```

### macOS/Linux

**Homebrew:**
```bash
brew install supabase/tap/supabase
```

**npm:**
```bash
npm install -g supabase
```

### Verifizierung

```bash
supabase --version
```

---

## Lokale Entwicklung

### 1. Supabase lokal starten

```bash
# Im Projekt-Root-Verzeichnis
supabase start
```

Dies startet alle Supabase-Services (PostgreSQL, Auth, Storage, etc.) in Docker-Containern.

**Wichtige URLs nach dem Start:**
- API URL: `http://localhost:54321`
- DB URL: `postgresql://postgres:postgres@localhost:54322/postgres`
- Studio URL: `http://localhost:54323` (Supabase Dashboard)
- Inbucket URL: `http://localhost:54324` (Email Testing)

### 2. Datenbank-Schema anwenden

```bash
# Migrations anwenden
supabase db push

# Oder: Migrations einzeln ausführen
supabase migration up
```

### 3. Test-Daten laden (optional)

```bash
# Seed-Daten laden
supabase db seed
```

Dies lädt Test-Daten aus `supabase/seed.sql`:
- Test-User: `test@test.com` / `test123`
- Beispiel-Projekt mit Kapiteln, Szenen, Charakteren

### 4. Backend konfigurieren

Erstelle eine `.env` Datei im `backend/` Verzeichnis:

```bash
cd backend
cp .env.example .env
```

Bearbeite die `.env` und aktiviere die lokale Supabase-Verbindung:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:54322/postgres
SECRET_KEY=dev-secret-key-change-in-production
FLASK_ENV=development
```

### 5. Backend starten

```bash
# Im backend/ Verzeichnis
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
python app.py
```

Backend läuft auf `http://localhost:5000`

### 6. Frontend starten

```bash
# Im frontend/ Verzeichnis
npm install
npm run dev
```

Frontend läuft auf `http://localhost:5173`

---

## Production Deployment

### 1. Supabase-Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle ein kostenloses Konto
3. Klicke auf "New Project"
4. Wähle einen Namen, Region und Passwort
5. Warte ca. 2 Minuten auf die Bereitstellung

### 2. Migrations anwenden

**Option A: Via CLI (empfohlen)**

```bash
# Mit deinem Supabase-Projekt verknüpfen
supabase link --project-ref your-project-ref

# Migrations anwenden
supabase db push
```

**Option B: Via Supabase Dashboard**

1. Öffne dein Projekt im Supabase Dashboard
2. Gehe zu **SQL Editor**
3. Kopiere den Inhalt von `supabase/migrations/20250101000000_initial_schema.sql`
4. Führe das SQL aus
5. Wiederhole für `20250102000000_enable_rls.sql`

### 3. Datenbank-URL abrufen

1. Gehe zu **Settings** > **Database**
2. Scrolle zu **Connection string** > **URI**
3. Kopiere die URL (Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)

### 4. Backend-Deployment

#### Render.com (empfohlen)

1. Erstelle eine neue Web Service auf [render.com](https://render.com)
2. Verbinde dein GitHub-Repository
3. Konfiguration:
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && gunicorn wsgi:app`
   - **Environment Variables:**
     ```
     DATABASE_URL=postgresql+psycopg://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
     SECRET_KEY=[generiere mit: python -c "import secrets; print(secrets.token_hex(32))"]
     FLASK_ENV=production
     ALLOWED_ORIGINS=https://your-frontend-domain.com
     ```

#### Railway, Fly.io, Heroku

Ähnliche Schritte - stelle sicher, dass du die Environment-Variablen korrekt setzt.

### 5. Frontend-Deployment

#### Vercel (empfohlen)

1. Gehe zu [vercel.com](https://vercel.com)
2. Importiere dein GitHub-Repository
3. Konfiguration:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```

#### Netlify

Ähnliche Schritte wie Vercel.

### 6. Row Level Security (RLS) überprüfen

RLS ist bereits durch die Migration `20250102000000_enable_rls.sql` aktiviert.

**Wichtig:** Die aktuellen RLS-Policies gehen davon aus, dass du **Supabase Auth** verwendest. Wenn du weiterhin deine eigene JWT-Auth nutzt, musst du die Policies anpassen oder RLS temporär deaktivieren:

```sql
-- RLS temporär deaktivieren (NUR für Testing!)
ALTER TABLE project DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapter DISABLE ROW LEVEL SECURITY;
-- etc.
```

---

## Migration zu Supabase

### Von lokaler SQLite zu Supabase

1. **Daten exportieren:**
   ```bash
   # Im backend/ Verzeichnis
   python -c "
   from app import create_app, db
   from models import User, Project, Chapter, Scene, Character, WorldNode
   import json

   app = create_app()
   with app.app_context():
       # Export als JSON
       users = [{'email': u.email, 'name': u.name} for u in User.query.all()]
       projects = [{'title': p.title, 'user_email': p.user.email} for p in Project.query.all()]
       # etc.

       with open('export.json', 'w') as f:
           json.dump({'users': users, 'projects': projects}, f)
   "
   ```

2. **Supabase aufsetzen** (siehe oben)

3. **Daten importieren** (manuell oder via Script)

### Von anderer PostgreSQL-Datenbank

1. **Schema vergleichen:**
   ```bash
   supabase db diff --schema public
   ```

2. **Daten migrieren:**
   ```bash
   # Dump erstellen
   pg_dump -h old-host -U old-user -d old-db > backup.sql

   # Auf Supabase importieren
   psql "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" < backup.sql
   ```

---

## Troubleshooting

### "Migration failed" Fehler

**Lösung:**
```bash
# Status prüfen
supabase status

# Migrations zurücksetzen
supabase db reset

# Erneut versuchen
supabase db push
```

### "Connection refused" beim Backend-Start

**Ursachen:**
1. Supabase ist nicht gestartet: `supabase start`
2. Falsche DATABASE_URL in `.env`
3. Port 54322 ist belegt

**Lösung:**
```bash
# Prüfen ob Supabase läuft
supabase status

# Neu starten
supabase stop
supabase start
```

### RLS blockiert Zugriff

**Problem:** Alle API-Requests geben 403 oder leere Ergebnisse zurück.

**Ursache:** RLS ist aktiviert, aber deine JWT-Claims passen nicht zu den Policies.

**Lösung 1:** RLS temporär deaktivieren (nur für Development!)
```sql
-- Via Supabase Studio SQL Editor
ALTER TABLE project DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapter DISABLE ROW LEVEL SECURITY;
ALTER TABLE scene DISABLE ROW LEVEL SECURITY;
ALTER TABLE character DISABLE ROW LEVEL SECURITY;
ALTER TABLE worldnode DISABLE ROW LEVEL SECURITY;
ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;
```

**Lösung 2:** Policies anpassen für deine JWT-Struktur
```sql
-- Beispiel: Eigene JWT-Claims verwenden
CREATE POLICY "Users can view own projects"
    ON project
    FOR SELECT
    USING (
        (current_setting('request.jwt.claims', true)::json->>'user_id')::integer = user_id
    );
```

### Docker-Fehler beim `supabase start`

**Problem:** Docker Desktop läuft nicht oder ist nicht installiert.

**Lösung:**
1. Docker Desktop installieren und starten
2. `supabase start` erneut ausführen

### Port-Konflikte

Wenn Ports bereits belegt sind, kannst du sie in `supabase/config.toml` ändern:

```toml
[api]
port = 54321  # Ändere auf freien Port

[db]
port = 54322  # Ändere auf freien Port
```

---

## Weitere Ressourcen

- [Supabase Dokumentation](https://supabase.com/docs)
- [Supabase CLI Referenz](https://supabase.com/docs/reference/cli)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/current/index.html)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## Support

Bei Problemen:
1. Prüfe die [Troubleshooting-Sektion](#troubleshooting)
2. Öffne ein Issue im GitHub-Repository
3. Suche in der [Supabase Community](https://github.com/supabase/supabase/discussions)

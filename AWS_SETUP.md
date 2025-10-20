# AWS Deployment Guide für WriteHaven

Diese Anleitung beschreibt, wie du WriteHaven vollständig auf AWS hostest mit:
- **AWS App Runner** (Backend)
- **AWS Amplify** (Frontend)
- **AWS RDS PostgreSQL** (Datenbank)
- **AWS S3** (Optional: File Storage für Cover-Images)

---

## Inhaltsverzeichnis

1. [Übersicht der AWS-Services](#übersicht-der-aws-services)
2. [Voraussetzungen](#voraussetzungen)
3. [Schritt 1: AWS RDS PostgreSQL einrichten](#schritt-1-aws-rds-postgresql-einrichten)
4. [Schritt 2: Datenbank-Schema initialisieren](#schritt-2-datenbank-schema-initialisieren)
5. [Schritt 3: AWS App Runner (Backend) konfigurieren](#schritt-3-aws-app-runner-backend-konfigurieren)
6. [Schritt 4: AWS Amplify (Frontend) konfigurieren](#schritt-4-aws-amplify-frontend-konfigurieren)
7. [Schritt 5: S3 für Cover-Images (Optional)](#schritt-5-s3-für-cover-images-optional)
8. [Environment-Variablen](#environment-variablen)
9. [Troubleshooting](#troubleshooting)

---

## Übersicht der AWS-Services

```
┌─────────────────┐
│   AWS Amplify   │  ← Frontend (React + Vite)
│  (Frontend)     │     https://xxxxx.amplifyapp.com
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  AWS App Runner │  ← Backend (Flask API)
│   (Backend)     │     https://xxxxx.awsapprunner.com
└────────┬────────┘
         │ PostgreSQL
         ▼
┌─────────────────┐
│   AWS RDS       │  ← Datenbank (PostgreSQL)
│  (PostgreSQL)   │     writehaven-db.xxxxx.rds.amazonaws.com
└─────────────────┘
         +
┌─────────────────┐
│   AWS S3        │  ← File Storage (Optional)
│  (Storage)      │     s3://writehaven-uploads
└─────────────────┘
```

---

## Voraussetzungen

- AWS Account (Free Tier reicht für Testing)
- GitHub Repository mit WriteHaven-Code
- AWS CLI installiert (optional, aber empfohlen)
- PostgreSQL Client (z.B. pgAdmin, DBeaver oder `psql`)

---

## Schritt 1: AWS RDS PostgreSQL einrichten

### 1.1 RDS-Instanz erstellen

1. **Öffne AWS Console** → Suche nach **RDS**
2. Klicke auf **Create database**
3. Konfiguration:

   **Engine Options:**
   - Engine type: **PostgreSQL**
   - Version: **PostgreSQL 15.x** (oder neueste)

   **Templates:**
   - Wähle **Free tier** (für Testing) oder **Production** (für Production)

   **Settings:**
   - DB instance identifier: `writehaven-db`
   - Master username: `writehaven` (oder beliebig)
   - Master password: `[SICHERES PASSWORT]` ← **Notieren!**

   **Instance configuration:**
   - DB instance class: `db.t3.micro` (Free Tier) oder `db.t4g.micro`

   **Storage:**
   - Allocated storage: 20 GB
   - Storage type: General Purpose SSD (gp3)
   - Enable storage autoscaling: ✓ (max 100 GB)

   **Connectivity:**
   - VPC: Default VPC
   - Public access: **Yes** ← Wichtig für App Runner
   - VPC security group: Create new → `writehaven-db-sg`
   - Availability Zone: No preference

   **Database authentication:**
   - Database authentication options: **Password authentication**

   **Additional configuration:**
   - Initial database name: `writehaven`
   - Backup retention period: 7 days
   - Enable automated backups: ✓

4. Klicke auf **Create database**
5. Warte 5-10 Minuten auf die Bereitstellung

### 1.2 Security Group konfigurieren

1. Gehe zu **EC2** → **Security Groups**
2. Suche nach `writehaven-db-sg`
3. **Inbound rules** → **Edit inbound rules**
4. Füge hinzu:
   - Type: **PostgreSQL**
   - Port: **5432**
   - Source: **0.0.0.0/0** (für Testing) oder **App Runner IP-Range** (für Production)
   - Description: `Allow PostgreSQL from App Runner`

5. Klicke **Save rules**

### 1.3 Connection String abrufen

1. Gehe zu **RDS** → **Databases** → `writehaven-db`
2. Unter **Connectivity & security** findest du:
   - **Endpoint**: `writehaven-db.xxxxxxxxxxxxx.eu-central-1.rds.amazonaws.com`
   - **Port**: `5432`

3. **Connection String erstellen:**
   ```
   postgresql+psycopg://writehaven:[PASSWORD]@writehaven-db.xxxxx.eu-central-1.rds.amazonaws.com:5432/writehaven
   ```

---

## Schritt 2: Datenbank-Schema initialisieren

### Option A: Via pgAdmin / DBeaver (GUI)

1. Verbinde dich mit der RDS-Instanz:
   - Host: `writehaven-db.xxxxx.eu-central-1.rds.amazonaws.com`
   - Port: `5432`
   - Database: `writehaven`
   - Username: `writehaven`
   - Password: `[DEIN PASSWORT]`

2. Das Schema wird **automatisch** vom Backend erstellt (via SQLAlchemy)

### Option B: Via Flask/Python (Automatisch)

Das Backend erstellt automatisch alle Tabellen beim ersten Start via SQLAlchemy:

```python
# In app.py (bereits implementiert)
db.Model.metadata.create_all(bind=db.engine, checkfirst=True)
```

Keine manuellen SQL-Statements nötig!

---

## Schritt 3: AWS App Runner (Backend) konfigurieren

**Du hast bereits App Runner eingerichtet!** Hier sind die wichtigen Schritte zur Aktualisierung:

### 3.1 App Runner-Konfiguration überprüfen

1. Öffne **AWS Console** → **App Runner**
2. Wähle deinen Service: `writehaven-backend`
3. Gehe zu **Configuration** → **Edit**

### 3.2 Build-Einstellungen

```yaml
# Bereits konfiguriert
Build command: pip install -r requirements.txt
Start command: gunicorn --bind :8080 wsgi:app
Runtime: Python 3
Port: 8080
```

### 3.3 Environment-Variablen setzen

Gehe zu **Configuration** → **Environment variables** und füge hinzu:

```bash
# Datenbank
DATABASE_URL=postgresql+psycopg://writehaven:[PASSWORD]@writehaven-db.xxxxx.eu-central-1.rds.amazonaws.com:5432/writehaven

# Flask
FLASK_ENV=production
SECRET_KEY=[generiere mit: python -c "import secrets; print(secrets.token_hex(32))"]
JWT_EXPIRATION_HOURS=24

# CORS (Amplify Frontend URL)
ALLOWED_ORIGINS=https://master.d1gko3imo6msya.amplifyapp.com

# Optional: AWS Region
AWS_REGION=eu-central-1
```

**WICHTIG:** Ersetze:
- `[PASSWORD]` mit deinem RDS-Passwort
- `writehaven-db.xxxxx...` mit deinem RDS-Endpoint
- `https://master.d1gko3imo6msya.amplifyapp.com` mit deiner Amplify-URL

### 3.4 Health Check (wichtig!)

App Runner erwartet einen Health Check Endpoint:

**Bereits implementiert in deinem Backend:**
```
GET /api/health
```

Konfiguration in App Runner:
- Health check path: `/api/health`
- Health check interval: 20 seconds
- Timeout: 5 seconds
- Unhealthy threshold: 5

### 3.5 Deploy auslösen

Nachdem du die Environment-Variablen gesetzt hast:
1. Klicke **Deploy**
2. Warte 3-5 Minuten
3. Teste den Backend-Endpoint:
   ```bash
   curl https://[YOUR-APP-RUNNER-URL]/api/health
   ```

---

## Schritt 4: AWS Amplify (Frontend) konfigurieren

**Du hast bereits Amplify eingerichtet!** Hier die wichtigen Updates:

### 4.1 Environment-Variablen setzen

1. Öffne **AWS Console** → **Amplify**
2. Wähle deine App: `writehaven-clean-v2`
3. Gehe zu **Environment variables** (in der linken Sidebar)
4. Füge hinzu:

```bash
VITE_API_URL=https://[YOUR-APP-RUNNER-URL]
```

Beispiel:
```bash
VITE_API_URL=https://inbyh8jcxy.eu-central-1.awsapprunner.com
```

### 4.2 Build-Einstellungen überprüfen

Amplify sollte automatisch diese `amplify.yml` verwenden:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

Falls nicht vorhanden, erstelle `amplify.yml` im Root:

### 4.3 Redeploy

1. Klicke **Redeploy this version** oder pushe zu GitHub
2. Amplify baut automatisch neu

### 4.4 Custom Domain (Optional)

1. Gehe zu **Domain management**
2. Füge deine Domain hinzu (z.B. `writehaven.com`)
3. Folge den DNS-Anweisungen

---

## Schritt 5: S3 für Cover-Images (Optional)

Aktuell speichert dein Backend Cover-Images lokal. Für Production empfehle ich S3:

### 5.1 S3 Bucket erstellen

1. Öffne **AWS Console** → **S3**
2. Klicke **Create bucket**
3. Konfiguration:
   - Bucket name: `writehaven-uploads-[UNIQUE-ID]`
   - Region: `eu-central-1` (gleiche wie RDS)
   - Block all public access: **Deaktivieren** (oder nur für CloudFront)
   - Bucket versioning: Optional

4. Erstelle den Bucket

### 5.2 Bucket Policy (Öffentlicher Lesezugriff)

Gehe zu **Permissions** → **Bucket policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::writehaven-uploads-[UNIQUE-ID]/*"
    }
  ]
}
```

### 5.3 Backend für S3 anpassen

Installiere boto3:
```bash
pip install boto3
```

Update `backend/app.py`:
```python
import boto3
from werkzeug.utils import secure_filename

s3 = boto3.client('s3',
    region_name=os.getenv('AWS_REGION', 'eu-central-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

@app.post("/api/projects/<int:pid>/upload-cover")
@token_required
def upload_project_cover(current_user, pid):
    # ... existing code ...

    # Upload zu S3
    bucket_name = os.getenv('S3_BUCKET_NAME')
    s3_key = f"covers/{uuid.uuid4().hex}.{ext}"

    s3.upload_fileobj(
        file,
        bucket_name,
        s3_key,
        ExtraArgs={'ContentType': file.content_type}
    )

    cover_url = f"https://{bucket_name}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{s3_key}"

    # Update Projekt
    p.cover_image_url = cover_url
    db.session.commit()

    return ok({"cover_url": cover_url})
```

---

## Environment-Variablen

### Backend (App Runner)

```bash
# Pflicht
DATABASE_URL=postgresql+psycopg://writehaven:PASSWORD@writehaven-db.xxxxx.eu-central-1.rds.amazonaws.com:5432/writehaven
SECRET_KEY=[32-character-hex-string]
FLASK_ENV=production
ALLOWED_ORIGINS=https://master.d1gko3imo6msya.amplifyapp.com

# Optional
JWT_EXPIRATION_HOURS=24
AWS_REGION=eu-central-1
S3_BUCKET_NAME=writehaven-uploads-xxxxx
```

### Frontend (Amplify)

```bash
# Pflicht
VITE_API_URL=https://inbyh8jcxy.eu-central-1.awsapprunner.com

# Optional (für Analytics etc.)
VITE_AWS_REGION=eu-central-1
```

---

## Troubleshooting

### Problem: App Runner kann nicht auf RDS zugreifen

**Ursache:** Security Group blockiert Verbindung

**Lösung:**
1. Gehe zu **RDS** → `writehaven-db` → **Security Groups**
2. Füge Inbound Rule hinzu: `0.0.0.0/0` auf Port `5432`
3. Oder: Nutze VPC Peering zwischen App Runner und RDS

### Problem: CORS-Fehler im Frontend

**Ursache:** `ALLOWED_ORIGINS` im Backend stimmt nicht mit Amplify-URL überein

**Lösung:**
1. Prüfe deine Amplify-URL: `https://master.d1gko3imo6msya.amplifyapp.com`
2. Setze `ALLOWED_ORIGINS` in App Runner exakt auf diese URL
3. Redeploy Backend

### Problem: "Database connection failed"

**Ursachen:**
1. Falsche DATABASE_URL
2. RDS-Instanz nicht erreichbar
3. Falsches Passwort

**Lösung:**
```bash
# Teste Verbindung manuell
psql "postgresql://writehaven:PASSWORD@writehaven-db.xxxxx.eu-central-1.rds.amazonaws.com:5432/writehaven"
```

### Problem: App Runner Health Check fails

**Ursache:** Backend antwortet nicht auf `/api/health`

**Lösung:**
1. Prüfe Logs in App Runner → **Logs**
2. Stelle sicher, dass Backend startet
3. Teste lokal:
   ```bash
   curl http://localhost:5000/api/health
   ```

### Problem: Build-Fehler in Amplify

**Ursache:** Frontend findet `VITE_API_URL` nicht

**Lösung:**
1. Setze `VITE_API_URL` in Amplify Environment Variables
2. Prüfe, dass Prefix `VITE_` vorhanden ist (wichtig für Vite!)

---

## Kosten-Übersicht (ca.)

| Service | Free Tier | Nach Free Tier |
|---------|-----------|----------------|
| RDS (db.t3.micro) | 750h/Monat | ~$15/Monat |
| App Runner | 0 | ~$5-20/Monat (je nach Traffic) |
| Amplify | 1000 Build-Minuten | $0.01/Build-Minute |
| S3 | 5GB Storage | $0.023/GB |

**Geschätzte monatliche Kosten:** $5-30 (nach Free Tier)

---

## Nächste Schritte

1. ✅ RDS PostgreSQL einrichten
2. ✅ App Runner mit Environment-Variablen konfigurieren
3. ✅ Amplify mit `VITE_API_URL` konfigurieren
4. ⚠️ Custom Domain hinzufügen (optional)
5. ⚠️ SSL-Zertifikat für Backend (App Runner macht das automatisch)
6. ⚠️ CloudWatch Logging aktivieren
7. ⚠️ Backups automatisieren (RDS macht das automatisch)

---

## Weitere Ressourcen

- [AWS App Runner Dokumentation](https://docs.aws.amazon.com/apprunner/)
- [AWS Amplify Dokumentation](https://docs.aws.amazon.com/amplify/)
- [AWS RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [AWS S3 Dokumentation](https://docs.aws.amazon.com/s3/)

---

## Support

Bei Problemen:
1. Prüfe AWS CloudWatch Logs (App Runner → Logs)
2. Prüfe Amplify Build Logs
3. Teste Backend Health Check: `curl https://[APP-RUNNER-URL]/api/health`

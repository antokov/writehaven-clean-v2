# Migration zu Flask-Security-Too

Dieses Dokument beschreibt die Migration des Auth-Systems von einem selbstgebauten JWT-System zu **Flask-Security-Too**.

## ✨ Neue Features

Nach der Migration hast du folgende neue Auth-Features:

- ✅ **Email-Verifizierung** - Neue User müssen ihre Email-Adresse bestätigen
- ✅ **Passwort-Reset** - "Passwort vergessen" Flow mit Email-Link
- ✅ **Stärkere Passwort-Hashes** - bcrypt statt pbkdf2
- ✅ **Login-Tracking** - Automatisches Tracking von Login-Zeit, IP, Login-Count
- ✅ **Account-Management** - Active/Inactive Status für User

## 📋 Migrations-Schritte

### 1. Backend Dependencies installieren

```bash
cd backend
pip install -r requirements.txt
```

Neue Dependencies:
- `Flask-Security-Too[common]==5.4.3`
- `Flask-Mailman==1.0.0`
- `email-validator==2.1.0`
- `bcrypt==4.1.2`

### 2. Datenbank-Backup erstellen

**WICHTIG:** Erstelle ein Backup deiner Datenbank bevor du die Migration ausführst!

**SQLite:**
```bash
# Backup erstellen
cp backend/app.db backend/app.db.backup
```

**PostgreSQL:**
```bash
# Backup erstellen
pg_dump -U username database_name > backup.sql
```

### 3. Datenbank-Migration ausführen

Das Migrations-Script fügt automatisch die neuen Felder hinzu und migriert bestehende User:

```bash
cd backend
python migrate_users_to_flask_security.py
```

Das Script:
- Fügt neue Felder hinzu: `fs_uniquifier`, `active`, `confirmed_at`
- Benennt `password_hash` zu `password` um
- Generiert `fs_uniquifier` für alle bestehenden User
- Markiert alle bestehenden User als "confirmed" und "active"

### 4. Umgebungsvariablen konfigurieren

Kopiere `.env.example` und passe die neuen Variablen an:

```bash
cp .env.example .env
```

**Neue Environment Variables:**

```bash
# Flask-Security-Too
SECURITY_PASSWORD_SALT=your-random-salt-change-in-production

# Email Backend
EMAIL_BACKEND=console  # Für lokal: 'console', für Production: 'smtp'
SECURITY_EMAIL_SENDER=noreply@writehaven.com
FRONTEND_URL=http://localhost:5173

# SMTP (nur für Production)
# MAIL_SERVER=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USE_TLS=true
# MAIL_USERNAME=your-email@gmail.com
# MAIL_PASSWORD=your-app-password
```

### 5. Server neu starten

```bash
cd backend
python app.py
# oder
gunicorn -w 4 -b 0.0.0.0:5000 "backend.app:create_app()"
```

### 6. Frontend Routes testen

Neue Frontend-Seiten:
- `/login` - Login/Register (erweitert mit "Passwort vergessen"-Link)
- `/forgot-password` - Passwort-Reset anfragen
- `/reset-password?token=...` - Neues Passwort setzen
- `/confirm-email?token=...` - Email-Adresse bestätigen

## 📧 Email-Konfiguration

### Lokal: Console Backend

Für lokale Entwicklung werden Emails in die Konsole geschrieben:

```bash
EMAIL_BACKEND=console
```

Emails erscheinen dann so in deinem Terminal:

```
================================================================================
📧 EMAIL WÜRDE GESENDET WERDEN
================================================================================
Von: noreply@writehaven.com
An: user@example.com
Betreff: WriteHaven - Please confirm your email

Hallo,

bitte bestätige deine Email-Adresse:
http://localhost:5173/confirm-email?token=abc123...

================================================================================
```

### Production: SMTP

Für Production konfiguriere SMTP (z.B. Gmail, AWS SES, SendGrid):

```bash
EMAIL_BACKEND=smtp
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

**Gmail-Hinweis:** Du brauchst ein [App-Passwort](https://support.google.com/accounts/answer/185833), nicht dein normales Gmail-Passwort!

## 🔐 Sicherheits-Features

### Email-Verifizierung

Email-Verifizierung ist standardmäßig aktiviert (`SECURITY_CONFIRMABLE=True`).

**Verhalten:**
- Neue User müssen ihre Email bestätigen
- Login ohne Bestätigung wird abgelehnt
- Bestehende User (vor Migration) sind automatisch bestätigt

**Email-Bestätigung deaktivieren:**

In `backend/security_config.py`:
```python
"SECURITY_CONFIRMABLE": False,  # Keine Email-Bestätigung
```

### Passwort-Reset

**Flow:**
1. User klickt auf "Passwort vergessen?" im Login
2. User gibt Email-Adresse ein
3. Email mit Reset-Link wird gesendet
4. User setzt neues Passwort über den Link

**Sicherheit:**
- Reset-Token sind zeitlich begrenzt
- Keine User-Enumeration (immer Success-Message, auch wenn Email nicht existiert)

## 🧪 Testing

### Lokales Testing (Console Backend)

1. Backend starten:
```bash
cd backend
python app.py
```

2. Frontend starten:
```bash
cd frontend
npm run dev
```

3. Neuen User registrieren:
   - Gehe zu `http://localhost:5173/login`
   - Klicke "Registrieren"
   - Email + Passwort eingeben
   - In der Backend-Konsole erscheint die Confirmation-Email
   - Kopiere den Link und öffne ihn im Browser

4. Passwort-Reset testen:
   - Gehe zu `http://localhost:5173/login`
   - Klicke "Passwort vergessen?"
   - Email eingeben
   - Reset-Link aus der Backend-Konsole kopieren
   - Neues Passwort setzen

## 🔄 API-Änderungen

### Neue Endpoints

```
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/confirm-email
```

### Geänderte Responses

**Register:** (wenn Email-Confirmation aktiviert)
```json
{
  "message": "Registrierung erfolgreich. Bitte bestätige deine Email-Adresse.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User",
    "confirmed": false
  }
}
```

**Login Response:**
```json
{
  "token": "...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User",
    "language": "en",
    "confirmed": true,  // NEU
    "created_at": "2024-01-01T12:00:00"
  }
}
```

## ❓ Troubleshooting

### Problem: "fs_uniquifier erforderlich" Fehler

**Lösung:** Migrations-Script ausführen:
```bash
python backend/migrate_users_to_flask_security.py
```

### Problem: Emails werden nicht versendet

**Lösung:**
1. Prüfe `EMAIL_BACKEND` in `.env`
2. Bei `console`: Schaue in die Backend-Konsole
3. Bei `smtp`: Prüfe SMTP-Credentials

### Problem: "Invalid token" bei Email-Links

**Lösung:**
1. Prüfe dass `SECURITY_PASSWORD_SALT` gesetzt ist
2. Prüfe dass `SECRET_KEY` nicht geändert wurde
3. Token sind zeitlich begrenzt - generiere einen neuen

### Problem: Bestehende User können sich nicht mehr anmelden

**Lösung:**
1. Migrations-Script ausführen
2. Prüfe dass `password` Spalte die Hashes enthält
3. Im Notfall: User über `/api/auth/forgot-password` Password neu setzen lassen

## 🚀 Production Deployment

### AWS / Cloud

1. Setze Environment Variables in deiner Cloud-Plattform:
```bash
EMAIL_BACKEND=smtp
MAIL_SERVER=email-smtp.eu-central-1.amazonaws.com  # AWS SES
FRONTEND_URL=https://your-app.com
```

2. **WICHTIG:** Generiere sichere Secrets:
```bash
python -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"
python -c "import secrets; print('SECURITY_PASSWORD_SALT=' + secrets.token_hex(32))"
```

3. Führe Migration auf Production-DB aus (mit Backup!):
```bash
python migrate_users_to_flask_security.py
```

## 📚 Weitere Informationen

- [Flask-Security-Too Dokumentation](https://flask-security-too.readthedocs.io/)
- [Flask-Mailman Dokumentation](https://waynerv.github.io/flask-mailman/)

---

Bei Fragen oder Problemen: Issue auf GitHub erstellen!

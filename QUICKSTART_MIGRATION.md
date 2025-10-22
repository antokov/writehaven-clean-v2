# 🚀 Quickstart: Flask-Security-Too Migration

**Schnellanleitung** um die Migration durchzuführen und zu testen.

## 1. Backend Dependencies installieren

```bash
cd backend
pip install -r requirements.txt
```

## 2. Datenbank-Backup (WICHTIG!)

```bash
# SQLite
cp app.db app.db.backup

# Oder PostgreSQL
# pg_dump -U username database_name > backup.sql
```

## 3. Datenbank migrieren

```bash
python migrate_users_to_flask_security.py
```

Antworte mit `ja` wenn du nach dem Backup gefragt wirst.

## 4. Environment Variables

Erstelle oder aktualisiere deine `.env`:

```bash
# Minimal für lokales Testing
EMAIL_BACKEND=console
SECURITY_EMAIL_SENDER=noreply@writehaven.com
FRONTEND_URL=http://localhost:5173
```

## 5. Backend starten

```bash
python app.py
```

## 6. Frontend starten (neues Terminal)

```bash
cd frontend
npm install  # Falls noch nicht gemacht
npm run dev
```

## 7. Testen

### Test 1: Registrierung mit Email-Bestätigung

1. Öffne `http://localhost:5173/login`
2. Klicke auf "Registrieren"
3. Gib Email + Passwort + Name ein
4. **Schaue in die Backend-Konsole** - dort erscheint die Confirmation-Email:

```
================================================================================
📧 EMAIL WÜRDE GESENDET WERDEN
================================================================================
Von: noreply@writehaven.com
An: test@example.com
Betreff: WriteHaven - Please confirm your email

[... Email-Inhalt mit Link ...]
```

5. Kopiere den Confirmation-Link aus der Konsole
6. Öffne den Link im Browser
7. Du solltest automatisch eingeloggt und zur App weitergeleitet werden

### Test 2: Passwort vergessen

1. Gehe zu `http://localhost:5173/login`
2. Klicke auf "Passwort vergessen?"
3. Gib deine Email ein
4. Schaue in die Backend-Konsole für den Reset-Link
5. Öffne den Reset-Link
6. Setze ein neues Passwort
7. Login mit dem neuen Passwort

### Test 3: Login mit bestehendem User

Alle User die vor der Migration existierten:
- Sind automatisch "confirmed"
- Können sich normal anmelden
- Passwörter funktionieren weiterhin

## ✅ Fertig!

Wenn alle Tests erfolgreich waren, ist die Migration abgeschlossen.

## 📚 Weitere Infos

Siehe [MIGRATION_FLASK_SECURITY.md](MIGRATION_FLASK_SECURITY.md) für Details.

## ⚠️ Troubleshooting

### Problem: "fs_uniquifier erforderlich"
→ Migrations-Script nochmal ausführen

### Problem: Emails werden nicht in Console angezeigt
→ Prüfe dass `EMAIL_BACKEND=console` in `.env` gesetzt ist

### Problem: "Invalid token" bei Links
→ Token sind 24h gültig, generiere einen neuen

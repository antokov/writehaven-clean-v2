# E2E Tests mit Playwright

## Setup

Die Tests sind bereits eingerichtet. Du brauchst nur:

```bash
npm install
```

## Tests ausführen

### Voraussetzungen

1. **Backend muss laufen** auf `http://localhost:5000`
   ```bash
   cd backend
   python app.py
   ```

2. **Test-User muss existieren** mit den Credentials:
   - Email: `test@test.ch`
   - Password: `test123`

### Test-Kommandos

```bash
# Alle Tests ausführen (headless)
npm test

# Tests mit UI-Modus (empfohlen zum Debuggen)
npm run test:ui

# Tests mit sichtbarem Browser
npm run test:headed

# Tests im Debug-Modus
npm run test:debug
```

## Was wird getestet?

Die Tests decken die **Schreiben-Sektion** (Writing/ProjectView) ab:

1. ✅ **Kapitel erstellen** - Neues Kapitel mit Default-Titel
2. ✅ **Szene erstellen** - Neue Szene in einem Kapitel
3. ✅ **Text schreiben** - Text in Szene schreiben mit Autosave
4. ✅ **Kapitel umbenennen** - Kapitel-Titel ändern und speichern
5. ✅ **Szene umbenennen** - Szenen-Titel ändern und speichern
6. ✅ **Zwischen Szenen wechseln** - Content bleibt erhalten
7. ✅ **Szene löschen** - Szene entfernen mit Bestätigung
8. ✅ **Kapitel löschen** - Kapitel entfernen mit Bestätigung

## Struktur

```
e2e/
  writing.spec.js   - Tests für die Schreiben-Sektion
  README.md         - Diese Datei

playwright.config.js - Playwright-Konfiguration
```

## Hinweise

- **Autosave**: Die Tests warten auf die Autosave-Delays (600ms für Szenen, 500ms für Kapitel)
- **Cleanup**: Nach jedem Test wird das erstellte Projekt automatisch gelöscht
- **Isolation**: Jeder Test startet mit einem frischen Projekt

## Tipps

### UI-Modus verwenden
Der beste Weg, die Tests zu entwickeln und zu debuggen:

```bash
npm run test:ui
```

Das öffnet eine interaktive UI, wo du:
- Tests einzeln ausführen kannst
- Jeden Schritt durchgehen kannst
- Screenshots siehst
- Die Browser DevTools nutzen kannst

### Einzelnen Test ausführen
```bash
npx playwright test -g "should create a new chapter"
```

### Screenshots bei Fehlern
Screenshots werden automatisch bei Fehlern erstellt und sind in `test-results/` zu finden.

## Fehlerbehebung

### Frontend startet nicht automatisch
Falls das Frontend nicht automatisch startet, starte es manuell:

```bash
cd frontend
npm run dev
```

Dann die Tests ohne `webServer`:
```bash
npx playwright test --config=playwright.config.js
```

### Test-User existiert nicht
Erstelle den Test-User:

```bash
cd frontend
# Registriere dich mit test@test.ch / test123
```

Oder nutze einen anderen User und passe die Credentials in `e2e/writing.spec.js` an.

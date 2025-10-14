# Test Quick Start Guide

Schnellanleitung zum Ausführen der Tests in deinem WriteHaven-Projekt.

## Backend Tests (Python)

### 1. Setup (einmalig)

```bash
cd backend
pip install -r requirements.txt
```

### 2. Tests ausführen

```bash
# Alle Tests
pytest

# Mit Coverage
pytest --cov
```

**Erwartetes Ergebnis**: Alle Tests sollten grün sein (PASSED).

### Was wird getestet?

- ✅ Database Models (Project, Chapter, Scene, Character, WorldNode)
- ✅ API Endpoints (alle CRUD-Operationen)
- ✅ Cascade Deletes
- ✅ JSON-Felder (profile_json, relations_json)
- ✅ Error Handling (404, Validation)
- ✅ Ordering (order_index)

**Test-Dateien**: `backend/tests/test_*.py`

---

## Frontend Tests (JavaScript)

### 1. Setup (einmalig)

```bash
cd frontend
npm install
```

### 2. Tests ausführen

```bash
# Alle Tests (Watch-Mode)
npm test

# Einmalig ausführen
npm test -- --run

# Mit Coverage
npm run test:coverage
```

**Erwartetes Ergebnis**: Alle Tests sollten grün sein.

### Was wird getestet?

- ✅ Modal Component (Öffnen/Schließen, Click-Handler)
- ✅ TopNav Component (Navigation, Router-Integration)
- ✅ SiteHeader Component (Logo, Links, Buttons)
- ✅ API Client (alle Endpoints gemockt)

**Test-Dateien**: `frontend/src/tests/**/*.test.{js,jsx}`

---

## Schnellcheck - Alles funktioniert?

### Backend
```bash
cd backend
pytest -v --tb=short
```

Suche nach: `===== X passed in Y.YYs =====`

### Frontend
```bash
cd frontend
npm test -- --run
```

Suche nach: `Test Files  X passed (X)`

---

## Bei Fehlern

### Backend-Fehler

**Import-Fehler**:
```bash
pip install -r requirements.txt
```

**DB-Fehler**: Tests verwenden In-Memory DB, keine Konfiguration nötig.

### Frontend-Fehler

**Module nicht gefunden**:
```bash
npm install
```

**Tests nicht gefunden**: Stelle sicher, du bist im `frontend/` Verzeichnis.

---

## Nächste Schritte

1. **Lies die vollständige Dokumentation**: [TESTING.md](./TESTING.md)
2. **Füge eigene Tests hinzu** für neue Features
3. **Prüfe Coverage**: Ziel ist >80% Backend, >70% Frontend
4. **Integriere in CI/CD** für automatische Tests bei jedem Push

---

## Wichtige Befehle im Überblick

| Task | Backend | Frontend |
|------|---------|----------|
| **Alle Tests** | `pytest` | `npm test -- --run` |
| **Watch-Mode** | `pytest -f` | `npm test` |
| **Coverage** | `pytest --cov` | `npm run test:coverage` |
| **Nur eine Datei** | `pytest tests/test_models.py` | `npm test Modal` |
| **Verbose** | `pytest -v` | `npm test -- --reporter=verbose` |

---

## Test-Philosophie

### Backend (pytest)
- **Unit Tests**: Testen einzelne Models isoliert
- **Integration Tests**: Testen API-Endpoints End-to-End
- **Fixtures**: Wiederverwendbare Test-Daten in `conftest.py`

### Frontend (Vitest)
- **Component Tests**: Testen Rendering und User-Interaktionen
- **API Tests**: Testen API-Client mit Mocks
- **User-Focused**: Teste was User sehen/machen, nicht Implementierung

---

## Erfolgsmetriken

Nach dem Ausführen aller Tests solltest du sehen:

### Backend
```
===== X passed in Y.YYs =====
Coverage: XX%
```

### Frontend
```
✓ src/tests/components/Modal.test.jsx (X)
✓ src/tests/components/TopNav.test.jsx (X)
✓ src/tests/components/SiteHeader.test.jsx (X)
✓ src/tests/api/api.test.js (X)

Test Files  X passed (X)
     Tests  XX passed (XX)
```

---

## Support

Bei Fragen oder Problemen:
1. Lies [TESTING.md](./TESTING.md) für Details
2. Prüfe Test-Output auf spezifische Fehler
3. Stelle sicher, alle Dependencies sind installiert

**Happy Testing! 🧪✅**

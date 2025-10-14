# WriteHaven Testing Guide

Diese Dokumentation beschreibt, wie du Tests für das WriteHaven-Projekt ausführst und erweiterst.

## Übersicht

Das Projekt verfügt über umfassende Test-Suites für:
- **Backend**: Python-Tests mit pytest
- **Frontend**: JavaScript-Tests mit Vitest und React Testing Library

## Backend Tests (Python/pytest)

### Setup

1. **Virtuelle Umgebung aktivieren** (falls noch nicht geschehen):
   ```bash
   cd backend
   # Windows
   .venv\Scripts\activate
   # Linux/Mac
   source .venv/bin/activate
   ```

2. **Test-Dependencies installieren**:
   ```bash
   pip install -r requirements.txt
   ```

### Tests ausführen

```bash
# Alle Tests ausführen
pytest

# Tests mit ausführlicher Ausgabe
pytest -v

# Nur Unit-Tests
pytest -m unit

# Nur Integration-Tests
pytest -m integration

# Mit Coverage-Report
pytest --cov=. --cov-report=html

# Bestimmte Test-Datei
pytest tests/test_models.py

# Bestimmte Test-Klasse
pytest tests/test_models.py::TestProjectModel

# Bestimmter Test
pytest tests/test_models.py::TestProjectModel::test_create_project
```

### Test-Struktur

```
backend/
├── pytest.ini                    # Pytest-Konfiguration
├── tests/
│   ├── __init__.py
│   ├── conftest.py              # Fixtures und Setup
│   ├── test_models.py           # Unit-Tests für Models
│   ├── test_api_projects.py     # API-Tests für Projects
│   ├── test_api_chapters.py     # API-Tests für Chapters
│   ├── test_api_scenes.py       # API-Tests für Scenes
│   ├── test_api_characters.py   # API-Tests für Characters
│   └── test_api_world.py        # API-Tests für World
```

### Verfügbare Fixtures

Alle Tests haben Zugriff auf folgende Fixtures (siehe `conftest.py`):

- `app`: Flask-App-Instanz
- `client`: Test-Client für HTTP-Requests
- `db`: Datenbank-Session
- `sample_project`: Test-Projekt
- `sample_chapter`: Test-Kapitel
- `sample_scene`: Test-Szene
- `sample_character`: Test-Charakter
- `sample_worldnode`: Test-World-Element

### Eigene Tests schreiben

Beispiel für einen neuen Test:

```python
import pytest

@pytest.mark.unit
def test_my_feature(db, sample_project):
    """Test: Meine neue Funktion"""
    # Arrange
    data = {"title": "Test"}

    # Act
    result = my_function(data)

    # Assert
    assert result is not None
    assert result["title"] == "Test"
```

## Frontend Tests (Vitest/React Testing Library)

### Setup

1. **In das Frontend-Verzeichnis wechseln**:
   ```bash
   cd frontend
   ```

2. **Dependencies installieren** (falls noch nicht geschehen):
   ```bash
   npm install
   ```

### Tests ausführen

```bash
# Alle Tests ausführen (watch mode)
npm test

# Einmalig alle Tests ausführen
npm test -- --run

# Mit UI
npm run test:ui

# Mit Coverage
npm run test:coverage

# Bestimmte Test-Datei
npm test -- src/tests/components/Modal.test.jsx

# Im Watch-Mode mit Pattern
npm test -- Modal
```

### Test-Struktur

```
frontend/
├── vitest.config.js              # Vitest-Konfiguration
├── src/
│   ├── tests/
│   │   ├── setup.js              # Test-Setup und Globals
│   │   ├── components/           # Component-Tests
│   │   │   ├── Modal.test.jsx
│   │   │   ├── TopNav.test.jsx
│   │   │   └── SiteHeader.test.jsx
│   │   └── api/                  # API-Tests
│   │       └── api.test.js
```

### Component Tests schreiben

Beispiel für einen Component-Test:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('sollte Text anzeigen', () => {
    render(<MyComponent text="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('sollte auf Click reagieren', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<MyComponent onClick={onClick} />);

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Mit Router testen

Wenn deine Component React Router verwendet:

```jsx
import { MemoryRouter } from 'react-router-dom';

const renderWithRouter = (component, initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      {component}
    </MemoryRouter>
  );
};
```

### API-Mocking

```jsx
import { vi } from 'vitest';
import api from '../../api';

vi.mock('../../api');

it('sollte Daten laden', async () => {
  api.get = vi.fn().mockResolvedValue({
    data: [{ id: 1, title: 'Test' }]
  });

  // Dein Test hier
});
```

## Test Coverage

### Backend Coverage

Nach dem Ausführen von `pytest --cov`:
- Terminal zeigt Coverage-Übersicht
- HTML-Report in `htmlcov/index.html`

```bash
# Coverage-Report im Browser öffnen
# Windows
start htmlcov/index.html
# Linux
xdg-open htmlcov/index.html
# Mac
open htmlcov/index.html
```

### Frontend Coverage

Nach dem Ausführen von `npm run test:coverage`:
- Terminal zeigt Coverage-Übersicht
- HTML-Report in `coverage/index.html`

```bash
# Coverage-Report im Browser öffnen
# Windows
start coverage/index.html
# Linux
xdg-open coverage/index.html
# Mac
open coverage/index.html
```

## CI/CD Integration

### Backend Tests in CI

```yaml
# .github/workflows/backend-tests.yml
- name: Run Backend Tests
  run: |
    cd backend
    pip install -r requirements.txt
    pytest --cov --cov-report=xml
```

### Frontend Tests in CI

```yaml
# .github/workflows/frontend-tests.yml
- name: Run Frontend Tests
  run: |
    cd frontend
    npm install
    npm test -- --run --coverage
```

## Best Practices

### Allgemein

1. **Tests vor Code schreiben** (TDD) wenn möglich
2. **Aussagekräftige Test-Namen** verwenden
3. **Arrange-Act-Assert** Pattern befolgen
4. **Unabhängige Tests** schreiben (keine gegenseitigen Abhängigkeiten)
5. **Fixtures/Mocks** für externe Dependencies verwenden

### Backend

1. Verwende `@pytest.mark.unit` für Unit-Tests
2. Verwende `@pytest.mark.integration` für API-Tests
3. Teste immer Edge-Cases (leere Werte, ungültige IDs, etc.)
4. Teste Cascade-Deletes und Foreign Key Constraints
5. Verwende Fixtures für wiederkehrende Test-Daten

### Frontend

1. Teste User-Interaktionen, nicht Implementierungsdetails
2. Verwende `screen.getByRole()` statt `getByTestId()` wenn möglich
3. Teste Accessibility (ARIA-Labels, Rollen)
4. Mock externe API-Calls
5. Teste Loading- und Error-States

## Troubleshooting

### Backend

**Problem**: `ModuleNotFoundError: No module named 'pytest'`
**Lösung**: `pip install -r requirements.txt`

**Problem**: Datenbankfehler bei Tests
**Lösung**: Tests verwenden In-Memory SQLite, keine Konfiguration nötig

**Problem**: Tests hängen
**Lösung**: Prüfe auf offene Transaktionen, nutze `db.session.rollback()`

### Frontend

**Problem**: `Cannot find module 'vitest'`
**Lösung**: `npm install`

**Problem**: Tests finden Components nicht
**Lösung**: Prüfe Imports und stelle sicher, dass alle Dependencies installiert sind

**Problem**: `ReferenceError: ResizeObserver is not defined`
**Lösung**: Bereits in `setup.js` gemocked - stelle sicher, dass Setup geladen wird

## Neue Tests hinzufügen

### Backend

1. Erstelle neue Datei in `backend/tests/`
2. Importiere benötigte Fixtures aus `conftest.py`
3. Verwende passende Marker (`@pytest.mark.unit` oder `@pytest.mark.integration`)
4. Schreibe Tests nach AAA-Pattern

### Frontend

1. Erstelle neue Datei in `frontend/src/tests/`
2. Importiere Testing Library Utilities
3. Rendere Component mit notwendigem Context (Router, etc.)
4. Teste User-Verhalten und erwartete Ausgaben

## Wichtige Testing-Utilities

### Backend (pytest)

- `pytest.fixture`: Wiederverwendbare Test-Daten
- `pytest.mark`: Test-Kategorisierung
- `assert`: Assertions
- `db.session`: Datenbank-Operationen
- `client.get/post/put/delete`: HTTP-Requests

### Frontend (Vitest/Testing Library)

- `render()`: Component rendern
- `screen`: Elemente finden
- `userEvent`: User-Interaktionen simulieren
- `waitFor()`: Auf asynchrone Updates warten
- `vi.fn()`: Mock-Funktionen
- `vi.mock()`: Module mocken

## Continuous Testing

Für schnelles Feedback während der Entwicklung:

**Backend**:
```bash
pytest --watch  # (mit pytest-watch installiert)
# oder
pytest -f       # (mit pytest-xdist)
```

**Frontend**:
```bash
npm test        # Läuft automatisch im Watch-Mode
```

## Ziel: Test Coverage

Angestrebte Coverage-Ziele:
- **Backend**: > 80% Code Coverage
- **Frontend**: > 70% Code Coverage
- **Kritische Pfade**: 100% Coverage

Fokus auf:
- Alle API-Endpoints
- Model-Validierung
- Business-Logik
- User-Interaktionen
- Error-Handling

## Ressourcen

- [Pytest Documentation](https://docs.pytest.org/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

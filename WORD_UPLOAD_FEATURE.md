# Word-Upload Feature

## Übersicht

Beim Erstellen eines neuen Projekts kannst du optional ein bestehendes Word-Dokument (.doc oder .docx) hochladen. Das Dokument wird automatisch analysiert und in Kapitel und Szenen aufgeteilt.

## Wie es funktioniert

### 1. Frontend (CreateProjectModal)

- Neues Modal mit zwei Feldern:
  - **Projektname** (Pflichtfeld)
  - **Word-Dokument hochladen** (optional)
- File-Upload mit Drag & Drop Support
- Auto-fill Projektname aus Dateiname

### 2. Backend (Word-Parsing)

Das Backend analysiert das Word-Dokument und erkennt automatisch:

#### Kapitel-Erkennung:
- **Überschriften**: Heading 1, Heading 2 Styles
- **Patterns**:
  - "Kapitel 1" / "Chapter 1"
  - "Teil 1" / "Part 1"
  - "1. Titel" oder "1 Titel"
  - Römische Zahlen (I, II, III, etc.)

#### Szenen-Erkennung:
- Abschnitte zwischen Kapitel-Überschriften
- Separatoren: `***`, `---`, `___` (3 oder mehr Zeichen)
- Automatische Titel-Generierung aus erstem Satz (max 60 Zeichen)

### 3. Fallback-Logik

Falls keine Kapitel erkannt werden:
- Erstellt automatisch "Kapitel 1"
- Gesamter Text wird als "Szene 1" hinzugefügt

Falls Kapitel ohne Szenen:
- Kapiteltext wird automatisch aufgeteilt
- Oder als einzelne Szene gespeichert

## Beispiel-Struktur

### Eingabe (Word-Dokument):
```
Kapitel 1: Der Anfang

Es war einmal...

***

Und dann geschah etwas Unerwartetes.

Kapitel 2

Die Geschichte geht weiter...
```

### Ausgabe (Datenbank):
```
Projekt: "Mein Buch"
├── Kapitel 1: Der Anfang
│   ├── Szene 1: "Es war einmal..."
│   │   Content: "Es war einmal..."
│   └── Szene 2: "Und dann geschah etwas..."
│       Content: "Und dann geschah etwas Unerwartetes."
└── Kapitel 2
    └── Szene 1: "Die Geschichte geht weiter..."
        Content: "Die Geschichte geht weiter..."
```

## API-Endpunkte

### POST /api/projects

#### Mit Word-Upload:
```http
POST /api/projects
Content-Type: multipart/form-data
Authorization: Bearer <token>

title=Mein Buch
file=<word-dokument.docx>
```

#### Ohne Word-Upload (wie bisher):
```http
POST /api/projects
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Mein Buch",
  "description": "..."
}
```

## Technische Details

### Dependencies:
- **python-docx**: Word-Dokument Parsing
- **lxml**: XML-Verarbeitung für .docx

### Datei-Größenlimit:
- Standard Flask-Limit: 16MB
- Kann in Config angepasst werden: `app.config['MAX_CONTENT_LENGTH']`

### Unterstützte Formate:
- `.docx` (Office Open XML)
- `.doc` (Legacy-Format, eingeschränkt)

### Fehlerbehandlung:
- Bei Parsing-Fehler wird Projekt nicht erstellt
- Benutzer erhält detaillierte Fehlermeldung
- Rollback der Datenbank-Transaktion

## Zukünftige Erweiterungen

Mögliche Verbesserungen:
- [ ] Unterstützung für .txt, .rtf, .odt
- [ ] Fortschrittsanzeige bei großen Dateien
- [ ] Vorschau der erkannten Struktur vor dem Import
- [ ] Manuelle Anpassung der Kapitel/Szenen-Aufteilung
- [ ] Export-Funktion (Projekt → Word)
- [ ] Charaktere aus Text extrahieren (KI-gestützt)

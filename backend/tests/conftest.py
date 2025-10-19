"""
Pytest Configuration und Fixtures für WriteHaven Backend Tests
"""
import os
import sys
import pytest
import tempfile

# Sicherstellen, dass das backend-Modul importiert werden kann
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

# Cleanup: Entferne gecachte Module um Doppel-Imports zu vermeiden
for mod in list(sys.modules.keys()):
    if mod.startswith('models') or mod.startswith('backend.models'):
        del sys.modules[mod]


@pytest.fixture(scope="session")
def app():
    """
    Erstellt eine Flask-App-Instanz für die gesamte Test-Session.
    Verwendet eine In-Memory SQLite-Datenbank.
    """
    # Temporäre Testdatenbank
    db_fd, db_path = tempfile.mkstemp()

    # Test-Konfiguration VOR dem Import
    os.environ["SQLITE_PATH"] = db_path
    os.environ["TESTING"] = "1"
    os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"

    # Import und App erstellen
    from app import create_app

    test_app = create_app()
    test_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{db_path}",
        "WTF_CSRF_ENABLED": False,
    })

    # Tabellen werden bereits von create_app erstellt
    yield test_app

    # Cleanup
    os.close(db_fd)
    try:
        os.unlink(db_path)
    except:
        pass


@pytest.fixture(scope="function")
def client(app):
    """Test-Client für HTTP-Requests"""
    return app.test_client()


@pytest.fixture(scope="function")
def db(app):
    """
    Bietet Zugriff auf die Datenbank.
    Jeder Test bekommt eine saubere DB.
    """
    from extensions import db as _db

    # Stelle sicher, dass wir im App-Kontext sind
    with app.app_context():
        # Cleanup vor dem Test
        try:
            _db.session.remove()
        except:
            pass

        # Alle Tabellen leeren - mit besserer Fehlerbehandlung
        try:
            # Lösche in der richtigen Reihenfolge (Foreign Keys beachten)
            _db.session.execute(_db.text("DELETE FROM scene"))
            _db.session.execute(_db.text("DELETE FROM chapter"))
            _db.session.execute(_db.text("DELETE FROM worldnode"))
            _db.session.execute(_db.text("DELETE FROM character"))
            _db.session.execute(_db.text("DELETE FROM project"))
            _db.session.execute(_db.text("DELETE FROM \"user\""))  # user ist reserviertes Wort
            _db.session.commit()
        except Exception as e:
            _db.session.rollback()
            # Ignoriere Fehler wenn Tabellen nicht existieren beim ersten Durchlauf
            if "no such table" not in str(e).lower():
                print(f"Warning during DB cleanup: {e}")

        yield _db

        # Nach dem Test cleanup
        try:
            _db.session.remove()
        except:
            pass


@pytest.fixture
def sample_user(db, app):
    """Erstellt einen Test-Benutzer"""
    # Importiere Models aus app, nicht lokal
    from app import User

    with app.app_context():
        user = User(
            email="test@example.com",
            name="Test User"
        )
        user.set_password("testpassword123")
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)
        return user


@pytest.fixture
def sample_project(db, sample_user, app):
    """Erstellt ein Test-Projekt"""
    from app import Project

    with app.app_context():
        project = Project(
            user_id=sample_user.id,
            title="Test Project",
            description="A test project description"
        )
        db.session.add(project)
        db.session.commit()
        db.session.refresh(project)
        return project


@pytest.fixture
def sample_chapter(db, sample_project, app):
    """Erstellt ein Test-Kapitel"""
    from app import Chapter

    with app.app_context():
        chapter = Chapter(
            project_id=sample_project.id,
            title="Test Chapter",
            order_index=1,
            content="Chapter content"
        )
        db.session.add(chapter)
        db.session.commit()
        db.session.refresh(chapter)
        return chapter


@pytest.fixture
def sample_scene(db, sample_chapter, app):
    """Erstellt eine Test-Szene"""
    from app import Scene

    with app.app_context():
        scene = Scene(
            chapter_id=sample_chapter.id,
            title="Test Scene",
            order_index=1,
            content="Scene content here"
        )
        db.session.add(scene)
        db.session.commit()
        db.session.refresh(scene)
        return scene


@pytest.fixture
def sample_character(db, sample_project, app):
    """Erstellt einen Test-Charakter"""
    from app import Character
    import json

    with app.app_context():
        character = Character(
            project_id=sample_project.id,
            name="John Doe",
            summary="A test character",
            avatar_url="https://example.com/avatar.jpg",
            profile_json=json.dumps({
                "basic": {"age": 30, "gender": "male"},
                "appearance": {"height": "180cm", "hair": "brown"}
            })
        )
        db.session.add(character)
        db.session.commit()
        db.session.refresh(character)
        return character


@pytest.fixture
def sample_worldnode(db, sample_project, app):
    """Erstellt ein Test-World-Element"""
    from app import WorldNode
    import json

    with app.app_context():
        worldnode = WorldNode(
            project_id=sample_project.id,
            title="Test Location",
            kind="Ort",
            summary="A test location",
            icon="🏰",
            relations_json=json.dumps({})
        )
        db.session.add(worldnode)
        db.session.commit()
        db.session.refresh(worldnode)
        return worldnode

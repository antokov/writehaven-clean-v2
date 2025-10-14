"""
Pytest Configuration und Fixtures für WriteHaven Backend Tests
"""
import os
import sys
import pytest
import tempfile

# Sicherstellen, dass das backend-Modul importiert werden kann
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))


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

    with app.app_context():
        # Alles löschen vor jedem Test
        try:
            _db.session.rollback()
        except:
            pass

        try:
            _db.session.close()
        except:
            pass

        # Alle Tabellen leeren - verwende SQL direkt statt Model-Imports
        try:
            _db.session.execute(_db.text("DELETE FROM scene"))
            _db.session.execute(_db.text("DELETE FROM chapter"))
            _db.session.execute(_db.text("DELETE FROM worldnode"))
            _db.session.execute(_db.text("DELETE FROM character"))
            _db.session.execute(_db.text("DELETE FROM project"))
            _db.session.commit()
        except Exception as e:
            print(f"Warning during DB cleanup: {e}")
            _db.session.rollback()

        yield _db

        # Nach dem Test cleanup
        try:
            _db.session.rollback()
        except:
            pass

        try:
            _db.session.close()
        except:
            pass


@pytest.fixture
def sample_project(db, app):
    """Erstellt ein Test-Projekt"""
    with app.app_context():
        # Import nur innerhalb des app context
        from models import Project
        project = Project(
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
    with app.app_context():
        from models import Chapter
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
    with app.app_context():
        from models import Scene
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
    with app.app_context():
        from models import Character
        import json

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
    with app.app_context():
        from models import WorldNode
        import json

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

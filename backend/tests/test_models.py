"""
Unit Tests für Database Models
"""
import pytest
import json


@pytest.mark.unit
class TestProjectModel:
    """Tests für das Project-Model"""

    def test_create_project(self, db):
        """Test: Projekt erstellen"""
        from models import Project

        project = Project(
            title="My Novel",
            description="A great story"
        )
        db.session.add(project)
        db.session.commit()

        assert project.id is not None
        assert project.title == "My Novel"
        assert project.description == "A great story"
        assert project.created_at is not None
        assert project.updated_at is not None

    def test_project_default_values(self, db):
        """Test: Default-Werte bei Projekterstellung"""
        from models import Project

        project = Project()
        db.session.add(project)
        db.session.commit()

        assert project.title == "Neues Projekt"
        assert project.description == ""

    def test_project_relationships(self, db, sample_project):
        """Test: Beziehungen zu anderen Modellen"""
        from models import Chapter, Character, WorldNode

        # Chapter hinzufügen
        chapter = Chapter(project_id=sample_project.id, title="Chapter 1")
        db.session.add(chapter)

        # Character hinzufügen
        character = Character(
            project_id=sample_project.id,
            name="Hero",
            profile_json="{}"
        )
        db.session.add(character)

        # WorldNode hinzufügen
        worldnode = WorldNode(
            project_id=sample_project.id,
            title="Castle"
        )
        db.session.add(worldnode)
        db.session.commit()

        # Relationships testen
        assert len(sample_project.chapters) == 1
        assert len(sample_project.characters) == 1
        assert len(sample_project.worldnodes) == 1

    def test_project_cascade_delete(self, db, sample_project):
        """Test: Cascade Delete - alle abhängigen Objekte werden gelöscht"""
        from models import Chapter, Character, Project

        # Abhängige Objekte erstellen
        chapter = Chapter(project_id=sample_project.id, title="Ch1")
        character = Character(
            project_id=sample_project.id,
            name="Char1",
            profile_json="{}"
        )
        db.session.add_all([chapter, character])
        db.session.commit()

        project_id = sample_project.id

        # Projekt löschen
        db.session.delete(sample_project)
        db.session.commit()

        # Prüfen, dass auch abhängige Objekte gelöscht wurden
        assert Project.query.get(project_id) is None
        assert Chapter.query.filter_by(project_id=project_id).count() == 0
        assert Character.query.filter_by(project_id=project_id).count() == 0


@pytest.mark.unit
class TestChapterModel:
    """Tests für das Chapter-Model"""

    def test_create_chapter(self, db, sample_project):
        """Test: Kapitel erstellen"""
        from models import Chapter

        chapter = Chapter(
            project_id=sample_project.id,
            title="Chapter One",
            order_index=1,
            content="Once upon a time..."
        )
        db.session.add(chapter)
        db.session.commit()

        assert chapter.id is not None
        assert chapter.title == "Chapter One"
        assert chapter.order_index == 1
        assert chapter.content == "Once upon a time..."

    def test_chapter_default_values(self, db, sample_project):
        """Test: Default-Werte"""
        from models import Chapter

        chapter = Chapter(project_id=sample_project.id)
        db.session.add(chapter)
        db.session.commit()

        assert chapter.title == "Neues Kapitel"
        assert chapter.order_index == 0
        assert chapter.content == ""

    def test_chapter_scenes_relationship(self, db, sample_chapter):
        """Test: Beziehung zu Szenen"""
        from models import Scene

        scene1 = Scene(chapter_id=sample_chapter.id, title="Scene 1")
        scene2 = Scene(chapter_id=sample_chapter.id, title="Scene 2")
        db.session.add_all([scene1, scene2])
        db.session.commit()

        assert len(sample_chapter.scenes) == 2


@pytest.mark.unit
class TestSceneModel:
    """Tests für das Scene-Model"""

    def test_create_scene(self, db, sample_chapter):
        """Test: Szene erstellen"""
        from models import Scene

        scene = Scene(
            chapter_id=sample_chapter.id,
            title="Opening Scene",
            order_index=1,
            content="The hero arrives..."
        )
        db.session.add(scene)
        db.session.commit()

        assert scene.id is not None
        assert scene.title == "Opening Scene"
        assert scene.content == "The hero arrives..."

    def test_scene_default_values(self, db, sample_chapter):
        """Test: Default-Werte"""
        from models import Scene

        scene = Scene(chapter_id=sample_chapter.id)
        db.session.add(scene)
        db.session.commit()

        assert scene.title == "Neue Szene"
        assert scene.content == ""
        assert scene.order_index == 0


@pytest.mark.unit
class TestCharacterModel:
    """Tests für das Character-Model"""

    def test_create_character(self, db, sample_project):
        """Test: Charakter erstellen"""
        from models import Character

        profile = {
            "basic": {"age": 25, "gender": "female"},
            "appearance": {"height": "165cm", "hair": "blonde"}
        }
        character = Character(
            project_id=sample_project.id,
            name="Jane Smith",
            summary="The protagonist",
            avatar_url="https://example.com/jane.jpg",
            profile_json=json.dumps(profile)
        )
        db.session.add(character)
        db.session.commit()

        assert character.id is not None
        assert character.name == "Jane Smith"
        assert character.summary == "The protagonist"
        assert json.loads(character.profile_json) == profile

    def test_character_profile_json(self, db, sample_project):
        """Test: JSON-Profile speichern und laden"""
        from models import Character

        profile_data = {
            "basic": {"first_name": "John", "last_name": "Doe"},
            "traits": ["brave", "intelligent"]
        }
        character = Character(
            project_id=sample_project.id,
            name="John Doe",
            profile_json=json.dumps(profile_data)
        )
        db.session.add(character)
        db.session.commit()

        # Neu laden und prüfen
        loaded = Character.query.get(character.id)
        loaded_profile = json.loads(loaded.profile_json)
        assert loaded_profile == profile_data

    def test_character_default_profile(self, db, sample_project):
        """Test: Default-Wert für profile_json"""
        from models import Character

        character = Character(
            project_id=sample_project.id,
            name="Test Character"
        )
        db.session.add(character)
        db.session.commit()

        assert character.profile_json == "{}"


@pytest.mark.unit
class TestWorldNodeModel:
    """Tests für das WorldNode-Model"""

    def test_create_worldnode(self, db, sample_project):
        """Test: World-Element erstellen"""
        from models import WorldNode

        worldnode = WorldNode(
            project_id=sample_project.id,
            title="Ancient Castle",
            kind="Ort",
            summary="A mysterious old castle",
            icon="🏰"
        )
        db.session.add(worldnode)
        db.session.commit()

        assert worldnode.id is not None
        assert worldnode.title == "Ancient Castle"
        assert worldnode.kind == "Ort"
        assert worldnode.icon == "🏰"

    def test_worldnode_relations_json(self, db, sample_project):
        """Test: Relations JSON speichern"""
        from models import WorldNode

        relations = {
            "characters": [1, 2, 3],
            "locations": [5, 6]
        }
        worldnode = WorldNode(
            project_id=sample_project.id,
            title="Test Node",
            relations_json=json.dumps(relations)
        )
        db.session.add(worldnode)
        db.session.commit()

        loaded = WorldNode.query.get(worldnode.id)
        loaded_relations = json.loads(loaded.relations_json)
        assert loaded_relations == relations

    def test_worldnode_default_values(self, db, sample_project):
        """Test: Default-Werte"""
        from models import WorldNode

        worldnode = WorldNode(
            project_id=sample_project.id,
            title="Test"
        )
        db.session.add(worldnode)
        db.session.commit()

        assert worldnode.kind == "Ort"
        assert worldnode.icon == "🏰"
        assert worldnode.summary == ""
        assert worldnode.relations_json == "{}"

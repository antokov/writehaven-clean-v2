"""
API Integration Tests für Scene Endpoints
"""
import pytest
import json


@pytest.mark.integration
class TestScenesAPI:
    """Tests für /api/scenes Endpoints"""

    def test_list_scenes_empty(self, client, sample_chapter):
        """Test: Leere Szenenliste"""
        response = client.get(f"/api/chapters/{sample_chapter.id}/scenes")
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) == 0

    def test_create_scene(self, client, sample_chapter):
        """Test: Szene erstellen"""
        payload = {
            "title": "Opening Scene",
            "order_index": 1,
            "content": "It was a dark and stormy night..."
        }
        response = client.post(
            f"/api/chapters/{sample_chapter.id}/scenes",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["title"] == "Opening Scene"
        assert data["content"] == "It was a dark and stormy night..."
        assert data["order_index"] == 1
        assert data["chapter_id"] == sample_chapter.id

    def test_create_scene_default_values(self, client, sample_chapter):
        """Test: Szene mit Default-Werten"""
        response = client.post(
            f"/api/chapters/{sample_chapter.id}/scenes",
            data=json.dumps({}),
            content_type="application/json"
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["title"] == "Neue Szene"
        assert data["content"] == ""

    def test_create_scene_invalid_chapter(self, client):
        """Test: Szene für nicht existierendes Kapitel"""
        response = client.post(
            "/api/chapters/99999/scenes",
            data=json.dumps({"title": "Test"}),
            content_type="application/json"
        )
        assert response.status_code == 404

    def test_list_scenes_with_data(self, client, sample_scene):
        """Test: Szenenliste mit Daten"""
        response = client.get(f"/api/chapters/{sample_scene.chapter_id}/scenes")
        assert response.status_code == 200
        data = response.get_json()
        assert len(data) == 1
        assert data[0]["id"] == sample_scene.id
        assert data[0]["title"] == sample_scene.title

    def test_list_scenes_ordered(self, client, sample_chapter, db):
        """Test: Szenen sind nach order_index sortiert"""
        from models import Scene

        # Szenen in falscher Reihenfolge erstellen
        s3 = Scene(chapter_id=sample_chapter.id, title="Scene 3", order_index=3)
        s1 = Scene(chapter_id=sample_chapter.id, title="Scene 1", order_index=1)
        s2 = Scene(chapter_id=sample_chapter.id, title="Scene 2", order_index=2)
        db.session.add_all([s3, s1, s2])
        db.session.commit()

        response = client.get(f"/api/chapters/{sample_chapter.id}/scenes")
        data = response.get_json()

        assert data[0]["title"] == "Scene 1"
        assert data[1]["title"] == "Scene 2"
        assert data[2]["title"] == "Scene 3"

    def test_get_scene(self, client, sample_scene):
        """Test: Einzelne Szene abrufen"""
        response = client.get(f"/api/scenes/{sample_scene.id}")
        assert response.status_code == 200
        data = response.get_json()
        assert data["id"] == sample_scene.id
        assert data["title"] == sample_scene.title
        assert data["content"] == sample_scene.content
        assert data["chapter_id"] == sample_scene.chapter_id

    def test_get_scene_not_found(self, client):
        """Test: Nicht existierende Szene"""
        response = client.get("/api/scenes/99999")
        assert response.status_code == 404

    def test_update_scene(self, client, sample_scene):
        """Test: Szene aktualisieren"""
        payload = {
            "title": "Updated Scene",
            "content": "New content here"
        }
        response = client.put(
            f"/api/scenes/{sample_scene.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["title"] == "Updated Scene"
        assert data["content"] == "New content here"

    def test_update_scene_content_only(self, client, sample_scene):
        """Test: Nur Content aktualisieren"""
        old_title = sample_scene.title
        payload = {"content": "Updated content"}
        response = client.put(
            f"/api/scenes/{sample_scene.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["title"] == old_title
        assert data["content"] == "Updated content"

    def test_update_scene_empty_content(self, client, sample_scene):
        """Test: Content leeren"""
        payload = {"content": ""}
        response = client.put(
            f"/api/scenes/{sample_scene.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["content"] == ""

    def test_delete_scene(self, client, sample_scene):
        """Test: Szene löschen"""
        scene_id = sample_scene.id
        response = client.delete(f"/api/scenes/{scene_id}")
        assert response.status_code == 200
        data = response.get_json()
        assert data["ok"] is True

        # Prüfen, dass Szene gelöscht wurde
        response = client.get(f"/api/scenes/{scene_id}")
        assert response.status_code == 404

    def test_delete_scene_not_found(self, client):
        """Test: Nicht existierende Szene löschen"""
        response = client.delete("/api/scenes/99999")
        assert response.status_code == 404

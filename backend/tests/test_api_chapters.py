"""
API Integration Tests für Chapter Endpoints
"""
import pytest
import json


@pytest.mark.integration
class TestChaptersAPI:
    """Tests für /api/chapters Endpoints"""

    def test_list_chapters_empty(self, client, sample_project):
        """Test: Leere Kapitelliste"""
        response = client.get(f"/api/projects/{sample_project.id}/chapters")
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) == 0

    def test_create_chapter(self, client, sample_project):
        """Test: Kapitel erstellen"""
        payload = {
            "title": "Chapter One",
            "order_index": 1
        }
        response = client.post(
            f"/api/projects/{sample_project.id}/chapters",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["title"] == "Chapter One"
        assert data["order_index"] == 1
        assert data["project_id"] == sample_project.id

    def test_create_chapter_default_title(self, client, sample_project):
        """Test: Kapitel mit Default-Titel"""
        response = client.post(
            f"/api/projects/{sample_project.id}/chapters",
            data=json.dumps({}),
            content_type="application/json"
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["title"] == "Neues Kapitel"

    def test_create_chapter_invalid_project(self, client):
        """Test: Kapitel für nicht existierendes Projekt"""
        response = client.post(
            "/api/projects/99999/chapters",
            data=json.dumps({"title": "Test"}),
            content_type="application/json"
        )
        assert response.status_code == 404

    def test_list_chapters_with_data(self, client, sample_chapter):
        """Test: Kapitelliste mit Daten"""
        response = client.get(
            f"/api/projects/{sample_chapter.project_id}/chapters"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert len(data) == 1
        assert data[0]["id"] == sample_chapter.id
        assert data[0]["title"] == sample_chapter.title

    def test_list_chapters_ordered(self, client, sample_project, db):
        """Test: Kapitel sind nach order_index sortiert"""
        from models import Chapter

        # Kapitel in falscher Reihenfolge erstellen
        ch3 = Chapter(project_id=sample_project.id, title="Ch3", order_index=3)
        ch1 = Chapter(project_id=sample_project.id, title="Ch1", order_index=1)
        ch2 = Chapter(project_id=sample_project.id, title="Ch2", order_index=2)
        db.session.add_all([ch3, ch1, ch2])
        db.session.commit()

        response = client.get(f"/api/projects/{sample_project.id}/chapters")
        data = response.get_json()

        # Sollten nach order_index sortiert sein
        assert data[0]["title"] == "Ch1"
        assert data[1]["title"] == "Ch2"
        assert data[2]["title"] == "Ch3"

    def test_get_chapter(self, client, sample_chapter):
        """Test: Einzelnes Kapitel abrufen"""
        response = client.get(f"/api/chapters/{sample_chapter.id}")
        assert response.status_code == 200
        data = response.get_json()
        assert data["id"] == sample_chapter.id
        assert data["title"] == sample_chapter.title
        assert data["project_id"] == sample_chapter.project_id

    def test_get_chapter_not_found(self, client):
        """Test: Nicht existierendes Kapitel"""
        response = client.get("/api/chapters/99999")
        assert response.status_code == 404

    def test_update_chapter(self, client, sample_chapter):
        """Test: Kapitel aktualisieren"""
        payload = {
            "title": "Updated Chapter",
            "order_index": 5
        }
        response = client.put(
            f"/api/chapters/{sample_chapter.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["title"] == "Updated Chapter"
        assert data["order_index"] == 5

    def test_update_chapter_title_only(self, client, sample_chapter):
        """Test: Nur Titel aktualisieren"""
        old_order = sample_chapter.order_index
        payload = {"title": "New Title"}
        response = client.put(
            f"/api/chapters/{sample_chapter.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["title"] == "New Title"
        assert data["order_index"] == old_order

    def test_delete_chapter(self, client, sample_chapter):
        """Test: Kapitel löschen"""
        chapter_id = sample_chapter.id
        response = client.delete(f"/api/chapters/{chapter_id}")
        assert response.status_code == 200
        data = response.get_json()
        assert data["ok"] is True

        # Prüfen, dass Kapitel gelöscht wurde
        response = client.get(f"/api/chapters/{chapter_id}")
        assert response.status_code == 404

    def test_delete_chapter_not_found(self, client):
        """Test: Nicht existierendes Kapitel löschen"""
        response = client.delete("/api/chapters/99999")
        assert response.status_code == 404

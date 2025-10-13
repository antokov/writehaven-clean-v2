"""
API Integration Tests für Project Endpoints
"""
import pytest
import json


@pytest.mark.integration
class TestProjectsAPI:
    """Tests für /api/projects Endpoints"""

    def test_health_check(self, client):
        """Test: Health-Check Endpoint"""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "ok"
        assert "db" in data

    def test_list_projects_empty(self, client):
        """Test: Leere Projektliste"""
        response = client.get("/api/projects")
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) == 0

    def test_create_project(self, client):
        """Test: Projekt erstellen"""
        payload = {
            "title": "My Novel",
            "description": "A great story"
        }
        response = client.post(
            "/api/projects",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["title"] == "My Novel"
        assert data["description"] == "A great story"
        assert "id" in data

    def test_create_project_default_values(self, client):
        """Test: Projekt mit Default-Werten erstellen"""
        response = client.post(
            "/api/projects",
            data=json.dumps({}),
            content_type="application/json"
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["title"] == "Neues Projekt"
        assert data["description"] == ""

    def test_list_projects_with_data(self, client, sample_project):
        """Test: Projektliste mit Daten"""
        response = client.get("/api/projects")
        assert response.status_code == 200
        data = response.get_json()
        assert len(data) == 1
        assert data[0]["id"] == sample_project.id
        assert data[0]["title"] == sample_project.title

    def test_get_project(self, client, sample_project):
        """Test: Einzelnes Projekt abrufen"""
        response = client.get(f"/api/projects/{sample_project.id}")
        assert response.status_code == 200
        data = response.get_json()
        assert data["id"] == sample_project.id
        assert data["title"] == sample_project.title
        assert data["description"] == sample_project.description

    def test_get_project_not_found(self, client):
        """Test: Nicht existierendes Projekt"""
        response = client.get("/api/projects/99999")
        assert response.status_code == 404
        data = response.get_json()
        assert data["error"] == "not_found"

    def test_update_project(self, client, sample_project):
        """Test: Projekt aktualisieren"""
        payload = {
            "title": "Updated Title",
            "description": "Updated description"
        }
        response = client.put(
            f"/api/projects/{sample_project.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["title"] == "Updated Title"
        assert data["description"] == "Updated description"

    def test_update_project_partial(self, client, sample_project):
        """Test: Projekt teilweise aktualisieren"""
        payload = {"title": "New Title Only"}
        response = client.put(
            f"/api/projects/{sample_project.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["title"] == "New Title Only"
        # Description sollte unverändert bleiben
        assert data["description"] == sample_project.description

    def test_delete_project(self, client, sample_project):
        """Test: Projekt löschen"""
        project_id = sample_project.id
        response = client.delete(f"/api/projects/{project_id}")
        assert response.status_code == 200
        data = response.get_json()
        assert data["ok"] is True

        # Prüfen, dass Projekt wirklich gelöscht wurde
        response = client.get(f"/api/projects/{project_id}")
        assert response.status_code == 404

    def test_delete_project_not_found(self, client):
        """Test: Nicht existierendes Projekt löschen"""
        response = client.delete("/api/projects/99999")
        assert response.status_code == 404

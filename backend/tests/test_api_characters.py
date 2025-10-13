"""
API Integration Tests für Character Endpoints
"""
import pytest
import json


@pytest.mark.integration
class TestCharactersAPI:
    """Tests für /api/characters Endpoints"""

    def test_list_characters_empty(self, client, sample_project):
        """Test: Leere Charakterliste"""
        response = client.get(f"/api/projects/{sample_project.id}/characters")
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) == 0

    def test_create_character(self, client, sample_project):
        """Test: Charakter erstellen"""
        payload = {
            "name": "Jane Doe",
            "summary": "The protagonist",
            "avatar_url": "https://example.com/jane.jpg",
            "profile": {
                "basic": {"age": 25, "gender": "female"},
                "appearance": {"height": "165cm", "hair": "blonde"}
            }
        }
        response = client.post(
            f"/api/projects/{sample_project.id}/characters",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["name"] == "Jane Doe"
        assert data["summary"] == "The protagonist"
        assert data["avatar_url"] == "https://example.com/jane.jpg"
        assert data["profile"]["basic"]["age"] == 25

    def test_create_character_minimal(self, client, sample_project):
        """Test: Charakter mit minimalen Daten"""
        response = client.post(
            f"/api/projects/{sample_project.id}/characters",
            data=json.dumps({}),
            content_type="application/json"
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["name"] == "Neuer Charakter"
        assert data["profile"] == {}

    def test_create_character_invalid_project(self, client):
        """Test: Charakter für nicht existierendes Projekt"""
        response = client.post(
            "/api/projects/99999/characters",
            data=json.dumps({"name": "Test"}),
            content_type="application/json"
        )
        assert response.status_code == 404

    def test_list_characters_with_data(self, client, sample_character):
        """Test: Charakterliste mit Daten"""
        response = client.get(
            f"/api/projects/{sample_character.project_id}/characters"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert len(data) == 1
        assert data[0]["id"] == sample_character.id
        assert data[0]["name"] == sample_character.name

    def test_get_character(self, client, sample_character):
        """Test: Einzelnen Charakter abrufen"""
        response = client.get(f"/api/characters/{sample_character.id}")
        assert response.status_code == 200
        data = response.get_json()
        assert data["id"] == sample_character.id
        assert data["name"] == sample_character.name
        assert "profile" in data

    def test_get_character_not_found(self, client):
        """Test: Nicht existierender Charakter"""
        response = client.get("/api/characters/99999")
        assert response.status_code == 404

    def test_update_character_put(self, client, sample_character):
        """Test: Charakter aktualisieren (PUT)"""
        payload = {
            "name": "Updated Name",
            "summary": "Updated summary",
            "profile": {
                "basic": {"age": 35},
                "skills": ["magic", "swordfighting"]
            }
        }
        response = client.put(
            f"/api/characters/{sample_character.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["name"] == "Updated Name"
        assert data["summary"] == "Updated summary"
        assert data["profile"]["basic"]["age"] == 35
        assert "magic" in data["profile"]["skills"]

    def test_update_character_patch(self, client, sample_character):
        """Test: Charakter aktualisieren (PATCH)"""
        payload = {"name": "Patched Name"}
        response = client.patch(
            f"/api/characters/{sample_character.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["name"] == "Patched Name"
        # Andere Felder sollten unverändert bleiben
        assert data["summary"] == sample_character.summary

    def test_update_character_profile(self, client, sample_character):
        """Test: Nur Profil aktualisieren"""
        new_profile = {
            "custom": {"field1": "value1", "field2": "value2"}
        }
        payload = {"profile": new_profile}
        response = client.put(
            f"/api/characters/{sample_character.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["profile"] == new_profile

    def test_delete_character(self, client, sample_character):
        """Test: Charakter löschen"""
        character_id = sample_character.id
        response = client.delete(f"/api/characters/{character_id}")
        assert response.status_code == 200
        data = response.get_json()
        assert data["ok"] is True

        # Prüfen, dass Charakter gelöscht wurde
        response = client.get(f"/api/characters/{character_id}")
        assert response.status_code == 404

    def test_delete_character_not_found(self, client):
        """Test: Nicht existierenden Charakter löschen"""
        response = client.delete("/api/characters/99999")
        assert response.status_code == 404

"""
API Integration Tests für World Endpoints
"""
import pytest
import json


@pytest.mark.integration
class TestWorldAPI:
    """Tests für /api/world Endpoints"""

    def test_list_world_empty(self, client, sample_project):
        """Test: Leere Welt-Liste"""
        response = client.get(f"/api/projects/{sample_project.id}/world")
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) == 0

    def test_create_worldnode(self, client, sample_project):
        """Test: World-Element erstellen"""
        payload = {
            "title": "Ancient Castle",
            "kind": "Ort",
            "summary": "A mysterious old castle",
            "icon": "🏰"
        }
        response = client.post(
            f"/api/projects/{sample_project.id}/world",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["title"] == "Ancient Castle"
        assert data["kind"] == "Ort"
        assert data["icon"] == "🏰"
        assert data["project_id"] == sample_project.id

    def test_create_worldnode_default_values(self, client, sample_project):
        """Test: World-Element mit Default-Werten"""
        response = client.post(
            f"/api/projects/{sample_project.id}/world",
            data=json.dumps({}),
            content_type="application/json"
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["title"] == "Neues Element"
        assert data["kind"] == "Ort"
        assert data["icon"] == "🏰"

    def test_list_world_with_data(self, client, sample_worldnode):
        """Test: Welt-Liste mit Daten"""
        response = client.get(
            f"/api/projects/{sample_worldnode.project_id}/world"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert len(data) == 1
        assert data[0]["id"] == sample_worldnode.id
        assert data[0]["title"] == sample_worldnode.title

    def test_get_worldnode(self, client, sample_worldnode):
        """Test: Einzelnes World-Element abrufen"""
        response = client.get(f"/api/world/{sample_worldnode.id}")
        assert response.status_code == 200
        data = response.get_json()
        assert data["id"] == sample_worldnode.id
        assert data["title"] == sample_worldnode.title
        assert "relations" in data

    def test_get_worldnode_not_found(self, client):
        """Test: Nicht existierendes World-Element"""
        response = client.get("/api/world/99999")
        assert response.status_code == 404

    def test_update_worldnode(self, client, sample_worldnode):
        """Test: World-Element aktualisieren"""
        payload = {
            "title": "Updated Castle",
            "kind": "Gebäude",
            "summary": "Updated description",
            "icon": "🏛️"
        }
        response = client.put(
            f"/api/world/{sample_worldnode.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["title"] == "Updated Castle"
        assert data["kind"] == "Gebäude"
        assert data["icon"] == "🏛️"

    def test_update_worldnode_with_relations(self, client, sample_worldnode):
        """Test: World-Element mit Beziehungen aktualisieren"""
        relations = {
            "characters": [1, 2, 3],
            "locations": [5],
            "events": [{"id": 10, "type": "battle"}]
        }
        payload = {
            "title": "Castle with Relations",
            "relations": relations
        }
        response = client.put(
            f"/api/world/{sample_worldnode.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["relations"]["characters"] == [1, 2, 3]
        assert data["relations"]["locations"] == [5]

    def test_update_worldnode_partial(self, client, sample_worldnode):
        """Test: World-Element teilweise aktualisieren"""
        old_kind = sample_worldnode.kind
        payload = {"title": "New Title Only"}
        response = client.put(
            f"/api/world/{sample_worldnode.id}",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["title"] == "New Title Only"
        assert data["kind"] == old_kind

    def test_delete_worldnode(self, client, sample_worldnode):
        """Test: World-Element löschen"""
        worldnode_id = sample_worldnode.id
        response = client.delete(f"/api/world/{worldnode_id}")
        assert response.status_code == 200
        data = response.get_json()
        assert data["ok"] is True

        # Prüfen, dass Element gelöscht wurde
        response = client.get(f"/api/world/{worldnode_id}")
        assert response.status_code == 404

    def test_delete_worldnode_not_found(self, client):
        """Test: Nicht existierendes World-Element löschen"""
        response = client.delete("/api/world/99999")
        assert response.status_code == 404

    def test_multiple_worldnodes_same_project(self, client, sample_project, db):
        """Test: Mehrere World-Elemente im selben Projekt"""
        from models import WorldNode

        # Mehrere Elemente erstellen
        nodes = [
            WorldNode(project_id=sample_project.id, title="Location 1", kind="Ort"),
            WorldNode(project_id=sample_project.id, title="Character 2", kind="Person"),
            WorldNode(project_id=sample_project.id, title="Item 3", kind="Gegenstand"),
        ]
        db.session.add_all(nodes)
        db.session.commit()

        response = client.get(f"/api/projects/{sample_project.id}/world")
        data = response.get_json()
        assert len(data) == 3
        titles = [node["title"] for node in data]
        assert "Location 1" in titles
        assert "Character 2" in titles
        assert "Item 3" in titles

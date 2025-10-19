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
        from app import WorldNode

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

    def test_world_relations_persistence(self, client, sample_project, db):
        """Test: World-Element Beziehungen werden korrekt gespeichert"""
        from app import WorldNode
        import json as json_lib

        # Erstelle mehrere World-Elemente
        payload1 = {"title": "Castle Blackwood", "kind": "Stadt", "summary": "Ancient fortress"}
        payload2 = {"title": "Kingdom of Eldoria", "kind": "Land", "summary": "Great kingdom"}

        response1 = client.post(
            f"/api/projects/{sample_project.id}/world",
            data=json.dumps(payload1),
            content_type="application/json"
        )
        castle_id = response1.get_json()["id"]

        response2 = client.post(
            f"/api/projects/{sample_project.id}/world",
            data=json.dumps(payload2),
            content_type="application/json"
        )
        kingdom_id = response2.get_json()["id"]

        # Füge Beziehungen hinzu
        relations = {
            "connections": [
                {"target_id": kingdom_id, "type": "liegt_in", "note": "capital city"},
                {"target_id": kingdom_id, "type": "regiert_von", "note": "ruled by king"}
            ]
        }

        update_payload = {
            "title": "Castle Blackwood",
            "relations": relations
        }

        client.put(
            f"/api/world/{castle_id}",
            data=json.dumps(update_payload),
            content_type="application/json"
        )

        # Prüfe DB-Persistenz
        with client.application.app_context():
            db_element = db.session.get(WorldNode, castle_id)
            db_relations = json_lib.loads(db_element.relations_json)

            assert "connections" in db_relations
            assert len(db_relations["connections"]) == 2
            assert db_relations["connections"][0]["target_id"] == kingdom_id
            assert db_relations["connections"][0]["type"] == "liegt_in"
            assert db_relations["connections"][0]["note"] == "capital city"

        # Lade über API und prüfe
        get_response = client.get(f"/api/world/{castle_id}")
        api_data = get_response.get_json()

        assert len(api_data["relations"]["connections"]) == 2
        assert api_data["relations"]["connections"][1]["type"] == "regiert_von"

    def test_world_complex_data_persistence(self, client, sample_project, db):
        """Test: Komplexe World-Daten mit allen Feldern werden gespeichert"""
        from app import WorldNode
        import json as json_lib

        payload = {
            "title": "Ancient Library of Tomes",
            "kind": "Bibliothek",
            "summary": "Contains forbidden knowledge",
            "icon": "📚",
            "relations": {
                "connections": [
                    {"target_id": 1, "type": "enthaelt", "note": "magical artifacts"},
                    {"target_id": 2, "type": "beschuetzt", "note": "by ancient wards"}
                ],
                "details": {
                    "founded": "Age of Magic",
                    "population": "12 scholars",
                    "resources": ["ancient scrolls", "magical tomes"]
                }
            }
        }

        create_response = client.post(
            f"/api/projects/{sample_project.id}/world",
            data=json.dumps(payload),
            content_type="application/json"
        )
        element_id = create_response.get_json()["id"]

        # Direkter DB-Check
        with client.application.app_context():
            db_element = db.session.get(WorldNode, element_id)

            assert db_element.title == "Ancient Library of Tomes"
            assert db_element.kind == "Bibliothek"
            assert db_element.summary == "Contains forbidden knowledge"
            assert db_element.icon == "📚"

            db_relations = json_lib.loads(db_element.relations_json)
            assert len(db_relations["connections"]) == 2
            assert db_relations["details"]["founded"] == "Age of Magic"
            assert "magical tomes" in db_relations["details"]["resources"]

        # API-Check
        get_response = client.get(f"/api/world/{element_id}")
        api_data = get_response.get_json()

        assert api_data["relations"]["details"]["population"] == "12 scholars"

    def test_world_empty_relations_handling(self, client, sample_project, db):
        """Test: Leere Beziehungen werden korrekt behandelt"""
        from app import WorldNode
        import json as json_lib

        # Erstelle Element ohne Beziehungen
        payload = {"title": "Simple Location", "kind": "Ort"}

        create_response = client.post(
            f"/api/projects/{sample_project.id}/world",
            data=json.dumps(payload),
            content_type="application/json"
        )
        element_id = create_response.get_json()["id"]

        # Prüfe DB
        with client.application.app_context():
            db_element = db.session.get(WorldNode, element_id)
            db_relations = json_lib.loads(db_element.relations_json)

            # Sollte leeres Objekt oder leere connections haben
            assert db_relations == {} or db_relations.get("connections", []) == []

        # Füge Beziehungen hinzu, dann entferne sie wieder
        update_with_relations = {
            "relations": {
                "connections": [{"target_id": 99, "type": "hat", "note": "test"}]
            }
        }

        client.put(
            f"/api/world/{element_id}",
            data=json.dumps(update_with_relations),
            content_type="application/json"
        )

        # Entferne Beziehungen
        update_remove_relations = {
            "relations": {"connections": []}
        }

        client.put(
            f"/api/world/{element_id}",
            data=json.dumps(update_remove_relations),
            content_type="application/json"
        )

        # Prüfe, dass Beziehungen entfernt wurden
        with client.application.app_context():
            db.session.expire_all()
            db_element = db.session.get(WorldNode, element_id)
            db_relations = json_lib.loads(db_element.relations_json)

            assert db_relations.get("connections", []) == []

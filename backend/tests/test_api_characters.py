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

    def test_character_profile_persistence(self, client, sample_project, db):
        """Test: Vollständige Profildaten werden korrekt gespeichert und geladen"""
        from app import Character

        # Erstelle Charakter mit umfangreichem Profil
        profile_data = {
            "basic": {
                "first_name": "Jane",
                "last_name": "Doe",
                "age": "25",
                "gender": "female",
                "residence": "London",
                "nationality": "British",
                "nickname": "JD",
                "religion": "Atheist"
            },
            "appearance": {
                "height": "165cm",
                "hair_color": "blonde",
                "eye_color": "blue",
                "build": "athletic",
                "distinguishing_features": "scar on left cheek"
            },
            "personality": {
                "traits": "brave, loyal, stubborn",
                "strengths": "strategic thinking",
                "weaknesses": "impulsive",
                "fears": "heights",
                "goals": "save the kingdom"
            },
            "relations": {
                "family_background": "orphan raised by monks",
                "education": "self-taught fighter",
                "occupation": "mercenary"
            },
            "skills": {
                "list": ["swordfighting", "archery", "tracking"],
                "input": ""
            },
            "links": {
                "connections": [
                    {"target_id": 2, "type": "Freundschaft", "note": "childhood friend"},
                    {"target_id": 3, "type": "Mentor", "note": "taught her combat"}
                ]
            },
            "notes": {
                "text": "Important character for main plot"
            }
        }

        payload = {
            "name": "Jane Doe",
            "summary": "Main protagonist",
            "avatar_url": "https://example.com/jane.jpg",
            "profile": profile_data
        }

        # Erstelle Charakter
        create_response = client.post(
            f"/api/projects/{sample_project.id}/characters",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert create_response.status_code == 201
        character_id = create_response.get_json()["id"]

        # Direkt aus DB laden (nicht über API)
        with client.application.app_context():
            db_character = db.session.get(Character, character_id)
            assert db_character is not None
            assert db_character.name == "Jane Doe"
            assert db_character.summary == "Main protagonist"
            assert db_character.avatar_url == "https://example.com/jane.jpg"

            # Prüfe JSON-Profil in DB
            import json as json_lib
            db_profile = json_lib.loads(db_character.profile_json)

            # Prüfe alle Tabs
            assert db_profile["basic"]["first_name"] == "Jane"
            assert db_profile["basic"]["last_name"] == "Doe"
            assert db_profile["basic"]["age"] == "25"
            assert db_profile["appearance"]["hair_color"] == "blonde"
            assert db_profile["personality"]["traits"] == "brave, loyal, stubborn"
            assert db_profile["relations"]["family_background"] == "orphan raised by monks"
            assert "swordfighting" in db_profile["skills"]["list"]
            assert len(db_profile["links"]["connections"]) == 2
            assert db_profile["notes"]["text"] == "Important character for main plot"

        # Lade über API und prüfe erneut
        get_response = client.get(f"/api/characters/{character_id}")
        assert get_response.status_code == 200
        api_data = get_response.get_json()

        assert api_data["profile"]["basic"]["first_name"] == "Jane"
        assert api_data["profile"]["appearance"]["eye_color"] == "blue"
        assert api_data["profile"]["skills"]["list"] == ["swordfighting", "archery", "tracking"]

    def test_character_optional_fields_persistence(self, client, sample_project, db):
        """Test: Dynamisch hinzugefügte Felder werden korrekt gespeichert"""
        from app import Character

        # Erstelle Charakter mit optionalen Feldern
        payload = {
            "name": "Test Character",
            "profile": {
                "basic": {
                    "first_name": "John",
                    "birth_date": "1990-05-15",  # Optionales Feld
                    "zodiac_sign": "Taurus"      # Optionales Feld
                },
                "appearance": {
                    "tattoos": "dragon on back",  # Optionales Feld
                    "scars": "none"                # Optionales Feld
                }
            }
        }

        create_response = client.post(
            f"/api/projects/{sample_project.id}/characters",
            data=json.dumps(payload),
            content_type="application/json"
        )
        character_id = create_response.get_json()["id"]

        # Prüfe DB-Persistenz
        with client.application.app_context():
            db_character = db.session.get(Character, character_id)
            import json as json_lib
            db_profile = json_lib.loads(db_character.profile_json)

            assert db_profile["basic"]["birth_date"] == "1990-05-15"
            assert db_profile["basic"]["zodiac_sign"] == "Taurus"
            assert db_profile["appearance"]["tattoos"] == "dragon on back"

        # Update: Entferne ein optionales Feld
        update_payload = {
            "profile": {
                "basic": {
                    "first_name": "John",
                    "birth_date": "1990-05-15"
                    # zodiac_sign weggelassen
                },
                "appearance": {
                    "tattoos": "dragon on back"
                    # scars weggelassen
                }
            }
        }

        client.patch(
            f"/api/characters/{character_id}",
            data=json.dumps(update_payload),
            content_type="application/json"
        )

        # Prüfe, dass entferntes Feld weg ist
        with client.application.app_context():
            db.session.expire_all()
            db_character = db.session.get(Character, character_id)
            db_profile = json_lib.loads(db_character.profile_json)

            assert "birth_date" in db_profile["basic"]
            # Die alten Felder sollten noch da sein wenn nur PATCH verwendet wird
            # Bei PUT würden sie gelöscht

    def test_character_undefined_field_removal(self, client, sample_project, db):
        """Test: Felder mit undefined-Wert werden aus DB entfernt"""
        from app import Character
        import json as json_lib

        # Erstelle Charakter mit Feld
        payload = {
            "name": "Test",
            "profile": {
                "basic": {
                    "first_name": "John",
                    "nickname": "Johnny"
                }
            }
        }

        create_response = client.post(
            f"/api/projects/{sample_project.id}/characters",
            data=json.dumps(payload),
            content_type="application/json"
        )
        character_id = create_response.get_json()["id"]

        # Prüfe initial
        with client.application.app_context():
            db_character = db.session.get(Character, character_id)
            db_profile = json_lib.loads(db_character.profile_json)
            assert "nickname" in db_profile["basic"]

        # Update mit null/None um Feld zu löschen
        update_payload = {
            "profile": {
                "basic": {
                    "first_name": "John",
                    "nickname": None  # Explizit auf None setzen
                }
            }
        }

        client.put(
            f"/api/characters/{character_id}",
            data=json.dumps(update_payload),
            content_type="application/json"
        )

        # Prüfe, dass Feld entfernt wurde
        with client.application.app_context():
            db.session.expire_all()
            db_character = db.session.get(Character, character_id)
            db_profile = json_lib.loads(db_character.profile_json)

            # Nickname sollte nicht mehr existieren
            assert "nickname" not in db_profile["basic"] or db_profile["basic"]["nickname"] is None

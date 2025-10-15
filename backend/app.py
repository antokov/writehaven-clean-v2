# backend/app.py
import os
import json
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError, OperationalError

try:
    from backend.extensions import db
    from backend.models import Project, Chapter, Scene, Character, WorldNode, User
    from backend.word_parser import parse_word_document
except ImportError:
    from extensions import db
    from models import Project, Chapter, Scene, Character, WorldNode, User
    from word_parser import parse_word_document


# ---------- DB URI helpers ----------
def _sqlite_uri() -> str:
    path = os.getenv("SQLITE_PATH", "/tmp/app.db")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return "sqlite:///" + path.replace("\\", "/")


def get_database_uri() -> str:
    uri = os.getenv("DATABASE_URL")
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql+psycopg://", 1)
    return uri or _sqlite_uri()


# ---------- helper: json <-> dict ----------
def _loads(s: str):
    if not s:
        return {}
    try:
        return json.loads(s)
    except Exception:
        return {}

def _dumps(d: dict) -> str:
    try:
        return json.dumps(d or {}, ensure_ascii=False)
    except Exception:
        return "{}"


# ---------- App Factory ----------
def create_app():
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.sort_keys = False

    # JWT Secret Key
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    app.config["JWT_EXPIRATION_HOURS"] = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))

    # SQLAlchemy
    app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True,
        "pool_recycle": 1800,
        "isolation_level": "AUTOCOMMIT"  # Verhindert hängende Transaktionen
    }
    
    # Serve index.html for all non-API routes
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path.startswith('api/'):
            return {"error": "Not Found"}, 404
        try:
            return send_from_directory('static', 'index.html')
        except:
            return send_from_directory('static', path)

    # CORS
    allowed = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]
    CORS(app,
         resources={r"/api/*": {"origins": allowed}},
         supports_credentials=False,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])

    # DB init
    db.init_app(app)

    with app.app_context():
        # SQLite FK erzwingen
        if app.config["SQLALCHEMY_DATABASE_URI"].startswith("sqlite"):
            from sqlalchemy import event
            from sqlalchemy.engine import Engine

            @event.listens_for(Engine, "connect")
            def _set_sqlite_pragma(dbapi_connection, connection_record):
                cur = dbapi_connection.cursor()
                cur.execute("PRAGMA foreign_keys=ON")
                cur.close()

        # Tables anlegen (checkfirst)
        db.Model.metadata.create_all(bind=db.engine, checkfirst=True)

        # --- sehr kleine "Migration": character.profile_json nachrüsten ---
        try:
            # Erst alle offenen Transaktionen zurückrollen
            db.session.rollback()

            # Postgres-spezifischer Check
            check_query = """
                SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'character'
                    AND column_name = 'profile_json'
                )
            """
            try:
                has_column = db.session.execute(text(check_query)).scalar()
            except Exception:
                # Fallback für SQLite
                has_column = db.session.execute(text("""
                    SELECT 1
                    FROM pragma_table_info('character')
                    WHERE name = 'profile_json'
                """)).scalar()

            if not has_column:
                db.session.execute(text("ALTER TABLE character ADD COLUMN profile_json TEXT DEFAULT '{}'"))
                db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Migration error (can be ignored if column exists): {str(e)}")

        # --- Migration: worldnode.relations_json nachrüsten ---
        try:
            db.session.rollback()

            # Postgres-spezifischer Check
            check_query = """
                SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'worldnode'
                    AND column_name = 'relations_json'
                )
            """
            try:
                has_column = db.session.execute(text(check_query)).scalar()
            except Exception:
                # Fallback für SQLite
                has_column = db.session.execute(text("""
                    SELECT 1
                    FROM pragma_table_info('worldnode')
                    WHERE name = 'relations_json'
                """)).scalar()

            if not has_column:
                db.session.execute(text("ALTER TABLE worldnode ADD COLUMN relations_json TEXT DEFAULT '{}'"))
                db.session.commit()
                print("Migration: worldnode.relations_json column added successfully")
        except Exception as e:
            db.session.rollback()
            print(f"Migration error for worldnode.relations_json (can be ignored if column exists): {str(e)}")

        # --- Migration: project.user_id nachrüsten ---
        try:
            db.session.rollback()

            # Check ob user_id existiert
            check_query = """
                SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'project'
                    AND column_name = 'user_id'
                )
            """
            try:
                has_column = db.session.execute(text(check_query)).scalar()
            except Exception:
                # Fallback für SQLite
                has_column = db.session.execute(text("""
                    SELECT 1
                    FROM pragma_table_info('project')
                    WHERE name = 'user_id'
                """)).scalar()

            if not has_column:
                # Spalte hinzufügen (nullable zuerst)
                db.session.execute(text("ALTER TABLE project ADD COLUMN user_id INTEGER"))
                db.session.commit()

                # Test-User erstellen oder finden
                test_user = User.query.filter_by(email="test@test.com").first()
                if not test_user:
                    test_user = User(email="test@test.com", name="Test User")
                    test_user.set_password("test123")
                    db.session.add(test_user)
                    db.session.commit()
                    print(f"Migration: Test user created with ID {test_user.id}")

                # Alle bestehenden Projekte dem Test-User zuweisen
                db.session.execute(text(f"UPDATE project SET user_id = {test_user.id} WHERE user_id IS NULL"))
                db.session.commit()

                print(f"Migration: project.user_id column added and existing projects assigned to test user")
        except Exception as e:
            db.session.rollback()
            print(f"Migration error for project.user_id (can be ignored if column exists): {str(e)}")

        # --- Migration: project settings fields nachrüsten ---
        settings_columns = [
            ("author", "TEXT DEFAULT ''"),
            ("genre", "TEXT DEFAULT ''"),
            ("language", "TEXT DEFAULT 'de'"),
            ("target_audience", "TEXT DEFAULT ''"),
            ("estimated_word_count", "INTEGER DEFAULT 0"),
            ("cover_image_url", "TEXT DEFAULT ''"),
            ("share_with_community", "BOOLEAN DEFAULT 0")
        ]

        for col_name, col_type in settings_columns:
            try:
                db.session.rollback()

                # Check ob Spalte existiert
                check_query = f"""
                    SELECT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_name = 'project'
                        AND column_name = '{col_name}'
                    )
                """
                try:
                    has_column = db.session.execute(text(check_query)).scalar()
                except Exception:
                    # Fallback für SQLite
                    has_column = db.session.execute(text(f"""
                        SELECT 1
                        FROM pragma_table_info('project')
                        WHERE name = '{col_name}'
                    """)).scalar()

                if not has_column:
                    db.session.execute(text(f"ALTER TABLE project ADD COLUMN {col_name} {col_type}"))
                    db.session.commit()
                    print(f"Migration: project.{col_name} column added")
            except Exception as e:
                db.session.rollback()
                print(f"Migration error for project.{col_name} (can be ignored if column exists): {str(e)}")

        # --- Migration: user.language nachrüsten ---
        try:
            db.session.rollback()

            check_query = """
                SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'user'
                    AND column_name = 'language'
                )
            """
            try:
                has_column = db.session.execute(text(check_query)).scalar()
            except Exception:
                # Fallback für SQLite
                has_column = db.session.execute(text("""
                    SELECT 1
                    FROM pragma_table_info('user')
                    WHERE name = 'language'
                """)).scalar()

            if not has_column:
                db.session.execute(text("ALTER TABLE user ADD COLUMN language TEXT DEFAULT 'de'"))
                db.session.commit()
                print("Migration: user.language column added")
        except Exception as e:
            db.session.rollback()
            print(f"Migration error for user.language (can be ignored if column exists): {str(e)}")

    # ---------- SPA fallback (für Deep Links) ----------
    @app.before_request
    def spa_fallback():
        if request.method != "GET":
            return None
        p = request.path or "/"
        if p.startswith("/api") or p == "/":
            return None
        rel = p.lstrip("/")
        if app.static_folder:
            full = os.path.join(app.static_folder, rel)
            if os.path.isfile(full):
                return None
        return send_from_directory(app.static_folder, "index.html")

    # ---------- Small helpers ----------
    def ok(data, status=200): return jsonify(data), status
    def not_found():          return ok({"error": "not_found"}, 404)
    def bad_request(msg="bad_request"): return ok({"error": msg}, 400)
    def forbidden():          return ok({"error": "forbidden"}, 403)

    def verify_project_ownership(project_id, user_id):
        """Prüft ob das Projekt dem User gehört"""
        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        return project

    def verify_chapter_ownership(chapter_id, user_id):
        """Prüft ob das Chapter dem User gehört (über project)"""
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return None
        return chapter if verify_project_ownership(chapter.project_id, user_id) else None

    def verify_character_ownership(character_id, user_id):
        """Prüft ob der Character dem User gehört (über project)"""
        character = Character.query.get(character_id)
        if not character:
            return None
        return character if verify_project_ownership(character.project_id, user_id) else None

    def verify_world_ownership(world_id, user_id):
        """Prüft ob das World-Element dem User gehört (über project)"""
        world = WorldNode.query.get(world_id)
        if not world:
            return None
        return world if verify_project_ownership(world.project_id, user_id) else None

    # ---------- Health ----------
    @app.get("/api/health")
    def health():
        try:
            db.session.execute(text("SELECT 1"))
            db_ok = "ok"
        except Exception as e:
            db_ok = f"error: {e.__class__.__name__}: {e}"
        return jsonify({"status": "ok", "db": db_ok}), 200

    # ---------- JWT Helper ----------
    def generate_token(user_id):
        """Generiere JWT Token"""
        payload = {
            "user_id": user_id,
            "exp": datetime.utcnow() + timedelta(hours=app.config["JWT_EXPIRATION_HOURS"])
        }
        return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")

    def token_required(f):
        """Decorator für protected routes"""
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            auth_header = request.headers.get("Authorization")

            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

            if not token:
                return ok({"error": "Token fehlt"}, 401)

            try:
                payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
                current_user_id = payload["user_id"]
                current_user = User.query.get(current_user_id)
                if not current_user:
                    return ok({"error": "User nicht gefunden"}, 401)
            except jwt.ExpiredSignatureError:
                return ok({"error": "Token abgelaufen"}, 401)
            except jwt.InvalidTokenError:
                return ok({"error": "Ungültiger Token"}, 401)

            return f(current_user, *args, **kwargs)

        return decorated

    # ---------- Auth ----------
    @app.post("/api/auth/register")
    def register():
        """Registriere neuen User"""
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        name = data.get("name", "").strip()

        if not email or not password:
            return ok({"error": "Email und Passwort erforderlich"}, 400)

        if len(password) < 6:
            return ok({"error": "Passwort muss mindestens 6 Zeichen lang sein"}, 400)

        # Prüfe ob User existiert
        if User.query.filter_by(email=email).first():
            return ok({"error": "Email bereits registriert"}, 400)

        # Erstelle User
        user = User(email=email, name=name or email.split("@")[0])
        user.set_password(password)

        try:
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return ok({"error": "Registrierung fehlgeschlagen"}, 400)

        token = generate_token(user.id)
        return ok({
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name
            }
        }, 201)

    @app.post("/api/auth/login")
    def login():
        """Login User"""
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return ok({"error": "Email und Passwort erforderlich"}, 400)

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return ok({"error": "Ungültige Anmeldedaten"}, 401)

        token = generate_token(user.id)
        return ok({
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name
            }
        })

    @app.get("/api/auth/me")
    @token_required
    def get_current_user(current_user):
        """Hole aktuellen User"""
        return ok({
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "language": current_user.language or "de",
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None
        })

    @app.put("/api/auth/update-language")
    @token_required
    def update_user_language(current_user):
        """Update user language preference"""
        data = request.get_json() or {}
        language = data.get("language", "de")

        # Validiere Sprache
        valid_languages = ['de', 'en', 'es', 'fr', 'it', 'pt', 'ru', 'zh', 'ja', 'ar']
        if language not in valid_languages:
            return bad_request("Ungültige Sprache")

        current_user.language = language
        db.session.commit()

        return ok({
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "language": current_user.language
        })

    # ---------- Projects ----------
    @app.get("/api/projects")
    @token_required
    def list_projects(current_user):
        rows = (Project.query.filter_by(user_id=current_user.id)
                .order_by(Project.updated_at.desc()).all()
                if hasattr(Project, "updated_at")
                else Project.query.filter_by(user_id=current_user.id)
                .order_by(Project.id.desc()).all())
        return ok([{"id": p.id, "title": p.title, "description": p.description} for p in rows])

    @app.post("/api/projects")
    @token_required
    def create_project(current_user):
        # Check if multipart/form-data (file upload)
        if request.content_type and 'multipart/form-data' in request.content_type:
            title = request.form.get("title", "Neues Projekt").strip()
            description = request.form.get("description", "")
            file = request.files.get("file")

            # Erstelle Projekt
            p = Project(
                user_id=current_user.id,
                title=title,
                description=description
            )
            db.session.add(p)
            db.session.commit()

            # Verarbeite Word-Dokument falls vorhanden
            if file and file.filename:
                try:
                    # Parse Word-Dokument
                    parsed = parse_word_document(file.stream)

                    # Erstelle Kapitel und Szenen
                    for chapter_data in parsed.get("chapters", []):
                        chapter = Chapter(
                            project_id=p.id,
                            title=chapter_data.get("title", "Kapitel"),
                            order_index=chapter_data.get("order_index", 0)
                        )
                        db.session.add(chapter)
                        db.session.flush()  # Get chapter ID

                        # Erstelle Szenen für dieses Kapitel
                        for scene_data in chapter_data.get("scenes", []):
                            scene = Scene(
                                chapter_id=chapter.id,
                                title=scene_data.get("title", "Szene"),
                                content=scene_data.get("content", ""),
                                order_index=scene_data.get("order_index", 0)
                            )
                            db.session.add(scene)

                    db.session.commit()

                except Exception as e:
                    db.session.rollback()
                    # Lösche Projekt bei Fehler
                    db.session.delete(p)
                    db.session.commit()
                    return ok({"error": f"Fehler beim Verarbeiten des Word-Dokuments: {str(e)}"}, 400)

            return ok({"id": p.id, "title": p.title, "description": p.description}, 201)

        else:
            # JSON request (normal)
            data = request.get_json() or {}
            p = Project(
                user_id=current_user.id,
                title=data.get("title") or "Neues Projekt",
                description=data.get("description", "")
            )
            db.session.add(p)
            db.session.commit()
            return ok({"id": p.id, "title": p.title, "description": p.description}, 201)

    @app.get("/api/projects/<int:pid>")
    @token_required
    def get_project(current_user, pid):
        p = Project.query.filter_by(id=pid, user_id=current_user.id).first()
        if not p: return not_found()
        return ok({"id": p.id, "title": p.title, "description": p.description})

    @app.put("/api/projects/<int:pid>")
    @token_required
    def update_project(current_user, pid):
        p = Project.query.filter_by(id=pid, user_id=current_user.id).first()
        if not p: return not_found()
        data = request.get_json() or {}
        p.title = data.get("title", p.title)
        p.description = data.get("description", p.description)
        db.session.commit()
        return ok({"id": p.id, "title": p.title, "description": p.description})

    @app.delete("/api/projects/<int:pid>")
    @token_required
    def delete_project(current_user, pid):
        p = Project.query.filter_by(id=pid, user_id=current_user.id).first()
        if not p: return not_found()
        db.session.delete(p)
        db.session.commit()
        return ok({"ok": True})

    # ---------- Chapters ----------
    @app.get("/api/projects/<int:pid>/chapters")
    @token_required
    def list_chapters(current_user, pid):
        if not verify_project_ownership(pid, current_user.id):
            return forbidden()
        rows = (Chapter.query.filter_by(project_id=pid)
                .order_by(Chapter.order_index.asc(), Chapter.id.asc())
                .all())
        return ok([{
            "id": c.id, "project_id": c.project_id, "title": c.title,
            "order_index": c.order_index, "content": getattr(c, "content", None)
        } for c in rows])

    @app.post("/api/projects/<int:pid>/chapters")
    @token_required
    def create_chapter(current_user, pid):
        if not verify_project_ownership(pid, current_user.id):
            return forbidden()
        data = request.get_json() or {}
        c = Chapter(project_id=pid,
                    title=(data.get("title") or "Neues Kapitel").strip(),
                    order_index=int(data.get("order_index", 0)))
        db.session.add(c); db.session.commit()
        return ok({"id": c.id, "title": c.title, "order_index": c.order_index, "project_id": c.project_id}, 201)

    @app.get("/api/chapters/<int:cid>")
    @token_required
    def get_chapter(current_user, cid):
        c = verify_chapter_ownership(cid, current_user.id)
        if not c: return not_found()
        return ok({"id": c.id, "project_id": c.project_id, "title": c.title,
                   "order_index": c.order_index, "content": getattr(c, "content", None)})

    @app.put("/api/chapters/<int:cid>")
    @token_required
    def update_chapter(current_user, cid):
        c = verify_chapter_ownership(cid, current_user.id)
        if not c: return not_found()
        data = request.get_json() or {}
        title = data.get("title")
        if title is not None:
            c.title = title.strip()
        if "order_index" in data:
            c.order_index = int(data.get("order_index") or 0)
        db.session.commit()
        return ok({"id": c.id, "title": c.title, "order_index": c.order_index, "project_id": c.project_id})

    @app.delete("/api/chapters/<int:cid>")
    @token_required
    def delete_chapter(current_user, cid):
        c = verify_chapter_ownership(cid, current_user.id)
        if not c: return not_found()
        db.session.delete(c); db.session.commit()
        return ok({"ok": True})

    # ---------- Scenes ----------
    @app.get("/api/chapters/<int:cid>/scenes")
    @token_required
    def list_scenes(current_user, cid):
        if not verify_chapter_ownership(cid, current_user.id):
            return forbidden()
        rows = (Scene.query.filter_by(chapter_id=cid)
                .order_by(Scene.order_index.asc(), Scene.id.asc())
                .all())
        return ok([{
            "id": s.id, "chapter_id": s.chapter_id, "title": s.title,
            "order_index": s.order_index, "content": s.content
        } for s in rows])

    @app.post("/api/chapters/<int:cid>/scenes")
    @token_required
    def create_scene(current_user, cid):
        if not verify_chapter_ownership(cid, current_user.id): return forbidden()
        data = request.get_json() or {}
        s = Scene(chapter_id=cid,
                  title=(data.get("title") or "Neue Szene").strip(),
                  order_index=int(data.get("order_index", 0)),
                  content=data.get("content", "") or "")
        try:
            db.session.add(s); db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return bad_request("Database integrity error while creating scene.")
        return ok({"id": s.id, "title": s.title, "order_index": s.order_index,
                   "chapter_id": s.chapter_id, "content": s.content}, 201)

    @app.get("/api/scenes/<int:sid>")
    @token_required
    def get_scene(current_user, sid):
        s = Scene.query.get(sid)
        if s and not verify_chapter_ownership(s.chapter_id, current_user.id):
            return forbidden()
        if not s: return not_found()
        return ok({"id": s.id, "chapter_id": s.chapter_id, "title": s.title,
                   "order_index": s.order_index, "content": s.content})

    @app.put("/api/scenes/<int:sid>")
    @token_required
    def update_scene(current_user, sid):
        s = Scene.query.get(sid)
        if not s: return not_found()
        if not verify_chapter_ownership(s.chapter_id, current_user.id):
            return forbidden()
        data = request.get_json() or {}
        if (t := data.get("title")) is not None:   s.title = t.strip()
        if (c := data.get("content")) is not None: s.content = c
        db.session.commit()
        return ok({"id": s.id, "title": s.title, "order_index": s.order_index,
                   "chapter_id": s.chapter_id, "content": s.content})

    @app.delete("/api/scenes/<int:sid>")
    @token_required
    def delete_scene(current_user, sid):
        s = Scene.query.get(sid)
        if not s: return not_found()
        if not verify_chapter_ownership(s.chapter_id, current_user.id):
            return forbidden()
        db.session.delete(s); db.session.commit()
        return ok({"ok": True})

    # ---------- Characters ----------
    def _char_to_dict(c: Character):
        return {
            "id": c.id,
            "project_id": c.project_id,
            "name": c.name,
            "summary": c.summary,
            "avatar_url": c.avatar_url,
            "profile": _loads(c.profile_json or "{}"),
        }

    @app.get("/api/projects/<int:pid>/characters")
    @token_required
    def list_characters(current_user, pid):
        if not verify_project_ownership(pid, current_user.id):
            return forbidden()
        rows = Character.query.filter_by(project_id=pid).order_by(Character.id.asc()).all()
        return ok([_char_to_dict(c) for c in rows])

    @app.post("/api/projects/<int:pid>/characters")
    @token_required
    def create_character(current_user, pid):
        if not verify_project_ownership(pid, current_user.id):
            return not_found()
        data = request.get_json() or {}
        profile = data.get("profile") or {}
        c = Character(
            project_id=pid,
            name=data.get("name") or "Neuer Charakter",
            summary=data.get("summary", ""),
            avatar_url=data.get("avatar_url", ""),
            profile_json=_dumps(profile),
        )
        db.session.add(c); db.session.commit()
        return ok(_char_to_dict(c), 201)

    @app.get("/api/characters/<int:cid>")
    @token_required
    def get_character(current_user, cid):
        c = verify_character_ownership(cid, current_user.id)
        if not c: return not_found()
        return ok(_char_to_dict(c))

    @app.put("/api/characters/<int:cid>")
    @app.patch("/api/characters/<int:cid>")
    @token_required
    def update_character(current_user, cid):
        c = verify_character_ownership(cid, current_user.id)
        if not c: return not_found()
        data = request.get_json() or {}

        # flache Felder
        if "name" in data:        c.name = (data.get("name") or "").strip()
        if "summary" in data:     c.summary = data.get("summary") or ""
        if "avatar_url" in data:  c.avatar_url = data.get("avatar_url") or ""

        # profil (entweder komplett geliefert …)
        if "profile" in data and isinstance(data["profile"], dict):
            c.profile_json = _dumps(data["profile"])
        else:
            # … oder inkrementell (zur Abwärtskompatibilität)
            prof = _loads(c.profile_json or "{}")
            # bekannte Felder aus alten Clients mappen – optional
            # Beispiel: basic.first_name etc. kannst du hier zusammenführen
            # Wenn nichts kommt, bleibt prof wie es ist.
            c.profile_json = _dumps(prof)

        db.session.commit()
        return ok(_char_to_dict(c))

    @app.delete("/api/characters/<int:cid>")
    @token_required
    def delete_character(current_user, cid):
        c = verify_character_ownership(cid, current_user.id)
        if not c: return not_found()
        db.session.delete(c); db.session.commit()
        return ok({"ok": True})

    # ---------- World ----------
    @app.get("/api/projects/<int:pid>/world")
    @token_required
    def list_world(current_user, pid):
        if not verify_project_ownership(pid, current_user.id):
            return forbidden()
        rows = WorldNode.query.filter_by(project_id=pid).order_by(WorldNode.id.asc()).all()
        return ok([{
            "id": w.id, "project_id": w.project_id, "title": w.title, "kind": w.kind,
            "summary": w.summary, "icon": w.icon
        } for w in rows])

    @app.post("/api/projects/<int:pid>/world")
    @token_required
    def create_world(current_user, pid):
        if not verify_project_ownership(pid, current_user.id):
            return forbidden()
        data = request.get_json() or {}
        w = WorldNode(project_id=pid,
                      title=data.get("title") or "Neues Element",
                      kind=data.get("kind", "Ort"),
                      summary=data.get("summary", ""),
                      icon=data.get("icon", "🏰"))
        db.session.add(w); db.session.commit()
        return ok({"id": w.id, "project_id": w.project_id, "title": w.title, "kind": w.kind,
                   "summary": w.summary, "icon": w.icon}, 201)

    @app.get("/api/world/<int:w_id>")
    @token_required
    def get_world(current_user, w_id):
        w = verify_world_ownership(w_id, current_user.id)
        if not w: return not_found()
        return ok({
            "id": w.id,
            "project_id": w.project_id,
            "title": w.title,
            "kind": w.kind,
            "summary": w.summary,
            "icon": w.icon,
            "relations": _loads(w.relations_json or "{}")
        })

    @app.put("/api/world/<int:w_id>")
    @token_required
    def update_world(current_user, w_id):
        w = verify_world_ownership(w_id, current_user.id)
        if not w: return not_found()
        data = request.get_json() or {}
        w.title   = data.get("title", w.title)
        w.kind    = data.get("kind", w.kind)
        w.summary = data.get("summary", w.summary)
        w.icon    = data.get("icon", w.icon)

        # Relations speichern
        if "relations" in data and isinstance(data["relations"], dict):
            w.relations_json = _dumps(data["relations"])

        db.session.commit()
        return ok({
            "id": w.id,
            "project_id": w.project_id,
            "title": w.title,
            "kind": w.kind,
            "summary": w.summary,
            "icon": w.icon,
            "relations": _loads(w.relations_json or "{}")
        })

    @app.delete("/api/world/<int:w_id>")
    @token_required
    def delete_world(current_user, w_id):
        w = verify_world_ownership(w_id, current_user.id)
        if not w: return not_found()
        db.session.delete(w); db.session.commit()
        return ok({"ok": True})

    # ---------- Project Settings ----------
    @app.get("/api/projects/<int:pid>/settings")
    @token_required
    def get_project_settings(current_user, pid):
        p = verify_project_ownership(pid, current_user.id)
        if not p: return not_found()
        return ok({
            "title": p.title,
            "author": p.author or "",
            "genre": p.genre or "",
            "language": p.language or "de",
            "description": p.description or "",
            "target_audience": p.target_audience or "",
            "estimated_word_count": p.estimated_word_count or 0,
            "cover_image_url": p.cover_image_url or "",
            "share_with_community": p.share_with_community or False
        })

    @app.put("/api/projects/<int:pid>/settings")
    @token_required
    def update_project_settings(current_user, pid):
        p = verify_project_ownership(pid, current_user.id)
        if not p: return not_found()
        data = request.get_json() or {}

        # Update fields
        if "title" in data: p.title = data["title"]
        if "author" in data: p.author = data["author"]
        if "genre" in data: p.genre = data["genre"]
        if "language" in data: p.language = data["language"]
        if "description" in data: p.description = data["description"]
        if "target_audience" in data: p.target_audience = data["target_audience"]
        if "estimated_word_count" in data: p.estimated_word_count = int(data["estimated_word_count"] or 0)
        if "cover_image_url" in data: p.cover_image_url = data["cover_image_url"]
        if "share_with_community" in data: p.share_with_community = bool(data["share_with_community"])

        db.session.commit()
        return ok({
            "title": p.title,
            "author": p.author,
            "genre": p.genre,
            "language": p.language,
            "description": p.description,
            "target_audience": p.target_audience,
            "estimated_word_count": p.estimated_word_count,
            "cover_image_url": p.cover_image_url,
            "share_with_community": p.share_with_community
        })

    @app.post("/api/projects/<int:pid>/upload-cover")
    @token_required
    def upload_project_cover(current_user, pid):
        p = verify_project_ownership(pid, current_user.id)
        if not p: return not_found()

        if 'cover' not in request.files:
            return bad_request("Keine Datei hochgeladen")

        file = request.files['cover']
        if file.filename == '':
            return bad_request("Leere Datei")

        # Erlaubte Dateitypen
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if ext not in allowed_extensions:
            return bad_request("Ungültiges Dateiformat. Erlaubt: PNG, JPG, JPEG, GIF, WEBP")

        # Erstelle uploads Verzeichnis
        upload_folder = os.path.join(app.static_folder, 'uploads', 'covers')
        os.makedirs(upload_folder, exist_ok=True)

        # Generiere eindeutigen Dateinamen
        import uuid
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(upload_folder, filename)

        # Speichere Datei
        file.save(filepath)

        # Generiere URL (relativ zu static folder)
        cover_url = f"/uploads/covers/{filename}"

        # Update Projekt
        p.cover_image_url = cover_url
        db.session.commit()

        return ok({"cover_url": cover_url})

    # Optional: globaler Integrity-Handler
    @app.errorhandler(IntegrityError)
    def handle_integrity(e):
        db.session.rollback()
        return bad_request("Database integrity error.")

    return app


if __name__ == "__main__":
    create_app().run(host="127.0.0.1", port=5000, debug=True)

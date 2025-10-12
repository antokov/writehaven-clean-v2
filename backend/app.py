# backend/app.py
import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError, OperationalError

try:
    from backend.extensions import db
    from backend.models import Project, Chapter, Scene, Character, WorldNode
except ImportError:
    from extensions import db
    from models import Project, Chapter, Scene, Character, WorldNode


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

    # SQLAlchemy
    app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_pre_ping": True, "pool_recycle": 1800}
    
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

    # ---------- Health ----------
    @app.get("/api/health")
    def health():
        try:
            db.session.execute(text("SELECT 1"))
            db_ok = "ok"
        except Exception as e:
            db_ok = f"error: {e.__class__.__name__}: {e}"
        return jsonify({"status": "ok", "db": db_ok}), 200

    # ---------- Projects ----------
    @app.get("/api/projects")
    def list_projects():
        rows = (Project.query.order_by(Project.updated_at.desc()).all()
                if hasattr(Project, "updated_at")
                else Project.query.order_by(Project.id.desc()).all())
        return ok([{"id": p.id, "title": p.title, "description": p.description} for p in rows])

    @app.post("/api/projects")
    def create_project():
        data = request.get_json() or {}
        p = Project(title=data.get("title") or "Neues Projekt",
                    description=data.get("description", ""))
        db.session.add(p)
        db.session.commit()
        return ok({"id": p.id, "title": p.title, "description": p.description}, 201)

    @app.get("/api/projects/<int:pid>")
    def get_project(pid):
        p = Project.query.get(pid)
        if not p: return not_found()
        return ok({"id": p.id, "title": p.title, "description": p.description})

    @app.put("/api/projects/<int:pid>")
    def update_project(pid):
        p = Project.query.get(pid)
        if not p: return not_found()
        data = request.get_json() or {}
        p.title = data.get("title", p.title)
        p.description = data.get("description", p.description)
        db.session.commit()
        return ok({"id": p.id, "title": p.title, "description": p.description})

    @app.delete("/api/projects/<int:pid>")
    def delete_project(pid):
        p = Project.query.get(pid)
        if not p: return not_found()
        db.session.delete(p)
        db.session.commit()
        return ok({"ok": True})

    # ---------- Chapters ----------
    @app.get("/api/projects/<int:pid>/chapters")
    def list_chapters(pid):
        rows = (Chapter.query.filter_by(project_id=pid)
                .order_by(Chapter.order_index.asc(), Chapter.id.asc())
                .all())
        return ok([{
            "id": c.id, "project_id": c.project_id, "title": c.title,
            "order_index": c.order_index, "content": getattr(c, "content", None)
        } for c in rows])

    @app.post("/api/projects/<int:pid>/chapters")
    def create_chapter(pid):
        if not Project.query.get(pid): return not_found()
        data = request.get_json() or {}
        c = Chapter(project_id=pid,
                    title=(data.get("title") or "Neues Kapitel").strip(),
                    order_index=int(data.get("order_index", 0)))
        db.session.add(c); db.session.commit()
        return ok({"id": c.id, "title": c.title, "order_index": c.order_index, "project_id": c.project_id}, 201)

    @app.get("/api/chapters/<int:cid>")
    def get_chapter(cid):
        c = Chapter.query.get(cid)
        if not c: return not_found()
        return ok({"id": c.id, "project_id": c.project_id, "title": c.title,
                   "order_index": c.order_index, "content": getattr(c, "content", None)})

    @app.put("/api/chapters/<int:cid>")
    def update_chapter(cid):
        c = Chapter.query.get(cid)
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
    def delete_chapter(cid):
        c = Chapter.query.get(cid)
        if not c: return not_found()
        db.session.delete(c); db.session.commit()
        return ok({"ok": True})

    # ---------- Scenes ----------
    @app.get("/api/chapters/<int:cid>/scenes")
    def list_scenes(cid):
        rows = (Scene.query.filter_by(chapter_id=cid)
                .order_by(Scene.order_index.asc(), Scene.id.asc())
                .all())
        return ok([{
            "id": s.id, "chapter_id": s.chapter_id, "title": s.title,
            "order_index": s.order_index, "content": s.content
        } for s in rows])

    @app.post("/api/chapters/<int:cid>/scenes")
    def create_scene(cid):
        if not Chapter.query.get(cid): return not_found()
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
    def get_scene(sid):
        s = Scene.query.get(sid)
        if not s: return not_found()
        return ok({"id": s.id, "chapter_id": s.chapter_id, "title": s.title,
                   "order_index": s.order_index, "content": s.content})

    @app.put("/api/scenes/<int:sid>")
    def update_scene(sid):
        s = Scene.query.get(sid)
        if not s: return not_found()
        data = request.get_json() or {}
        if (t := data.get("title")) is not None:   s.title = t.strip()
        if (c := data.get("content")) is not None: s.content = c
        db.session.commit()
        return ok({"id": s.id, "title": s.title, "order_index": s.order_index,
                   "chapter_id": s.chapter_id, "content": s.content})

    @app.delete("/api/scenes/<int:sid>")
    def delete_scene(sid):
        s = Scene.query.get(sid)
        if not s: return not_found()
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
    def list_characters(pid):
        rows = Character.query.filter_by(project_id=pid).order_by(Character.id.asc()).all()
        return ok([_char_to_dict(c) for c in rows])

    @app.post("/api/projects/<int:pid>/characters")
    def create_character(pid):
        if not Project.query.get(pid):
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
    def get_character(cid):
        c = Character.query.get(cid)
        if not c: return not_found()
        return ok(_char_to_dict(c))

    @app.put("/api/characters/<int:cid>")
    @app.patch("/api/characters/<int:cid>")
    def update_character(cid):
        c = Character.query.get(cid)
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
    def delete_character(cid):
        c = Character.query.get(cid)
        if not c: return not_found()
        db.session.delete(c); db.session.commit()
        return ok({"ok": True})

    # ---------- World ----------
    @app.get("/api/projects/<int:pid>/world")
    def list_world(pid):
        rows = WorldNode.query.filter_by(project_id=pid).order_by(WorldNode.id.asc()).all()
        return ok([{
            "id": w.id, "project_id": w.project_id, "title": w.title, "kind": w.kind,
            "summary": w.summary, "icon": w.icon
        } for w in rows])

    @app.post("/api/projects/<int:pid>/world")
    def create_world(pid):
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
    def get_world(w_id):
        w = WorldNode.query.get(w_id)
        if not w: return not_found()
        return ok({
            "id": w.id, 
            "project_id": w.project_id, 
            "title": w.title, 
            "kind": w.kind,
            "summary": w.summary, 
            "icon": w.icon
        })

    @app.put("/api/world/<int:w_id>")
    def update_world(w_id):
        w = WorldNode.query.get(w_id)
        if not w: return not_found()
        data = request.get_json() or {}
        w.title   = data.get("title", w.title)
        w.kind    = data.get("kind", w.kind)
        w.summary = data.get("summary", w.summary)
        w.icon    = data.get("icon", w.icon)
        db.session.commit()
        return ok({"id": w.id, "project_id": w.project_id, "title": w.title, "kind": w.kind,
                   "summary": w.summary, "icon": w.icon})

    @app.delete("/api/world/<int:w_id>")
    def delete_world(w_id):
        w = WorldNode.query.get(w_id)
        if not w: return not_found()
        db.session.delete(w); db.session.commit()
        return ok({"ok": True})

    # Optional: globaler Integrity-Handler
    @app.errorhandler(IntegrityError)
    def handle_integrity(e):
        db.session.rollback()
        return bad_request("Database integrity error.")

    return app


if __name__ == "__main__":
    create_app().run(host="127.0.0.1", port=5000, debug=True)

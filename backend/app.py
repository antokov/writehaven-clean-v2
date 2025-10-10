import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

# Flexible Imports (lokal vs. Paket)
try:
    from backend.extensions import db
    from backend.models import Project, Chapter, Scene, Character, WorldNode
except ImportError:
    from extensions import db
    from models import Project, Chapter, Scene, Character, WorldNode


# -------------------- DB Helpers --------------------
def make_sqlite_uri() -> str:
    # Fallback: /tmp ist in App Runner beschreibbar
    path = os.getenv("SQLITE_PATH", "/tmp/app.db")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return "sqlite:///" + path.replace("\\", "/")


def get_database_uri() -> str:
    uri = os.getenv("DATABASE_URL")
    # Heroku-style: postgres:// -> psycopg v3 URL
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql+psycopg://", 1)
    return uri or make_sqlite_uri()


# -------------------- App Factory --------------------
def create_app():
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.sort_keys = False

    # SQLAlchemy
    app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True,
        "pool_recycle": 1800,
    }

    # CORS
    allowed = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]
    CORS(
        app,
        resources={r"/api/*": {"origins": allowed}},
        supports_credentials=False,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # DB init
    db.init_app(app)



    with app.app_context():
        # SQLite-FK nur wenn wirklich SQLite
        if app.config["SQLALCHEMY_DATABASE_URI"].startswith("sqlite"):
            from sqlalchemy import event
            from sqlalchemy.engine import Engine
            @event.listens_for(Engine, "connect")
            def _set_sqlite_pragma(dbapi_connection, connection_record):
                cur = dbapi_connection.cursor()
                cur.execute("PRAGMA foreign_keys=ON")
                cur.close()

        try:
            # WICHTIG: checkfirst hier über das Metadata-Objekt aufrufen
            db.Model.metadata.create_all(bind=db.engine, checkfirst=True)

            # zum Verifizieren, welche DB tatsächlich benutzt wird
            try:
                app.logger.info("Using DB: %s",
                    db.engine.url.render_as_string(hide_password=True))
            except Exception:
                pass
        except Exception:
            app.logger.exception("DB init failed; service continues without DB")


    # --------------- Small helpers ---------------
    def ok(data, status=200):
        return jsonify(data), status

    def not_found():
        return ok({"error": "not_found"}, 404)

    def bad_request(msg="bad_request"):
        return ok({"error": msg}, 400)

    # -------------------- Health (für App Runner) --------------------
    @app.get("/api/health")
    def health():
        try:
            db.session.execute(text("SELECT 1"))
            db_ok = "ok"
        except Exception as e:
            # Wichtig: HTTP 200 beibehalten; Status im Body signalisieren
            db_ok = f"error: {e.__class__.__name__}: {e}"
        return jsonify({"status": "ok", "db": db_ok}), 200

    # -------------------- Projects --------------------
    @app.get("/api/projects")
    def list_projects():
        rows = (
            Project.query.order_by(Project.updated_at.desc()).all()
            if hasattr(Project, "updated_at")
            else Project.query.order_by(Project.id.desc()).all()
        )
        return ok(
            [{"id": p.id, "title": p.title, "description": p.description} for p in rows]
        )

    @app.post("/api/projects")
    def create_project():
        data = request.get_json() or {}
        p = Project(
            title=data.get("title") or "Neues Projekt",
            description=data.get("description", ""),
        )
        db.session.add(p)
        db.session.commit()
        return ok({"id": p.id, "title": p.title, "description": p.description}, 201)

    @app.get("/api/projects/<int:pid>")
    def get_project(pid):
        p = Project.query.get(pid)
        if not p:
            return not_found()
        return ok({"id": p.id, "title": p.title, "description": p.description})

    @app.put("/api/projects/<int:pid>")
    def update_project(pid):
        p = Project.query.get(pid)
        if not p:
            return not_found()
        data = request.get_json() or {}
        p.title = data.get("title", p.title)
        p.description = data.get("description", p.description)
        db.session.commit()
        return ok({"id": p.id, "title": p.title, "description": p.description})

    @app.delete("/api/projects/<int:pid>")
    def delete_project(pid):
        p = Project.query.get(pid)
        if not p:
            return not_found()
        db.session.delete(p)
        db.session.commit()
        return ok({"ok": True})

    # -------------------- Chapters --------------------
    @app.get("/api/projects/<int:pid>/chapters")
    def list_chapters(pid):
        rows = (
            Chapter.query.filter_by(project_id=pid)
            .order_by(Chapter.order_index.asc(), Chapter.id.asc())
            .all()
        )
        return ok(
            [
                {
                    "id": c.id,
                    "project_id": c.project_id,
                    "title": c.title,
                    "order_index": c.order_index,
                    "content": getattr(c, "content", None),
                }
                for c in rows
            ]
        )

    @app.post("/api/projects/<int:pid>/chapters")
    def create_chapter(pid):
        proj = Project.query.get(pid)
        if not proj:
            return not_found()
        data = request.get_json() or {}
        title = (data.get("title") or "Neues Kapitel").strip()
        order_index = int(data.get("order_index", 0))
        c = Chapter(project_id=pid, title=title, order_index=order_index)
        db.session.add(c)
        db.session.commit()
        return ok(
            {
                "id": c.id,
                "title": c.title,
                "order_index": c.order_index,
                "project_id": c.project_id,
            },
            201,
        )

    @app.get("/api/chapters/<int:cid>")
    def get_chapter(cid):
        c = Chapter.query.get(cid)
        if not c:
            return not_found()
        return ok(
            {
                "id": c.id,
                "project_id": c.project_id,
                "title": c.title,
                "order_index": c.order_index,
                "content": getattr(c, "content", None),
            }
        )

    @app.put("/api/chapters/<int:cid>")
    def update_chapter(cid):
        c = Chapter.query.get(cid)
        if not c:
            return not_found()
        data = request.get_json() or {}
        title = data.get("title")
        if title is not None:
            c.title = title.strip()
        if "order_index" in data:
            c.order_index = int(data.get("order_index") or 0)
        db.session.commit()
        return ok(
            {
                "id": c.id,
                "title": c.title,
                "order_index": c.order_index,
                "project_id": c.project_id,
            }
        )

    @app.delete("/api/chapters/<int:cid>")
    def delete_chapter(cid):
        c = Chapter.query.get(cid)
        if not c:
            return not_found()
        db.session.delete(c)
        db.session.commit()
        return ok({"ok": True})

    # -------------------- Scenes --------------------
    @app.get("/api/chapters/<int:cid>/scenes")
    def list_scenes(cid):
        rows = (
            Scene.query.filter_by(chapter_id=cid)
            .order_by(Scene.order_index.asc(), Scene.id.asc())
            .all()
        )
        return ok(
            [
                {
                    "id": s.id,
                    "chapter_id": s.chapter_id,
                    "title": s.title,
                    "order_index": s.order_index,
                    "content": s.content,
                }
                for s in rows
            ]
        )

    @app.post("/api/chapters/<int:cid>/scenes")
    def create_scene(cid):
        chap = Chapter.query.get(cid)
        if not chap:
            return not_found()
        data = request.get_json() or {}
        title = (data.get("title") or "Neue Szene").strip()
        order_index = int(data.get("order_index", 0))
        content = data.get("content", "") or ""
        s = Scene(
            chapter_id=cid, title=title, order_index=order_index, content=content
        )
        try:
            db.session.add(s)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return bad_request("Database integrity error while creating scene.")
        return ok(
            {
                "id": s.id,
                "title": s.title,
                "order_index": s.order_index,
                "chapter_id": s.chapter_id,
                "content": s.content,
            },
            201,
        )

    @app.get("/api/scenes/<int:sid>")
    def get_scene(sid):
        s = Scene.query.get(sid)
        if not s:
            return not_found()
        return ok(
            {
                "id": s.id,
                "chapter_id": s.chapter_id,
                "title": s.title,
                "order_index": s.order_index,
                "content": s.content,
            }
        )

    @app.put("/api/scenes/<int:sid>")
    def update_scene(sid):
        s = Scene.query.get(sid)
        if not s:
            return not_found()
        data = request.get_json() or {}
        title = data.get("title")
        content = data.get("content")
        if title is not None:
            s.title = title.strip()
        if content is not None:
            s.content = content
        db.session.commit()
        return ok(
            {
                "id": s.id,
                "title": s.title,
                "order_index": s.order_index,
                "chapter_id": s.chapter_id,
                "content": s.content,
            }
        )

    @app.delete("/api/scenes/<int:sid>")
    def delete_scene(sid):
        s = Scene.query.get(sid)
        if not s:
            return not_found()
        db.session.delete(s)
        db.session.commit()
        return ok({"ok": True})

    # -------------------- Characters --------------------
    @app.get("/api/projects/<int:pid>/characters")
    def list_characters(pid):
        rows = Character.query.filter_by(project_id=pid).order_by(
            Character.id.asc()
        ).all()
        return ok(
            [
                {
                    "id": c.id,
                    "project_id": c.project_id,
                    "name": c.name,
                    "summary": c.summary,
                    "avatar_url": c.avatar_url,
                }
                for c in rows
            ]
        )

    @app.post("/api/projects/<int:pid>/characters")
    def create_character(pid):
        data = request.get_json() or {}
        c = Character(
            project_id=pid,
            name=data.get("name") or "Neue Figur",
            summary=data.get("summary", ""),
            avatar_url=data.get("avatar_url", ""),
        )
        db.session.add(c)
        db.session.commit()
        return ok(
            {
                "id": c.id,
                "project_id": c.project_id,
                "name": c.name,
                "summary": c.summary,
                "avatar_url": c.avatar_url,
            },
            201,
        )

    @app.get("/api/characters/<int:cid>")
    def get_character(cid):
        c = Character.query.get(cid)
        if not c:
            return not_found()
        return ok(
            {
                "id": c.id,
                "project_id": c.project_id,
                "name": c.name,
                "summary": c.summary,
                "avatar_url": c.avatar_url,
            }
        )

    @app.put("/api/characters/<int:cid>")
    def update_character(cid):
        c = Character.query.get(cid)
        if not c:
            return not_found()
        data = request.get_json() or {}
        c.name = data.get("name", c.name)
        c.summary = data.get("summary", c.summary)
        c.avatar_url = data.get("avatar_url", c.avatar_url)
        db.session.commit()
        return ok(
            {
                "id": c.id,
                "project_id": c.project_id,
                "name": c.name,
                "summary": c.summary,
                "avatar_url": c.avatar_url,
            }
        )

    @app.delete("/api/characters/<int:cid>")
    def delete_character(cid):
        c = Character.query.get(cid)
        if not c:
            return not_found()
        db.session.delete(c)
        db.session.commit()
        return ok({"ok": True})

    # -------------------- World --------------------
    @app.get("/api/projects/<int:pid>/world")
    def list_world(pid):
        rows = WorldNode.query.filter_by(project_id=pid).order_by(
            WorldNode.id.asc()
        ).all()
        return ok(
            [
                {
                    "id": w.id,
                    "project_id": w.project_id,
                    "title": w.title,
                    "kind": w.kind,
                    "summary": w.summary,
                    "icon": w.icon,
                }
                for w in rows
            ]
        )

    @app.post("/api/projects/<int:pid>/world")
    def create_world(pid):
        data = request.get_json() or {}
        wnode = WorldNode(
            project_id=pid,
            title=data.get("title") or "Neues Element",
            kind=data.get("kind", "Ort"),
            summary=data.get("summary", ""),
            icon=data.get("icon", "🏰"),
        )
        db.session.add(wnode)
        db.session.commit()
        return ok(
            {
                "id": wnode.id,
                "project_id": wnode.project_id,
                "title": wnode.title,
                "kind": wnode.kind,
                "summary": wnode.summary,
                "icon": wnode.icon,
            },
            201,
        )

    @app.put("/api/world/<int:w_id>")
    def update_world(w_id):
        wnode = WorldNode.query.get(w_id)
        if not wnode:
            return not_found()
        data = request.get_json() or {}
        wnode.title = data.get("title", wnode.title)
        wnode.kind = data.get("kind", wnode.kind)
        wnode.summary = data.get("summary", wnode.summary)
        wnode.icon = data.get("icon", wnode.icon)
        db.session.commit()
        return ok(
            {
                "id": wnode.id,
                "project_id": wnode.project_id,
                "title": wnode.title,
                "kind": wnode.kind,
                "summary": wnode.summary,
                "icon": wnode.icon,
            }
        )

    @app.delete("/api/world/<int:w_id>")
    def delete_world(w_id):
        wnode = WorldNode.query.get(w_id)
        if not wnode:
            return not_found()
        db.session.delete(wnode)
        db.session.commit()
        return ok({"ok": True})

    # (Optional) globaler Integrity-Handler
    @app.errorhandler(IntegrityError)
    def handle_integrity(e):
        db.session.rollback()
        return bad_request("Database integrity error.")

    # ---- SPA-Fallback: liefert index.html / Assets; NICHT für /api/... ----
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def spa(path):
        # API nicht intercepten
        if path.startswith("api/"):
            return not_found()
        # vorhandene Datei direkt liefern
        file_path = os.path.join(app.static_folder, path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return app.send_static_file(path)
        # ansonsten immer index.html (Client Routing)
        return app.send_static_file("index.html")

    return app


# Lokaler Start: python app.py
if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)

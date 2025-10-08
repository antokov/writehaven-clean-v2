import os
from flask import Flask, request, jsonify
from flask_cors import CORS

try:
    from backend.extensions import db
    from backend.models import Project, Chapter, Scene, Character, WorldNode
except ImportError:
    from extensions import db
    from models import Project, Chapter, Scene, Character, WorldNode

def make_sqlite_uri():
    path = os.path.abspath(os.path.join(os.path.dirname(__file__), "app.db"))
    return "sqlite:///" + path.replace("\\", "/")

def get_database_uri():
    uri = os.getenv("DATABASE_URL")
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql+psycopg://", 1)
    return uri or make_sqlite_uri()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.json.sort_keys = False

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    with app.app_context():
        if app.config["SQLALCHEMY_DATABASE_URI"].startswith("sqlite"):
            from sqlalchemy import event
            from sqlalchemy.engine import Engine
            @event.listens_for(Engine, "connect")
            def _set_sqlite_pragma(dbapi_connection, connection_record):
                cur = dbapi_connection.cursor()
                cur.execute("PRAGMA foreign_keys=ON")
                cur.close()
        db.create_all()

    def ok(data, status=200): return jsonify(data), status
    def not_found(): return ok({"error":"not_found"}, 404)

    @app.get("/api/health")
    def health(): return ok({"status":"ok"})

    @app.get("/api/projects")
    def list_projects():
        rows = Project.query.order_by(Project.updated_at.desc()).all()
        return ok([{"id": p.id, "title": p.title, "description": p.description} for p in rows])

    @app.post("/api/projects")
    def create_project():
        data = request.get_json() or {}
        p = Project(title=data.get("title") or "Neues Projekt", description=data.get("description",""))
        db.session.add(p); db.session.commit()
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
        db.session.delete(p); db.session.commit()
        return ok({"ok": True})

    @app.get("/api/projects/<int:pid>/chapters")
    def list_chapters(pid):
        rows = Chapter.query.filter_by(project_id=pid).order_by(Chapter.order_index.asc(), Chapter.id.asc()).all()
        return ok([{"id": c.id, "project_id": c.project_id, "title": c.title, "order_index": c.order_index, "content": c.content} for c in rows])

    @app.post("/api/projects/<int:pid>/chapters")
    def create_chapter(pid):
        data = request.get_json() or {}
        c = Chapter(project_id=pid, title=data.get("title") or "Neues Kapitel", order_index=int(data.get("order_index", 0)))
        db.session.add(c); db.session.commit()
        return ok({"id": c.id, "project_id": c.project_id, "title": c.title, "order_index": c.order_index, "content": c.content}, 201)

    @app.get("/api/chapters/<int:cid>")
    def get_chapter(cid):
        c = Chapter.query.get(cid)
        if not c: return not_found()
        return ok({"id": c.id, "project_id": c.project_id, "title": c.title, "order_index": c.order_index, "content": c.content})

    @app.put("/api/chapters/<int:cid>")
    def update_chapter(cid):
        c = Chapter.query.get(cid)
        if not c: return not_found()
        data = request.get_json() or {}
        c.title = data.get("title", c.title)
        c.order_index = int(data.get("order_index", c.order_index))
        c.content = data.get("content", c.content)
        db.session.commit()
        return ok({"id": c.id, "project_id": c.project_id, "title": c.title, "order_index": c.order_index, "content": c.content})

    @app.delete("/api/chapters/<int:cid>")
    def delete_chapter(cid):
        c = Chapter.query.get(cid)
        if not c: return not_found()
        db.session.delete(c); db.session.commit()
        return ok({"ok": True})

    @app.get("/api/chapters/<int:cid>/scenes")
    def list_scenes(cid):
        rows = Scene.query.filter_by(chapter_id=cid).order_by(Scene.order_index.asc(), Scene.id.asc()).all()
        return ok([{"id": s.id, "chapter_id": s.chapter_id, "title": s.title, "order_index": s.order_index, "content": s.content} for s in rows])

    @app.post("/api/chapters/<int:cid>/scenes")
    def create_scene(cid):
        data = request.get_json() or {}
        s = Scene(chapter_id=cid, title=data.get("title") or "Neue Szene", order_index=int(data.get("order_index", 0)), content=data.get("content",""))
        db.session.add(s); db.session.commit()
        return ok({"id": s.id, "chapter_id": s.chapter_id, "title": s.title, "order_index": s.order_index, "content": s.content}, 201)

    @app.get("/api/scenes/<int:sid>")
    def get_scene(sid):
        s = Scene.query.get(sid)
        if not s: return not_found()
        return ok({"id": s.id, "chapter_id": s.chapter_id, "title": s.title, "order_index": s.order_index, "content": s.content})

    @app.put("/api/scenes/<int:sid>")
    def update_scene(sid):
        s = Scene.query.get(sid)
        if not s: return not_found()
        data = request.get_json() or {}
        s.title = data.get("title", s.title)
        s.order_index = int(data.get("order_index", s.order_index))
        s.content = data.get("content", s.content)
        db.session.commit()
        return ok({"id": s.id, "chapter_id": s.chapter_id, "title": s.title, "order_index": s.order_index, "content": s.content})

    @app.delete("/api/scenes/<int:sid>")
    def delete_scene(sid):
        s = Scene.query.get(sid)
        if not s: return not_found()
        db.session.delete(s); db.session.commit()
        return ok({"ok": True})

    @app.get("/api/projects/<int:pid>/characters")
    def list_characters(pid):
        rows = Character.query.filter_by(project_id=pid).order_by(Character.id.asc()).all()
        return ok([{"id": c.id, "project_id": c.project_id, "name": c.name, "summary": c.summary, "avatar_url": c.avatar_url} for c in rows])

    @app.post("/api/projects/<int:pid>/characters")
    def create_character(pid):
        data = request.get_json() or {}
        c = Character(project_id=pid, name=data.get("name") or "Neue Figur", summary=data.get("summary",""), avatar_url=data.get("avatar_url",""))
        db.session.add(c); db.session.commit()
        return ok({"id": c.id, "project_id": c.project_id, "name": c.name, "summary": c.summary, "avatar_url": c.avatar_url}, 201)

    @app.get("/api/characters/<int:cid>")
    def get_character(cid):
        c = Character.query.get(cid)
        if not c: return not_found()
        return ok({"id": c.id, "project_id": c.project_id, "name": c.name, "summary": c.summary, "avatar_url": c.avatar_url})

    @app.put("/api/characters/<int:cid>")
    def update_character(cid):
        c = Character.query.get(cid)
        if not c: return not_found()
        data = request.get_json() or {}
        c.name = data.get("name", c.name)
        c.summary = data.get("summary", c.summary)
        c.avatar_url = data.get("avatar_url", c.avatar_url)
        db.session.commit()
        return ok({"id": c.id, "project_id": c.project_id, "name": c.name, "summary": c.summary, "avatar_url": c.avatar_url})

    @app.delete("/api/characters/<int:cid>")
    def delete_character(cid):
        c = Character.query.get(cid)
        if not c: return not_found()
        db.session.delete(c); db.session.commit()
        return ok({"ok": True})

    @app.get("/api/projects/<int:pid>/world")
    def list_world(pid):
        rows = WorldNode.query.filter_by(project_id=pid).order_by(WorldNode.id.asc()).all()
        return ok([{"id": w.id, "project_id": w.project_id, "title": w.title, "kind": w.kind, "summary": w.summary, "icon": w.icon} for w in rows])

    @app.post("/api/projects/<int:pid>/world")
    def create_world(pid):
        data = request.get_json() or {}
        wnode = WorldNode(project_id=pid, title=data.get("title") or "Neues Element", kind=data.get("kind","Ort"), summary=data.get("summary",""), icon=data.get("icon","🏰"))
        db.session.add(wnode); db.session.commit()
        return ok({"id": wnode.id, "project_id": wnode.project_id, "title": wnode.title, "kind": wnode.kind, "summary": wnode.summary, "icon": wnode.icon}, 201)

    @app.put("/api/world/<int:w_id>")
    def update_world(w_id):
        wnode = WorldNode.query.get(w_id)
        if not wnode: return not_found()
        data = request.get_json() or {}
        wnode.title = data.get("title", wnode.title)
        wnode.kind = data.get("kind", wnode.kind)
        wnode.summary = data.get("summary", wnode.summary)
        wnode.icon = data.get("icon", wnode.icon)
        db.session.commit()
        return ok({"id": wnode.id, "project_id": wnode.project_id, "title": wnode.title, "kind": wnode.kind, "summary": wnode.summary, "icon": wnode.icon})

    @app.delete("/api/world/<int:w_id>")
    def delete_world(w_id):
        wnode = WorldNode.query.get(w_id)
        if not wnode: return not_found()
        db.session.delete(wnode); db.session.commit()
        return ok({"ok": True})

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)

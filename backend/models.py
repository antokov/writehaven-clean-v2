# backend/models.py
from sqlalchemy.sql import func

try:
    # Paket-Start (z.B. gunicorn) -> backend.extensions
    from backend.extensions import db
except Exception:
    # Direktstart (python app.py) -> lokale extensions
    from extensions import db


class Project(db.Model):
    __tablename__ = "project"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, default="Neues Projekt")
    description = db.Column(db.Text, default="")
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now()
    )

    chapters = db.relationship(
        "Chapter", cascade="all, delete-orphan", backref="project", lazy="selectin"
    )
    characters = db.relationship(
        "Character", cascade="all, delete-orphan", backref="project", lazy="selectin"
    )
    worldnodes = db.relationship(
        "WorldNode", cascade="all, delete-orphan", backref="project", lazy="selectin"
    )


class Chapter(db.Model):
    __tablename__ = "chapter"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(
        db.Integer, db.ForeignKey("project.id"), nullable=False, index=True
    )
    title = db.Column(db.String(200), nullable=False, default="Neues Kapitel")
    order_index = db.Column(db.Integer, nullable=False, default=0)
    content = db.Column(db.Text, default="")
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now()
    )

    scenes = db.relationship(
        "Scene", cascade="all, delete-orphan", backref="chapter", lazy="selectin"
    )


class Scene(db.Model):
    __tablename__ = "scene"

    id = db.Column(db.Integer, primary_key=True)
    chapter_id = db.Column(
        db.Integer, db.ForeignKey("chapter.id"), nullable=False, index=True
    )
    title = db.Column(db.String(200), nullable=False, default="Neue Szene")
    content = db.Column(db.Text, default="")
    order_index = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now()
    )


class Character(db.Model):
    __tablename__ = "character"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(
        db.Integer, db.ForeignKey("project.id"), nullable=False, index=True
    )

    # Immer flach gespeichert (werden oft angezeigt)
    name = db.Column(db.String(200), nullable=False)
    summary = db.Column(db.Text, default="")
    avatar_url = db.Column(db.String(500), default="")

    # Neu: alle restlichen Felder als JSON (Tabs: Grunddaten, Äußeres, …)
    # Wir halten ein Textfeld, damit es auf SQLite/Postgres überall funktioniert.
    profile_json = db.Column(db.Text, default="{}")


class WorldNode(db.Model):
    __tablename__ = "worldnode"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(
        db.Integer, db.ForeignKey("project.id"), nullable=False, index=True
    )
    title = db.Column(db.String(200), nullable=False)
    kind = db.Column(db.String(100), nullable=False, default="Ort")
    summary = db.Column(db.Text, default="")
    icon = db.Column(db.String(50), default="🏰")
    relations_json = db.Column(db.Text, default="{}")

# backend/models.py
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import text as sqltext

try:
    # Paket-Start (z.B. gunicorn) -> backend.extensions
    from backend.extensions import db
except Exception:
    # Direktstart (python app.py) -> lokale extensions
    from extensions import db


class Project(db.Model):
    __tablename__ = "project"
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False, default="Neues Projekt")
    description = db.Column(db.Text, default="")
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now()
    )

    # Projekteinstellungen
    author = db.Column(db.String(200), default="")
    genre = db.Column(db.String(100), default="")
    language = db.Column(db.String(10), default="en")  # English as default for international users
    target_audience = db.Column(db.String(100), default="")
    estimated_word_count = db.Column(db.Integer, default=0)
    cover_image_url = db.Column(db.String(500), default="")
    share_with_community = db.Column(
        db.Boolean,
        nullable=False,
        server_default=sqltext('false')  # serverseitiger Default für Postgres
    )

    # Relationships
    user = db.relationship("User", backref="projects")
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
    __table_args__ = {'extend_existing': True}

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
    __table_args__ = {'extend_existing': True}

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
    __table_args__ = {'extend_existing': True}

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
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(
        db.Integer, db.ForeignKey("project.id"), nullable=False, index=True
    )
    title = db.Column(db.String(200), nullable=False)
    kind = db.Column(db.String(100), nullable=False, default="Ort")
    summary = db.Column(db.Text, default="")
    icon = db.Column(db.String(50), default="🏰")
    relations_json = db.Column(db.Text, default="{}")


class User(db.Model):
    __tablename__ = "user"  # reserviertes Wort, daher in Migration immer quoten
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(200))
    language = db.Column(db.String(10), default="en")  # English as default for international users
    created_at = db.Column(db.DateTime, server_default=func.now())

    def set_password(self, password):
        """Hash und speichere Passwort"""
        # pbkdf2:sha256 funktioniert mit Python 3.8+, scrypt braucht 3.9+
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        """Prüfe Passwort gegen Hash"""
        return check_password_hash(self.password_hash, password)

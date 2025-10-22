# backend/models.py
from sqlalchemy.sql import func
from sqlalchemy import text as sqltext

# Optional Flask-Security imports
try:
    from flask_security import UserMixin, RoleMixin
    FLASK_SECURITY_AVAILABLE = True
except ImportError:
    # Fallback: Simple base classes
    class UserMixin:
        """Fallback UserMixin when Flask-Security is not available"""
        pass

    class RoleMixin:
        """Fallback RoleMixin when Flask-Security is not available"""
        pass

    FLASK_SECURITY_AVAILABLE = False

try:
    # Paket-Start (z.B. gunicorn) -> backend.extensions
    from backend.extensions import db
except Exception:
    # Direktstart (python app.py) -> lokale extensions
    from extensions import db


# Flask-Security-Too: Roles-Users Many-to-Many
roles_users = db.Table('roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)


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


class Role(db.Model, RoleMixin):
    """Flask-Security-Too Role Model"""
    __tablename__ = "role"
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255))


class User(db.Model, UserMixin):
    """Flask-Security-Too User Model"""
    __tablename__ = "user"
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    username = db.Column(db.String(255))  # Optional, falls gewünscht
    password = db.Column(db.String(255), nullable=False)  # Flask-Security nutzt 'password', nicht 'password_hash'
    password_hash = db.Column(db.String(255))  # Backward compatibility mit alter DB-Struktur
    name = db.Column(db.String(200))
    language = db.Column(db.String(10), default="en")

    # Flask-Security-Too required fields
    active = db.Column(db.Boolean(), default=True)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)  # Required for Flask-Security-Too
    confirmed_at = db.Column(db.DateTime())  # Email confirmation

    # Timestamps
    created_at = db.Column(db.DateTime, server_default=func.now())
    last_login_at = db.Column(db.DateTime())
    current_login_at = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(100))
    current_login_ip = db.Column(db.String(100))
    login_count = db.Column(db.Integer, default=0)

    # Relationships
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))

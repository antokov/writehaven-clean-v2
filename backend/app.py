# backend/app.py
import os
import json
import jwt as pyjwt
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory, g
from flask_cors import CORS
from flask_security import Security, SQLAlchemyUserDatastore, hash_password
from flask_mailman import Mail
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError, OperationalError

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

try:
    from backend.extensions import db
    from backend.models import Project, Chapter, Scene, Character, WorldNode, User, Role
    from backend.word_parser import parse_word_document
    from backend.security_config import get_security_config
    from backend.console_mail import ConsoleMailBackend
except ImportError:
    from extensions import db
    from models import Project, Chapter, Scene, Character, WorldNode, User, Role
    from word_parser import parse_word_document
    from security_config import get_security_config
    from console_mail import ConsoleMailBackend


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

    # Load Flask-Security-Too Configuration
    security_config = get_security_config()
    app.config.update(security_config)

    # SQLAlchemy
    app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True,
        "pool_recycle": 1800,
        "isolation_level": "AUTOCOMMIT"  # Verhindert hängende Transaktionen
    }
    
    # Root route - zeige API Info wenn kein Frontend vorhanden
    @app.route('/')
    def index():
        if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
            return send_from_directory('static', 'index.html')
        return {"message": "WriteHaven API", "version": "1.0", "health": "/api/health"}, 200

    # CORS - Allow writehaven.io domains
    allowed_origins = os.getenv("ALLOWED_ORIGINS", "")
    if allowed_origins:
        allowed = [o.strip() for o in allowed_origins.split(",")]
    else:
        # Default: Allow Amplify and writehaven.io domains
        allowed = [
            "https://master.d1g3w3mv6woysa.amplifyapp.com",
            "https://www.writehaven.io",
            "https://writehaven.io"
        ]

    CORS(app,
         resources={r"/api/*": {"origins": allowed}},
         supports_credentials=False,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])

    # DB init
    db.init_app(app)

    # Flask-Security-Too Setup
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    security = Security(app, user_datastore)

    # Email Backend Setup
    email_backend = os.getenv("EMAIL_BACKEND", "console")
    if email_backend == "console":
        # Console backend für lokale Entwicklung
        app.extensions['mail'] = ConsoleMailBackend(app)
    else:
        # SMTP für Production
        mail = Mail(app)

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

        # Tables anlegen (checkfirst) - Non-blocking
        # Nur beim Start versuchen, nicht crashen wenn DB nicht erreichbar
        try:
            db.Model.metadata.create_all(bind=db.engine, checkfirst=True)
            print("Database schema created/verified successfully")

            # Auto-Migration: Update existing schema if needed
            try:
                try:
                    from backend.auto_migrate import auto_migrate
                except ImportError:
                    from auto_migrate import auto_migrate
                auto_migrate()
            except Exception as e:
                print(f"Auto-migration skipped: {e}")
                import traceback
                traceback.print_exc()

            # Verifiziere Datenbankverbindung
            db.session.execute(text("SELECT 1"))
            db.session.commit()
            print(f"Database connected successfully: {app.config['SQLALCHEMY_DATABASE_URI'].split('@')[0]}@...")
        except Exception as e:
            print(f"WARNING: Database connection failed during startup: {e}")
            print("Server will start anyway. Database errors will occur on API calls.")
            # Rollback um die Session zu cleanen
            try:
                db.session.rollback()
            except:
                pass

    # ---------- SPA fallback (für Deep Links) - nur wenn Frontend existiert ----------
    @app.before_request
    def spa_fallback():
        # Nur für GET-Requests
        if request.method != "GET":
            return None
        # API-Routes und Root überspringen
        p = request.path or "/"
        if p.startswith("/api") or p == "/":
            return None
        # Nur fallback wenn static folder existiert
        if not app.static_folder or not os.path.exists(os.path.join(app.static_folder, 'index.html')):
            return None
        # Prüfe ob die Datei existiert
        rel = p.lstrip("/")
        if app.static_folder:
            full = os.path.join(app.static_folder, rel)
            if os.path.isfile(full):
                return None
        # Fallback zu index.html
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

    # ---------- JWT Helper (Custom JWT statt Flask-Security Token) ----------
    def generate_jwt_token(user_id):
        """Generiere JWT Token"""
        payload = {
            "user_id": user_id,
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        return pyjwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")

    def token_auth_required(fn):
        """Decorator für JWT-basierte Authentifizierung"""
        @wraps(fn)
        def decorated_view(*args, **kwargs):
            token = None
            auth_header = request.headers.get("Authorization")

            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

            if not token:
                return ok({"error": "Token fehlt"}, 401)

            try:
                payload = pyjwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
                user_id = payload["user_id"]
                user = User.query.get(user_id)

                if not user:
                    return ok({"error": "User nicht gefunden"}, 401)

                if not user.active:
                    return ok({"error": "Account deaktiviert"}, 401)

                # Setze current_user
                g.current_user = user
                return fn(*args, **kwargs)

            except pyjwt.ExpiredSignatureError:
                return ok({"error": "Token abgelaufen"}, 401)
            except pyjwt.InvalidTokenError:
                return ok({"error": "Ungültiger Token"}, 401)
            except Exception as e:
                print(f"Token error: {e}")
                return ok({"error": "Token ungültig"}, 401)

        return decorated_view

    # Helper um current_user zu bekommen
    def get_current_user():
        return getattr(g, 'current_user', None)

    # ---------- Health ----------
    @app.get("/api/health")
    def health():
        try:
            db.session.execute(text("SELECT 1"))
            db_ok = "ok"
        except Exception as e:
            db_ok = f"error: {e.__class__.__name__}: {e}"
        return jsonify({"status": "ok", "db": db_ok}), 200

    # ---------- Auth mit Flask-Security-Too ----------
    @app.post("/api/auth/register")
    def register():
        """Registriere neuen User mit Flask-Security-Too"""
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        name = data.get("name", "").strip()
        language = data.get("language", "en")

        if not email or not password:
            return ok({"error": "Email und Passwort erforderlich"}, 400)

        if len(password) < 6:
            return ok({"error": "Passwort muss mindestens 6 Zeichen lang sein"}, 400)

        # Prüfe ob User existiert
        if user_datastore.find_user(email=email):
            return ok({"error": "Email bereits registriert"}, 400)

        try:
            # Generiere fs_uniquifier für Flask-Security-Too
            import uuid
            fs_uniquifier = uuid.uuid4().hex

            # Hash das Passwort
            hashed_password = hash_password(password)

            # Erstelle User mit Flask-Security-Too
            user = user_datastore.create_user(
                email=email,
                password=hashed_password,
                name=name or email.split("@")[0],
                language=language,
                active=True,
                fs_uniquifier=fs_uniquifier,
                confirmed_at=None if app.config.get("SECURITY_CONFIRMABLE") else datetime.utcnow()
            )

            # Backward compatibility: Setze auch password_hash für alte Spalte
            user.password_hash = hashed_password
            db.session.commit()

            # Sende Confirmation Email wenn aktiviert
            if app.config.get("SECURITY_CONFIRMABLE"):
                from flask_security import send_mail
                from flask_security.utils import config_value
                send_mail(
                    config_value("EMAIL_SUBJECT_REGISTER"),
                    user.email,
                    "welcome",
                    user=user
                )
                return ok({
                    "message": "Registrierung erfolgreich. Bitte bestätige deine Email-Adresse.",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "name": user.name,
                        "confirmed": False
                    }
                }, 201)

            # Token generieren (nur wenn keine Email-Confirmation nötig)
            token = generate_jwt_token(user.id)
            return ok({
                "token": token,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "language": user.language or "en",
                    "confirmed": True,
                    "created_at": user.created_at.isoformat() if user.created_at else None
                }
            }, 201)

        except IntegrityError as e:
            db.session.rollback()
            print(f"IntegrityError bei Registrierung: {e}")
            return ok({"error": "Registrierung fehlgeschlagen"}, 400)
        except Exception as e:
            db.session.rollback()
            print(f"Fehler bei Registrierung: {e}")
            import traceback
            traceback.print_exc()
            return ok({"error": f"Registrierung fehlgeschlagen: {str(e)}"}, 400)

    @app.post("/api/auth/login")
    def login():
        """Login User"""
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return ok({"error": "Email und Passwort erforderlich"}, 400)

        # Find user
        user = user_datastore.find_user(email=email)

        if not user:
            return ok({"error": "Ungültige Anmeldedaten"}, 401)

        # Prüfe Passwort - unterstütze alte pbkdf2 UND neue bcrypt Hashes
        password_valid = False

        # Versuche zuerst Flask-Security-Too's verify_and_update_password
        try:
            password_valid = user.verify_and_update_password(password)
        except:
            pass

        # Fallback: Alte Werkzeug pbkdf2 Hashes (von vorher)
        if not password_valid:
            from werkzeug.security import check_password_hash
            # Prüfe ob password_hash Spalte noch existiert (Legacy)
            old_hash = getattr(user, 'password_hash', None) or user.password
            if old_hash and check_password_hash(old_hash, password):
                password_valid = True
                # Update zu neuem bcrypt Hash
                user.password = hash_password(password)
                db.session.commit()

        if not password_valid:
            return ok({"error": "Ungültige Anmeldedaten"}, 401)

        # Prüfe ob User aktiv (nur wenn Feld existiert)
        if hasattr(user, 'active') and user.active == False:
            return ok({"error": "Account deaktiviert"}, 401)

        # Update Login Tracking (only if fields exist)
        if hasattr(user, 'current_login_at'):
            user.current_login_at = datetime.utcnow()
        if hasattr(user, 'current_login_ip'):
            user.current_login_ip = request.remote_addr
        if hasattr(user, 'login_count'):
            user.login_count = (user.login_count or 0) + 1
        db.session.commit()

        # Token generieren (Custom JWT)
        token = generate_jwt_token(user.id)
        return ok({
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "language": user.language or "en",
                "confirmed": bool(user.confirmed_at),
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
        })

    @app.get("/api/auth/me")
    @token_auth_required
    def get_user_info():
        """Hole aktuellen User (mit Flask-Security-Too)"""
        user = get_current_user()
        return ok({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "language": user.language or "en",
            "confirmed": bool(user.confirmed_at),
            "created_at": user.created_at.isoformat() if user.created_at else None
        })

    @app.put("/api/auth/update-language")
    @token_auth_required
    def update_user_language():
        """Update user language preference"""
        user = get_current_user()
        data = request.get_json() or {}
        language = data.get("language", "en")

        # Validiere Sprache
        valid_languages = ['de', 'en', 'es', 'fr', 'it', 'pt']
        if language not in valid_languages:
            return bad_request("Ungültige Sprache")

        user.language = language
        db.session.commit()

        return ok({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "language": user.language
        })

    @app.post("/api/auth/forgot-password")
    def forgot_password():
        """Passwort-Reset anfragen"""
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()

        if not email:
            return ok({"error": "Email erforderlich"}, 400)

        user = user_datastore.find_user(email=email)

        # Immer success zurückgeben (Security: kein User-Enumeration)
        if user:
            from flask_security import send_mail
            from flask_security.utils import config_value
            send_mail(
                config_value("EMAIL_SUBJECT_PASSWORD_RESET"),
                user.email,
                "reset_instructions",
                user=user
            )

        return ok({"message": "Falls die Email existiert, wurde ein Reset-Link gesendet."})

    @app.post("/api/auth/reset-password")
    def reset_password():
        """Passwort mit Token zurücksetzen"""
        data = request.get_json() or {}
        token = data.get("token", "")
        password = data.get("password", "")

        if not token or not password:
            return ok({"error": "Token und Passwort erforderlich"}, 400)

        if len(password) < 6:
            return ok({"error": "Passwort muss mindestens 6 Zeichen lang sein"}, 400)

        from flask_security.recoverable import reset_password_token_status
        expired, invalid, user = reset_password_token_status(token)

        if expired:
            return ok({"error": "Reset-Token abgelaufen"}, 400)
        if invalid or not user:
            return ok({"error": "Ungültiger Reset-Token"}, 400)

        # Passwort ändern
        user.password = hash_password(password)
        db.session.commit()

        return ok({"message": "Passwort erfolgreich zurückgesetzt"})

    @app.post("/api/auth/confirm-email")
    def confirm_email():
        """Email mit Token bestätigen"""
        data = request.get_json() or {}
        token = data.get("token", "")

        if not token:
            return ok({"error": "Token erforderlich"}, 400)

        from flask_security.confirmable import confirm_email_token_status
        expired, invalid, user = confirm_email_token_status(token)

        if expired:
            return ok({"error": "Bestätigungs-Token abgelaufen"}, 400)
        if invalid or not user:
            return ok({"error": "Ungültiger Bestätigungs-Token"}, 400)

        # Email bestätigen
        if hasattr(user, 'confirmed_at'):
            user.confirmed_at = datetime.utcnow()
        db.session.commit()

        # Token generieren
        auth_token = generate_jwt_token(user.id)
        return ok({
            "message": "Email erfolgreich bestätigt",
            "token": auth_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "language": user.language or "en",
                "confirmed": True
            }
        })

    # ---------- Feedback ----------
    @app.post("/api/feedback")
    def submit_feedback():
        """Submit feedback via email"""
        data = request.get_json() or {}
        feedback_type = data.get("type", "other")
        message = data.get("message", "").strip()
        user_email = data.get("email", "").strip()

        if not message:
            return ok({"error": "Message is required"}, 400)

        # Send email via SMTP (AWS SES SMTP)
        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart

            # SMTP Configuration
            smtp_host = os.getenv("SMTP_HOST", "email-smtp.eu-central-1.amazonaws.com")
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            smtp_user = os.getenv("SMTP_USER", "AKIASGVTPY27UUGKD6EK")
            smtp_password = os.getenv("SMTP_PASSWORD", "BJoxRbE+T1wli7D2MIP1xxqKlBLt6LWbImX7DzcVOXy6")
            sender_email = os.getenv("FEEDBACK_SENDER_EMAIL", "noreply@writehaven.io")
            receiver_email = os.getenv("FEEDBACK_RECEIVER_EMAIL", "info@writehaven.io")

            # Email subject based on type
            type_labels = {
                "bug": "🐛 Bug Report",
                "improvement": "💡 Improvement Suggestion",
                "feature": "✨ Feature Request",
                "other": "💬 Feedback"
            }
            subject = f"WriteHaven Feedback: {type_labels.get(feedback_type, 'Feedback')}"

            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = sender_email
            msg['To'] = receiver_email

            # Plain text version
            text_body = f"""
WriteHaven Feedback

Type: {feedback_type}
From: {user_email or 'Anonymous'}

Message:
{message}

---
Sent from WriteHaven Feedback Form
"""

            # HTML version
            html_body = f"""
<html>
<head></head>
<body>
  <h2>WriteHaven Feedback</h2>
  <p><strong>Type:</strong> {feedback_type}</p>
  <p><strong>From:</strong> {user_email or 'Anonymous'}</p>
  <hr>
  <h3>Message:</h3>
  <p style="white-space: pre-wrap;">{message}</p>
  <hr>
  <p style="color: #666; font-size: 12px;">Sent from WriteHaven Feedback Form</p>
</body>
</html>
"""

            # Attach parts
            part1 = MIMEText(text_body, 'plain', 'utf-8')
            part2 = MIMEText(html_body, 'html', 'utf-8')
            msg.attach(part1)
            msg.attach(part2)

            # Send email
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.send_message(msg)

            print(f"Feedback email sent successfully to {receiver_email}")
            return ok({"message": "Feedback sent successfully"}, 200)

        except Exception as e:
            print(f"Error sending feedback email: {e}")
            import traceback
            traceback.print_exc()
            return ok({"error": "Failed to send feedback. Please try again later."}, 500)

    # ---------- Projects ----------
    @app.get("/api/projects")
    @token_auth_required
    def list_projects():
        rows = (Project.query.filter_by(user_id=get_current_user().id)
                .order_by(Project.updated_at.desc()).all()
                if hasattr(Project, "updated_at")
                else Project.query.filter_by(user_id=get_current_user().id)
                .order_by(Project.id.desc()).all())
        return ok([{"id": p.id, "title": p.title, "description": p.description} for p in rows])

    @app.post("/api/projects")
    @token_auth_required
    def create_project():
        # Check if multipart/form-data (file upload)
        if request.content_type and 'multipart/form-data' in request.content_type:
            title = request.form.get("title", "Neues Projekt").strip()
            description = request.form.get("description", "")
            file = request.files.get("file")

            # Erstelle Projekt
            p = Project(
                user_id=get_current_user().id,
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
                user_id=get_current_user().id,
                title=data.get("title") or "Neues Projekt",
                description=data.get("description", "")
            )
            db.session.add(p)
            db.session.commit()
            return ok({"id": p.id, "title": p.title, "description": p.description}, 201)

    @app.get("/api/projects/<int:pid>")
    @token_auth_required
    def get_project(pid):
        p = Project.query.filter_by(id=pid, user_id=get_current_user().id).first()
        if not p: return not_found()
        return ok({"id": p.id, "title": p.title, "description": p.description})

    @app.put("/api/projects/<int:pid>")
    @token_auth_required
    def update_project(pid):
        p = Project.query.filter_by(id=pid, user_id=get_current_user().id).first()
        if not p: return not_found()
        data = request.get_json() or {}
        p.title = data.get("title", p.title)
        p.description = data.get("description", p.description)
        db.session.commit()
        return ok({"id": p.id, "title": p.title, "description": p.description})

    @app.delete("/api/projects/<int:pid>")
    @token_auth_required
    def delete_project(pid):
        p = Project.query.filter_by(id=pid, user_id=get_current_user().id).first()
        if not p: return not_found()
        db.session.delete(p)
        db.session.commit()
        return ok({"ok": True})

    # ---------- Chapters ----------
    @app.get("/api/projects/<int:pid>/chapters")
    @token_auth_required
    def list_chapters(pid):
        if not verify_project_ownership(pid, get_current_user().id):
            return forbidden()
        rows = (Chapter.query.filter_by(project_id=pid)
                .order_by(Chapter.order_index.asc(), Chapter.id.asc())
                .all())
        return ok([{
            "id": c.id, "project_id": c.project_id, "title": c.title,
            "order_index": c.order_index, "content": getattr(c, "content", None)
        } for c in rows])

    @app.post("/api/projects/<int:pid>/chapters")
    @token_auth_required
    def create_chapter(pid):
        if not verify_project_ownership(pid, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        c = Chapter(project_id=pid,
                    title=(data.get("title") or "Neues Kapitel").strip(),
                    order_index=int(data.get("order_index", 0)))
        db.session.add(c); db.session.commit()
        return ok({"id": c.id, "title": c.title, "order_index": c.order_index, "project_id": c.project_id}, 201)

    @app.get("/api/chapters/<int:cid>")
    @token_auth_required
    def get_chapter(cid):
        c = verify_chapter_ownership(cid, get_current_user().id)
        if not c: return not_found()
        return ok({"id": c.id, "project_id": c.project_id, "title": c.title,
                   "order_index": c.order_index, "content": getattr(c, "content", None)})

    @app.put("/api/chapters/<int:cid>")
    @token_auth_required
    def update_chapter(cid):
        c = verify_chapter_ownership(cid, get_current_user().id)
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
    @token_auth_required
    def delete_chapter(cid):
        c = verify_chapter_ownership(cid, get_current_user().id)
        if not c: return not_found()
        db.session.delete(c); db.session.commit()
        return ok({"ok": True})

    # ---------- Scenes ----------
    @app.get("/api/chapters/<int:cid>/scenes")
    @token_auth_required
    def list_scenes(cid):
        if not verify_chapter_ownership(cid, get_current_user().id):
            return forbidden()
        rows = (Scene.query.filter_by(chapter_id=cid)
                .order_by(Scene.order_index.asc(), Scene.id.asc())
                .all())
        return ok([{
            "id": s.id, "chapter_id": s.chapter_id, "title": s.title,
            "order_index": s.order_index, "content": s.content
        } for s in rows])

    @app.post("/api/chapters/<int:cid>/scenes")
    @token_auth_required
    def create_scene(cid):
        if not verify_chapter_ownership(cid, get_current_user().id): return forbidden()
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
    @token_auth_required
    def get_scene(sid):
        s = Scene.query.get(sid)
        if s and not verify_chapter_ownership(s.chapter_id, get_current_user().id):
            return forbidden()
        if not s: return not_found()
        return ok({"id": s.id, "chapter_id": s.chapter_id, "title": s.title,
                   "order_index": s.order_index, "content": s.content})

    @app.put("/api/scenes/<int:sid>")
    @token_auth_required
    def update_scene(sid):
        s = Scene.query.get(sid)
        if not s: return not_found()
        if not verify_chapter_ownership(s.chapter_id, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        if (t := data.get("title")) is not None:   s.title = t.strip()
        if (c := data.get("content")) is not None: s.content = c
        db.session.commit()
        return ok({"id": s.id, "title": s.title, "order_index": s.order_index,
                   "chapter_id": s.chapter_id, "content": s.content})

    @app.delete("/api/scenes/<int:sid>")
    @token_auth_required
    def delete_scene(sid):
        s = Scene.query.get(sid)
        if not s: return not_found()
        if not verify_chapter_ownership(s.chapter_id, get_current_user().id):
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
    @token_auth_required
    def list_characters(pid):
        if not verify_project_ownership(pid, get_current_user().id):
            return forbidden()
        rows = Character.query.filter_by(project_id=pid).order_by(Character.id.asc()).all()
        return ok([_char_to_dict(c) for c in rows])

    @app.post("/api/projects/<int:pid>/characters")
    @token_auth_required
    def create_character(pid):
        if not verify_project_ownership(pid, get_current_user().id):
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
    @token_auth_required
    def get_character(cid):
        c = verify_character_ownership(cid, get_current_user().id)
        if not c: return not_found()
        return ok(_char_to_dict(c))

    @app.put("/api/characters/<int:cid>")
    @app.patch("/api/characters/<int:cid>")
    @token_auth_required
    def update_character(cid):
        c = verify_character_ownership(cid, get_current_user().id)
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
            c.profile_json = _dumps(prof)

        db.session.commit()
        return ok(_char_to_dict(c))

    @app.delete("/api/characters/<int:cid>")
    @token_auth_required
    def delete_character(cid):
        c = verify_character_ownership(cid, get_current_user().id)
        if not c: return not_found()
        db.session.delete(c); db.session.commit()
        return ok({"ok": True})

    # ---------- World ----------
    @app.get("/api/projects/<int:pid>/world")
    @token_auth_required
    def list_world(pid):
        if not verify_project_ownership(pid, get_current_user().id):
            return forbidden()
        rows = WorldNode.query.filter_by(project_id=pid).order_by(WorldNode.id.asc()).all()
        return ok([{
            "id": w.id, "project_id": w.project_id, "title": w.title, "kind": w.kind,
            "summary": w.summary, "icon": w.icon
        } for w in rows])

    @app.post("/api/projects/<int:pid>/world")
    @token_auth_required
    def create_world(pid):
        if not verify_project_ownership(pid, get_current_user().id):
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
    @token_auth_required
    def get_world(w_id):
        w = verify_world_ownership(w_id, get_current_user().id)
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
    @token_auth_required
    def update_world(w_id):
        w = verify_world_ownership(w_id, get_current_user().id)
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
    @token_auth_required
    def delete_world(w_id):
        w = verify_world_ownership(w_id, get_current_user().id)
        if not w: return not_found()
        db.session.delete(w); db.session.commit()
        return ok({"ok": True})

    # ---------- Project Settings ----------
    @app.get("/api/projects/<int:pid>/settings")
    @token_auth_required
    def get_project_settings(pid):
        p = verify_project_ownership(pid, get_current_user().id)
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
    @token_auth_required
    def update_project_settings(pid):
        p = verify_project_ownership(pid, get_current_user().id)
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
    @token_auth_required
    def upload_project_cover(pid):
        p = verify_project_ownership(pid, get_current_user().id)
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

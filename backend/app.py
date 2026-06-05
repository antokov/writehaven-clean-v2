# backend/app.py
import os
import re
import json
import jwt as pyjwt
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory, g
from flask_cors import CORS
from flask_security import Security, SQLAlchemyUserDatastore, hash_password
from flask_mail import Mail
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, ProgrammingError, OperationalError

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

try:
    from backend.extensions import db
    from backend.models import (Project, Chapter, Scene, Character, WorldNode, User, Role,
                                  SceneNote, SceneTask, ChapterNote, ChapterTask, CharacterNote, CharacterTask,
                                  WorldNodeNote, WorldNodeTask)
    from backend.word_parser import parse_word_document
    from backend.security_config import get_security_config
    from backend.console_mail import ConsoleMailBackend
    from backend.auto_migrate import auto_migrate
except ImportError:
    from extensions import db
    from models import (Project, Chapter, Scene, Character, WorldNode, User, Role,
                        SceneNote, SceneTask, ChapterNote, ChapterTask, CharacterNote, CharacterTask,
                        WorldNodeNote, WorldNodeTask)
    from word_parser import parse_word_document
    from security_config import get_security_config
    from console_mail import ConsoleMailBackend
    from auto_migrate import auto_migrate


# ---------- DB URI helpers ----------
def _sqlite_uri() -> str:
    path = os.getenv("SQLITE_PATH", "/tmp/app.db")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return "sqlite:///" + path.replace("\\", "/")


def get_database_uri() -> str:
    uri = os.getenv("DATABASE_URL")
    if uri:
        # Convert postgres:// to postgresql+psycopg://
        if uri.startswith("postgres://"):
            uri = uri.replace("postgres://", "postgresql+psycopg://", 1)
        # Convert postgresql:// to postgresql+psycopg://
        elif uri.startswith("postgresql://") and "+psycopg" not in uri:
            uri = uri.replace("postgresql://", "postgresql+psycopg://", 1)
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
        # Default: Allow writehaven.io domains
        allowed = [
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

    # Flask-Admin Setup
    from flask_admin import Admin
    from flask_admin.contrib.sqla import ModelView

    admin = Admin(app, name='WriteHaven Admin', template_mode='bootstrap4', url='/admin')

    # Add model views for all tables
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Role, db.session))
    admin.add_view(ModelView(Project, db.session))
    admin.add_view(ModelView(Chapter, db.session))
    admin.add_view(ModelView(Scene, db.session))
    admin.add_view(ModelView(Character, db.session))
    admin.add_view(ModelView(WorldNode, db.session))

    # Flask-Security-Too Setup
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    security = Security(app, user_datastore)

    # Custom confirmation link generator für Frontend
    from flask_security.confirmable import generate_confirmation_token

    def generate_confirmation_link(user):
        """Generiere Bestätigungslink für Frontend"""
        token = generate_confirmation_token(user)
        frontend_url = app.config.get("FRONTEND_URL", "http://localhost:5173")
        return f"{frontend_url}/confirm-email?token={token}"

    # Registriere Custom Link Generator
    app.jinja_env.globals['confirmation_link'] = lambda user: generate_confirmation_link(user)

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

            # Run auto_migrate to handle schema updates
            auto_migrate()

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
                    return ok({"error": "Account deactivated"}, 401)

                g.current_user = user

            except pyjwt.ExpiredSignatureError:
                return ok({"error": "Token expired"}, 401)
            except pyjwt.InvalidTokenError:
                return ok({"error": "Invalid token"}, 401)
            except Exception as e:
                print(f"Token error: {e}")
                return ok({"error": "Token ungültig"}, 401)

            return fn(*args, **kwargs)

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

    # ---------- Debug: Check scene table columns ----------
    @app.get("/api/debug/scene-columns")
    def debug_scene_columns():
        try:
            from sqlalchemy import inspect as sa_inspect
            inspector = sa_inspect(db.engine)
            columns = inspector.get_columns('scene')
            column_names = [col['name'] for col in columns]

            # Also try a raw query
            result = db.session.execute(text("SELECT * FROM scene LIMIT 1")).fetchone()
            actual_keys = list(result._mapping.keys()) if result else []

            return jsonify({
                "inspector_columns": column_names,
                "has_status_in_inspector": "status" in column_names,
                "actual_query_keys": actual_keys,
                "has_status_in_query": "status" in actual_keys,
                "scene_model_columns": [c.name for c in Scene.__table__.columns]
            }), 200
        except Exception as e:
            import traceback
            return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500

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
            return ok({"error": "Password must be at least 6 characters long"}, 400)

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
            # active=True, aber confirmed_at=None verhindert Login bis Email bestätigt
            user = user_datastore.create_user(
                email=email,
                password=hashed_password,
                name=name or email.split("@")[0],
                language=language,
                active=True,  # User ist aktiv, aber nicht bestätigt
                fs_uniquifier=fs_uniquifier,
                confirmed_at=None  # Wird gesetzt nach Email-Bestätigung
            )

            # Backward compatibility: Setze auch password_hash für alte Spalte
            user.password_hash = hashed_password
            db.session.commit()

            # Sende Confirmation Email wenn aktiviert
            if app.config.get("SECURITY_CONFIRMABLE"):
                from flask_security.confirmable import generate_confirmation_token
                from flask_mail import Message
                
                # Generiere Token
                token = generate_confirmation_token(user)
                
                # Erstelle Confirmation Link für Frontend
                frontend_url = app.config.get("FRONTEND_URL", "http://localhost:5173")
                confirmation_link = f"{frontend_url}/confirm-email?token={token}"
                
                # Erstelle Email-Nachricht
                # Erstelle Email-Nachricht mit Templates
                from flask import render_template
                
                msg = Message(
                    subject="WriteHaven - Please confirm your email",
                    sender=app.config.get("SECURITY_EMAIL_SENDER", "info@writehaven.io"),
                    recipients=[user.email]
                )
                
                # Render templates mit Variablen
                template_vars = {
                    'user_name': user.name or '',
                    'confirmation_link': confirmation_link
                }
                
                msg.html = render_template('email/confirm_email.html', **template_vars)
                msg.body = render_template('email/confirm_email.txt', **template_vars)
                
                # Sende Email
                try:
                    mail = app.extensions.get('mail')
                    if mail:
                        mail.send(msg)
                except Exception as e:
                    print(f"Fehler beim Email-Versand: {e}")
                
                # Return success response
                return ok({
                    "message": "Registration successful. Please confirm your email address.",
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
            return ok({"error": "Registration failed"}, 400)
        except Exception as e:
            db.session.rollback()
            print(f"Fehler bei Registrierung: {e}")
            import traceback
            traceback.print_exc()
            return ok({"error": f"Registration failed: {str(e)}"}, 400)


    @app.get("/api/auth/confirm/<token>")
    def confirm_email(token):
        """Bestätige Email-Adresse mit Token"""
        try:
            from flask_security.confirmable import confirm_email_token_status, confirm_user
            
            # Verify token and get user
            expired, invalid, user = confirm_email_token_status(token)
            
            if invalid or not user:
                return ok({"error": "Invalid confirmation token"}, 400)
            
            if expired:
                return ok({"error": "Confirmation token expired"}, 400)
            
            if user.confirmed_at:
                return ok({"message": "Email already confirmed"}, 200)
            
            # Confirm user
            confirm_user(user)
            db.session.commit()
            
            return ok({
                "message": "Email confirmed successfully! You can now log in.",
                "confirmed": True
            }, 200)
            
        except Exception as e:
            print(f"Fehler bei Email-Bestätigung: {e}")
            import traceback
            traceback.print_exc()
            return ok({"error": "Email confirmation failed"}, 400)

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
            # Check if old_hash is not empty string
            if old_hash and old_hash.strip():
                try:
                    if check_password_hash(old_hash, password):
                        password_valid = True
                        # Update zu neuem bcrypt Hash
                        user.password = hash_password(password)
                        db.session.commit()
                except ValueError:
                    # Invalid hash format - skip fallback
                    pass

        if not password_valid:
            return ok({"error": "Invalid credentials"}, 401)

        # Prüfe ob User aktiv (nur wenn Feld existiert)
        if hasattr(user, 'active') and user.active == False:
            return ok({"error": "Account deactivated"}, 401)


        # Prüfe ob Email bestätigt wurde (wenn Email-Confirmation aktiviert)
        if app.config.get("SECURITY_CONFIRMABLE") and app.config.get("SECURITY_LOGIN_WITHOUT_CONFIRMATION") == False:
            if hasattr(user, 'confirmed_at') and user.confirmed_at is None:
                return ok({"error": "Please confirm your email address first"}, 401)

        # Prüfe ob Email bestätigt wurde (wenn Email-Confirmation aktiviert)
        if app.config.get("SECURITY_CONFIRMABLE") and app.config.get("SECURITY_LOGIN_WITHOUT_CONFIRMATION") == False:
            if hasattr(user, 'confirmed_at') and user.confirmed_at is None:
                return ok({"error": "Please confirm your email address first"}, 401)
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
            return ok({"error": "Email required"}, 400)

        user = user_datastore.find_user(email=email)

        # Immer success zurückgeben (Security: kein User-Enumeration)
        if user:
            from flask_security.recoverable import generate_reset_password_token
            from flask_mail import Message
            from flask import render_template
            
            # Generiere Reset Token
            token = generate_reset_password_token(user)
            
            # Erstelle Reset Link für Frontend
            frontend_url = app.config.get("FRONTEND_URL", "http://localhost:5173")
            reset_link = f"{frontend_url}/reset-password?token={token}"
            
            # Erstelle Email-Nachricht mit Templates
            msg = Message(
                subject="WriteHaven - Password Reset Instructions",
                sender=app.config.get("SECURITY_EMAIL_SENDER", "info@writehaven.io"),
                recipients=[user.email]
            )
            
            # Render templates mit Variablen
            template_vars = {
                'user_name': user.name or '',
                'reset_link': reset_link
            }
            
            msg.html = render_template('email/reset_password.html', **template_vars)
            msg.body = render_template('email/reset_password.txt', **template_vars)
            
            # Sende Email
            try:
                mail = app.extensions.get('mail')
                if mail:
                    mail.send(msg)
            except Exception as e:
                print(f"Error sending reset email: {e}")

        return ok({"message": "If this email exists, a reset link has been sent."})

    @app.post("/api/auth/reset-password")
    def reset_password():
        """Passwort mit Token zurücksetzen"""
        data = request.get_json() or {}
        token = data.get("token", "")
        password = data.get("password", "")

        if not token or not password:
            return ok({"error": "Token and password required"}, 400)

        if len(password) < 6:
            return ok({"error": "Password must be at least 6 characters long"}, 400)

        from flask_security.recoverable import reset_password_token_status
        expired, invalid, user = reset_password_token_status(token)

        if expired:
            return ok({"error": "Reset token expired"}, 400)
        if invalid or not user:
            return ok({"error": "Invalid reset token"}, 400)

        # Passwort ändern
        user.password = hash_password(password)
        db.session.commit()

        return ok({"message": "Password reset successfully"})

    @app.post("/api/feedback")
    def submit_feedback():
        """Submit feedback via email"""
        data = request.get_json() or {}
        feedback_type = data.get("type", "other")
        message = data.get("message", "").strip()
        user_email = data.get("email", "").strip()

        if not message:
            return ok({"error": "Message is required"}, 400)

        # Send email in background thread to avoid blocking
        import threading
        import sys

        def send_email_async():
            """Send email in background thread"""
            try:
                print(f"[FEEDBACK] Starting background email send thread...")
                print(f"[FEEDBACK] Type: {feedback_type}, From: {user_email}")
                sys.stdout.flush()
                _send_feedback_email(feedback_type, message, user_email)
            except Exception as e:
                print(f"[FEEDBACK] Background email send failed: {e}")
                import traceback
                traceback.print_exc()
                sys.stdout.flush()

        # Start background thread
        print(f"[FEEDBACK] Received feedback request, starting background thread...")
        sys.stdout.flush()
        thread = threading.Thread(target=send_email_async)
        thread.daemon = True
        thread.start()

        # Return immediately
        return ok({"message": "Feedback received. Thank you!"}, 200)

    def _send_feedback_email(feedback_type, message, user_email):
        """Helper function to send feedback email via SMTP"""
        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart

            # SMTP Configuration
            smtp_host = os.getenv("SMTP_HOST", "mail.spacemail.com")
            smtp_port = int(os.getenv("SMTP_PORT", "465"))
            smtp_user = os.getenv("SMTP_USER", "info@writehaven.io")
            smtp_password = os.getenv("SMTP_PASSWORD")
            sender_email = os.getenv("FEEDBACK_SENDER_EMAIL", "info@writehaven.io")
            receiver_email = os.getenv("FEEDBACK_RECEIVER_EMAIL", "info@writehaven.io")

            print(f"[FEEDBACK] SMTP Config: host={smtp_host}, port={smtp_port}, user={smtp_user}")
            print(f"[FEEDBACK] Password configured: {bool(smtp_password)}")
            import sys
            sys.stdout.flush()

            # Validate SMTP credentials
            if not smtp_password:
                print("[FEEDBACK] ERROR: SMTP password not configured")
                sys.stdout.flush()
                return

            # Email subject based on type
            type_labels = {
                "bug": "🐛 Bug Report",
                "improvement": "💡 Improvement Suggestion",
                "feature": "✨ Feature Request",
                "other": "💬 Feedback"
            }
            subject = f"WriteHaven Feedback: {type_labels.get(feedback_type, 'Feedback')}"

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

            # Create email message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = sender_email
            msg['To'] = receiver_email

            # Attach text and HTML parts
            part1 = MIMEText(text_body, 'plain', 'utf-8')
            part2 = MIMEText(html_body, 'html', 'utf-8')
            msg.attach(part1)
            msg.attach(part2)

            # Send email via SMTP (Port 465 uses SSL)
            print(f"[FEEDBACK] Connecting to SMTP server {smtp_host}:{smtp_port}...")
            sys.stdout.flush()

            # Port 465 requires SMTP_SSL instead of SMTP + starttls
            if smtp_port == 465:
                server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=15)
            else:
                server = smtplib.SMTP(smtp_host, smtp_port, timeout=15)
                server.starttls()

            try:
                print(f"[FEEDBACK] Logging in as {smtp_user}...")
                sys.stdout.flush()
                server.login(smtp_user, smtp_password)
                print("[FEEDBACK] Sending message...")
                sys.stdout.flush()
                server.send_message(msg)
                print(f"[FEEDBACK] Email sent successfully to {receiver_email}")
                sys.stdout.flush()
            finally:
                server.quit()

        except smtplib.SMTPException as e:
            print(f"[FEEDBACK] SMTP Error: {e}")
            import traceback
            import sys
            traceback.print_exc()
            sys.stdout.flush()
            raise
        except Exception as e:
            print(f"[FEEDBACK] Error: {e}")
            import traceback
            import sys
            traceback.print_exc()
            sys.stdout.flush()
            raise

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

    @app.post("/api/projects/<int:pid>/ignore-entity")
    @token_auth_required
    def ignore_entity(pid):
        """Add a word to the project's ignored entities list"""
        p = Project.query.filter_by(id=pid, user_id=get_current_user().id).first()
        if not p: return not_found()

        data = request.get_json() or {}
        word = data.get("word", "").strip()

        if not word:
            return jsonify({"error": "Word is required"}), 400

        # Parse existing ignored entities
        try:
            ignored = json.loads(p.ignored_entities or "[]")
        except:
            ignored = []

        # Add word if not already in list (case-insensitive check)
        word_lower = word.lower()
        if word_lower not in [w.lower() for w in ignored]:
            ignored.append(word)
            p.ignored_entities = json.dumps(ignored, ensure_ascii=False)
            db.session.commit()

        return ok({"ignored_entities": ignored})

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
        rows = db.session.execute(text("""
            SELECT id, chapter_id, title, content, status, order_index
            FROM scene
            WHERE chapter_id = :cid
            ORDER BY order_index ASC, id ASC
        """), {"cid": cid}).mappings().all()
        return ok([{
            "id": row["id"],
            "chapter_id": row["chapter_id"],
            "title": row["title"],
            "order_index": row["order_index"],
            "content": row["content"],
            "status": row["status"]
        } for row in rows])

    @app.post("/api/chapters/<int:cid>/scenes")
    @token_auth_required
    def create_scene(cid):
        if not verify_chapter_ownership(cid, get_current_user().id): return forbidden()
        data = request.get_json() or {}
        payload = {
            "chapter_id": cid,
            "title": (data.get("title") or "Neue Szene").strip(),
            "order_index": int(data.get("order_index", 0)),
            "content": data.get("content", "") or "",
            "status": data.get("status") or "Idea"
        }
        try:
            row = db.session.execute(text("""
                INSERT INTO scene (chapter_id, title, order_index, content, status)
                VALUES (:chapter_id, :title, :order_index, :content, :status)
                RETURNING id, chapter_id, title, content, status, order_index
            """), payload).mappings().first()
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return bad_request("Database integrity error while creating scene.")
        return ok({
            "id": row["id"],
            "title": row["title"],
            "order_index": row["order_index"],
            "chapter_id": row["chapter_id"],
            "content": row["content"],
            "status": row["status"]
        }, 201)

    @app.get("/api/scenes/<int:sid>")
    @token_auth_required
    def get_scene(sid):
        row = db.session.execute(text("""
            SELECT id, chapter_id, title, content, status, order_index, context_manifest
            FROM scene
            WHERE id = :id
        """), {"id": sid}).mappings().first()
        if row and not verify_chapter_ownership(row["chapter_id"], get_current_user().id):
            return forbidden()
        if not row: return not_found()
        return ok({
            "id": row["id"],
            "chapter_id": row["chapter_id"],
            "title": row["title"],
            "order_index": row["order_index"],
            "content": row["content"],
            "status": row["status"],
            "context_manifest": _loads(row["context_manifest"] or "{}")
        })

    @app.put("/api/scenes/<int:sid>")
    @token_auth_required
    def update_scene(sid):
        existing = db.session.execute(text("""
            SELECT id, chapter_id, title, content, status, order_index
            FROM scene
            WHERE id = :id
        """), {"id": sid}).mappings().first()
        if not existing: return not_found()
        if not verify_chapter_ownership(existing["chapter_id"], get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        updates = []
        params = {"id": sid}
        if (t := data.get("title")) is not None:
            updates.append("title = :title")
            params["title"] = t.strip()
        if (c := data.get("content")) is not None:
            updates.append("content = :content")
            params["content"] = c
        if (st := data.get("status")) is not None:
            updates.append("status = :status")
            params["status"] = st
        if "context_manifest" in data:
            updates.append("context_manifest = :context_manifest")
            params["context_manifest"] = json.dumps(data["context_manifest"] or {})

        if not updates:
            return ok({
                "id": existing["id"],
                "title": existing["title"],
                "order_index": existing["order_index"],
                "chapter_id": existing["chapter_id"],
                "content": existing["content"],
                "status": existing["status"],
                "context_manifest": _loads(existing.get("context_manifest") or "{}")
            })

        update_sql = text(f"""
            UPDATE scene
            SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
            RETURNING id, chapter_id, title, content, status, order_index, context_manifest
        """)
        row = db.session.execute(update_sql, params).mappings().first()
        db.session.commit()
        return ok({
            "id": row["id"],
            "title": row["title"],
            "order_index": row["order_index"],
            "chapter_id": row["chapter_id"],
            "content": row["content"],
            "status": row["status"],
            "context_manifest": _loads(row["context_manifest"] or "{}")
        })

    @app.delete("/api/scenes/<int:sid>")
    @token_auth_required
    def delete_scene(sid):
        row = db.session.execute(text("SELECT chapter_id FROM scene WHERE id = :id"), {"id": sid}).first()
        if not row: return not_found()
        chapter_id = row.chapter_id if hasattr(row, "chapter_id") else row[0]
        if not verify_chapter_ownership(chapter_id, get_current_user().id):
            return forbidden()
        db.session.execute(text("DELETE FROM scene WHERE id = :id"), {"id": sid})
        db.session.commit()
        return ok({"ok": True})

    # ---------- Scene Notes ----------
    @app.get("/api/scenes/<int:sid>/notes")
    @token_auth_required
    def list_scene_notes(sid):
        s = Scene.query.get(sid)
        if not s or not verify_chapter_ownership(s.chapter_id, get_current_user().id):
            return forbidden()
        notes = SceneNote.query.filter_by(scene_id=sid).order_by(SceneNote.created_at.desc()).all()
        return ok([{"id": n.id, "scene_id": n.scene_id, "title": n.title,
                    "content": n.content, "created_at": n.created_at.isoformat() if n.created_at else None,
                    "updated_at": n.updated_at.isoformat() if n.updated_at else None} for n in notes])

    @app.post("/api/scenes/<int:sid>/notes")
    @token_auth_required
    def create_scene_note(sid):
        s = Scene.query.get(sid)
        if not s or not verify_chapter_ownership(s.chapter_id, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        note = SceneNote(scene_id=sid, title=data.get("title", ""), content=data.get("content", ""))
        db.session.add(note); db.session.commit()
        return ok({"id": note.id, "scene_id": note.scene_id, "title": note.title, "content": note.content,
                   "created_at": note.created_at.isoformat() if note.created_at else None}, 201)

    @app.put("/api/scenes/<int:sid>/notes/<int:nid>")
    @token_auth_required
    def update_scene_note(sid, nid):
        note = SceneNote.query.get(nid)
        if not note or note.scene_id != sid: return not_found()
        s = Scene.query.get(sid)
        if not s or not verify_chapter_ownership(s.chapter_id, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        if (t := data.get("title")) is not None: note.title = t
        if (c := data.get("content")) is not None: note.content = c
        db.session.commit()
        return ok({"id": note.id, "scene_id": note.scene_id, "title": note.title, "content": note.content})

    @app.delete("/api/scenes/<int:sid>/notes/<int:nid>")
    @token_auth_required
    def delete_scene_note(sid, nid):
        note = SceneNote.query.get(nid)
        if not note or note.scene_id != sid: return not_found()
        s = Scene.query.get(sid)
        if not s or not verify_chapter_ownership(s.chapter_id, get_current_user().id):
            return forbidden()
        db.session.delete(note); db.session.commit()
        return ok({"ok": True})

    # ---------- Scene Tasks ----------
    @app.get("/api/scenes/<int:sid>/tasks")
    @token_auth_required
    def list_scene_tasks(sid):
        s = Scene.query.get(sid)
        if not s or not verify_chapter_ownership(s.chapter_id, get_current_user().id):
            return forbidden()
        tasks = SceneTask.query.filter_by(scene_id=sid).order_by(SceneTask.created_at.asc()).all()
        return ok([{"id": t.id, "scene_id": t.scene_id, "title": t.title, "completed": t.completed,
                    "created_at": t.created_at.isoformat() if t.created_at else None} for t in tasks])

    @app.post("/api/scenes/<int:sid>/tasks")
    @token_auth_required
    def create_scene_task(sid):
        s = Scene.query.get(sid)
        if not s or not verify_chapter_ownership(s.chapter_id, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        task = SceneTask(scene_id=sid, title=data.get("title", ""), completed=False)
        db.session.add(task); db.session.commit()
        return ok({"id": task.id, "scene_id": task.scene_id, "title": task.title, "completed": task.completed}, 201)

    @app.put("/api/scenes/<int:sid>/tasks/<int:tid>")
    @token_auth_required
    def update_scene_task(sid, tid):
        task = SceneTask.query.get(tid)
        if not task or task.scene_id != sid: return not_found()
        s = Scene.query.get(sid)
        if not s or not verify_chapter_ownership(s.chapter_id, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        if (t := data.get("title")) is not None: task.title = t
        if (c := data.get("completed")) is not None: task.completed = bool(c)
        db.session.commit()
        return ok({"id": task.id, "scene_id": task.scene_id, "title": task.title, "completed": task.completed})

    @app.delete("/api/scenes/<int:sid>/tasks/<int:tid>")
    @token_auth_required
    def delete_scene_task(sid, tid):
        task = SceneTask.query.get(tid)
        if not task or task.scene_id != sid: return not_found()
        s = Scene.query.get(sid)
        if not s or not verify_chapter_ownership(s.chapter_id, get_current_user().id):
            return forbidden()
        db.session.delete(task); db.session.commit()
        return ok({"ok": True})

    # ---------- Chapter Notes ----------
    @app.get("/api/chapters/<int:cid>/notes")
    @token_auth_required
    def list_chapter_notes(cid):
        if not verify_chapter_ownership(cid, get_current_user().id):
            return forbidden()
        notes = ChapterNote.query.filter_by(chapter_id=cid).order_by(ChapterNote.created_at.desc()).all()
        return ok([{"id": n.id, "chapter_id": n.chapter_id, "title": n.title,
                    "content": n.content, "created_at": n.created_at.isoformat() if n.created_at else None,
                    "updated_at": n.updated_at.isoformat() if n.updated_at else None} for n in notes])

    @app.post("/api/chapters/<int:cid>/notes")
    @token_auth_required
    def create_chapter_note(cid):
        if not verify_chapter_ownership(cid, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        note = ChapterNote(chapter_id=cid, title=data.get("title", ""), content=data.get("content", ""))
        db.session.add(note); db.session.commit()
        return ok({"id": note.id, "chapter_id": note.chapter_id, "title": note.title, "content": note.content,
                   "created_at": note.created_at.isoformat() if note.created_at else None}, 201)

    @app.put("/api/chapters/<int:cid>/notes/<int:nid>")
    @token_auth_required
    def update_chapter_note(cid, nid):
        note = ChapterNote.query.get(nid)
        if not note or note.chapter_id != cid: return not_found()
        if not verify_chapter_ownership(cid, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        if (t := data.get("title")) is not None: note.title = t
        if (c := data.get("content")) is not None: note.content = c
        db.session.commit()
        return ok({"id": note.id, "chapter_id": note.chapter_id, "title": note.title, "content": note.content})

    @app.delete("/api/chapters/<int:cid>/notes/<int:nid>")
    @token_auth_required
    def delete_chapter_note(cid, nid):
        note = ChapterNote.query.get(nid)
        if not note or note.chapter_id != cid: return not_found()
        if not verify_chapter_ownership(cid, get_current_user().id):
            return forbidden()
        db.session.delete(note); db.session.commit()
        return ok({"ok": True})

    # ---------- Chapter Tasks ----------
    @app.get("/api/chapters/<int:cid>/tasks")
    @token_auth_required
    def list_chapter_tasks(cid):
        if not verify_chapter_ownership(cid, get_current_user().id):
            return forbidden()
        tasks = ChapterTask.query.filter_by(chapter_id=cid).order_by(ChapterTask.created_at.asc()).all()
        return ok([{"id": t.id, "chapter_id": t.chapter_id, "title": t.title, "completed": t.completed,
                    "created_at": t.created_at.isoformat() if t.created_at else None} for t in tasks])

    @app.post("/api/chapters/<int:cid>/tasks")
    @token_auth_required
    def create_chapter_task(cid):
        if not verify_chapter_ownership(cid, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        task = ChapterTask(chapter_id=cid, title=data.get("title", ""), completed=False)
        db.session.add(task); db.session.commit()
        return ok({"id": task.id, "chapter_id": task.chapter_id, "title": task.title, "completed": task.completed}, 201)

    @app.put("/api/chapters/<int:cid>/tasks/<int:tid>")
    @token_auth_required
    def update_chapter_task(cid, tid):
        task = ChapterTask.query.get(tid)
        if not task or task.chapter_id != cid: return not_found()
        if not verify_chapter_ownership(cid, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        if (t := data.get("title")) is not None: task.title = t
        if (c := data.get("completed")) is not None: task.completed = bool(c)
        db.session.commit()
        return ok({"id": task.id, "chapter_id": task.chapter_id, "title": task.title, "completed": task.completed})

    @app.delete("/api/chapters/<int:cid>/tasks/<int:tid>")
    @token_auth_required
    def delete_chapter_task(cid, tid):
        task = ChapterTask.query.get(tid)
        if not task or task.chapter_id != cid: return not_found()
        if not verify_chapter_ownership(cid, get_current_user().id):
            return forbidden()
        db.session.delete(task); db.session.commit()
        return ok({"ok": True})

    # ---------- Character Notes ----------
    @app.get("/api/characters/<int:cid>/notes")
    @token_auth_required
    def list_character_notes(cid):
        if not verify_character_ownership(cid, get_current_user().id):
            return forbidden()
        notes = CharacterNote.query.filter_by(character_id=cid).order_by(CharacterNote.created_at.desc()).all()
        return ok([{"id": n.id, "character_id": n.character_id, "title": n.title,
                    "content": n.content, "created_at": n.created_at.isoformat() if n.created_at else None,
                    "updated_at": n.updated_at.isoformat() if n.updated_at else None} for n in notes])

    @app.post("/api/characters/<int:cid>/notes")
    @token_auth_required
    def create_character_note(cid):
        if not verify_character_ownership(cid, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        note = CharacterNote(character_id=cid, title=data.get("title", ""), content=data.get("content", ""))
        db.session.add(note); db.session.commit()
        return ok({"id": note.id, "character_id": note.character_id, "title": note.title, "content": note.content,
                   "created_at": note.created_at.isoformat() if note.created_at else None}, 201)

    @app.put("/api/characters/<int:cid>/notes/<int:nid>")
    @token_auth_required
    def update_character_note(cid, nid):
        note = CharacterNote.query.get(nid)
        if not note or note.character_id != cid: return not_found()
        if not verify_character_ownership(cid, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        if (t := data.get("title")) is not None: note.title = t
        if (c := data.get("content")) is not None: note.content = c
        db.session.commit()
        return ok({"id": note.id, "character_id": note.character_id, "title": note.title, "content": note.content})

    @app.delete("/api/characters/<int:cid>/notes/<int:nid>")
    @token_auth_required
    def delete_character_note(cid, nid):
        note = CharacterNote.query.get(nid)
        if not note or note.character_id != cid: return not_found()
        if not verify_character_ownership(cid, get_current_user().id):
            return forbidden()
        db.session.delete(note); db.session.commit()
        return ok({"ok": True})

    # ---------- Character Tasks ----------
    @app.get("/api/characters/<int:cid>/tasks")
    @token_auth_required
    def list_character_tasks(cid):
        if not verify_character_ownership(cid, get_current_user().id):
            return forbidden()
        tasks = CharacterTask.query.filter_by(character_id=cid).order_by(CharacterTask.created_at.asc()).all()
        return ok([{"id": t.id, "character_id": t.character_id, "title": t.title, "completed": t.completed,
                    "created_at": t.created_at.isoformat() if t.created_at else None} for t in tasks])

    @app.post("/api/characters/<int:cid>/tasks")
    @token_auth_required
    def create_character_task(cid):
        if not verify_character_ownership(cid, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        task = CharacterTask(character_id=cid, title=data.get("title", ""), completed=False)
        db.session.add(task); db.session.commit()
        return ok({"id": task.id, "character_id": task.character_id, "title": task.title, "completed": task.completed}, 201)

    @app.put("/api/characters/<int:cid>/tasks/<int:tid>")
    @token_auth_required
    def update_character_task(cid, tid):
        task = CharacterTask.query.get(tid)
        if not task or task.character_id != cid: return not_found()
        if not verify_character_ownership(cid, get_current_user().id):
            return forbidden()
        data = request.get_json() or {}
        if (t := data.get("title")) is not None: task.title = t
        if (c := data.get("completed")) is not None: task.completed = bool(c)
        db.session.commit()
        return ok({"id": task.id, "character_id": task.character_id, "title": task.title, "completed": task.completed})

    @app.delete("/api/characters/<int:cid>/tasks/<int:tid>")
    @token_auth_required
    def delete_character_task(cid, tid):
        task = CharacterTask.query.get(tid)
        if not task or task.character_id != cid: return not_found()
        if not verify_character_ownership(cid, get_current_user().id):
            return forbidden()
        db.session.delete(task); db.session.commit()
        return ok({"ok": True})

    # ---------- Characters ----------
    def _char_to_dict(c: Character):
        return {
            "id": c.id,
            "project_id": c.project_id,
            "name": c.name,
            "summary": c.summary,
            "avatar_url": c.avatar_url,
            "gallery": _loads(c.gallery_json or "[]"),
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

    @app.post("/api/characters/<int:cid>/upload-avatar")
    @token_auth_required
    def upload_character_avatar(cid):
        c = verify_character_ownership(cid, get_current_user().id)
        if not c: return not_found()

        if 'avatar' not in request.files:
            return bad_request("Keine Datei hochgeladen")

        file = request.files['avatar']
        if file.filename == '':
            return bad_request("Leere Datei")

        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if ext not in allowed_extensions:
            return bad_request("Ungültiges Dateiformat. Erlaubt: PNG, JPG, JPEG, GIF, WEBP")

        import uuid
        upload_folder = os.path.join(app.static_folder, 'uploads', 'avatars')
        os.makedirs(upload_folder, exist_ok=True)
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        avatar_url = f"/uploads/avatars/{filename}"
        c.avatar_url = avatar_url
        db.session.commit()

        return ok({"avatar_url": avatar_url})

    @app.post("/api/characters/<int:cid>/gallery")
    @token_auth_required
    def upload_character_gallery(cid):
        c = verify_character_ownership(cid, get_current_user().id)
        if not c: return not_found()

        if 'image' not in request.files:
            return bad_request("Keine Datei hochgeladen")

        file = request.files['image']
        if file.filename == '':
            return bad_request("Leere Datei")

        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if ext not in allowed_extensions:
            return bad_request("Ungültiges Dateiformat. Erlaubt: PNG, JPG, JPEG, GIF, WEBP")

        import uuid
        upload_folder = os.path.join(app.static_folder, 'uploads', 'gallery', str(cid))
        os.makedirs(upload_folder, exist_ok=True)
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        image_url = f"/uploads/gallery/{cid}/{filename}"
        gallery = _loads(c.gallery_json or "[]")
        if not isinstance(gallery, list):
            gallery = []
        gallery.append(image_url)
        c.gallery_json = _dumps(gallery)
        db.session.commit()

        return ok({"gallery": gallery})

    @app.delete("/api/characters/<int:cid>/gallery")
    @token_auth_required
    def remove_character_gallery_image(cid):
        c = verify_character_ownership(cid, get_current_user().id)
        if not c: return not_found()

        data = request.get_json() or {}
        index = data.get("index")
        if index is None or not isinstance(index, int):
            return bad_request("index required")

        gallery = _loads(c.gallery_json or "[]")
        if not isinstance(gallery, list):
            gallery = []

        if 0 <= index < len(gallery):
            gallery.pop(index)

        c.gallery_json = _dumps(gallery)
        db.session.commit()
        return ok({"gallery": gallery})

    # ---------- World ----------
    @app.get("/api/projects/<int:pid>/world")
    @token_auth_required
    def list_world(pid):
        if not verify_project_ownership(pid, get_current_user().id):
            return forbidden()
        rows = WorldNode.query.filter_by(project_id=pid).order_by(WorldNode.id.asc()).all()
        return ok([{
            "id": w.id, "project_id": w.project_id, "title": w.title, "kind": w.kind,
            "summary": w.summary, "icon": w.icon, "regionId": w.region_id
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
            "relations": _loads(w.relations_json or "{}"),
            "regionId": w.region_id
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

        # Save regionId if provided
        if "regionId" in data:
            w.region_id = data.get("regionId")

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
            "relations": _loads(w.relations_json or "{}"),
            "regionId": w.region_id
        })

    @app.delete("/api/world/<int:w_id>")
    @token_auth_required
    def delete_world(w_id):
        w = verify_world_ownership(w_id, get_current_user().id)
        if not w: return not_found()
        db.session.delete(w); db.session.commit()
        return ok({"ok": True})

    # ---------- WorldNode Notes ----------
    @app.get("/api/world/<int:wid>/notes")
    @token_auth_required
    def list_worldnode_notes(wid):
        w = verify_world_ownership(wid, get_current_user().id)
        if not w: return not_found()
        notes = WorldNodeNote.query.filter_by(worldnode_id=wid).order_by(WorldNodeNote.created_at.desc()).all()
        return ok([{
            "id": n.id,
            "worldnode_id": n.worldnode_id,
            "title": n.title,
            "content": n.content,
            "created_at": n.created_at.isoformat() if n.created_at else None,
            "updated_at": n.updated_at.isoformat() if n.updated_at else None
        } for n in notes])

    @app.post("/api/world/<int:wid>/notes")
    @token_auth_required
    def create_worldnode_note(wid):
        w = verify_world_ownership(wid, get_current_user().id)
        if not w: return not_found()
        data = request.get_json() or {}
        note = WorldNodeNote(
            worldnode_id=wid,
            title=data.get("title", ""),
            content=data.get("content", "")
        )
        db.session.add(note)
        db.session.commit()
        return ok({
            "id": note.id,
            "worldnode_id": note.worldnode_id,
            "title": note.title,
            "content": note.content,
            "created_at": note.created_at.isoformat() if note.created_at else None,
            "updated_at": note.updated_at.isoformat() if note.updated_at else None
        }, 201)

    @app.put("/api/world/<int:wid>/notes/<int:nid>")
    @token_auth_required
    def update_worldnode_note(wid, nid):
        w = verify_world_ownership(wid, get_current_user().id)
        if not w: return not_found()
        note = WorldNodeNote.query.filter_by(id=nid, worldnode_id=wid).first()
        if not note: return not_found()
        data = request.get_json() or {}
        note.title = data.get("title", note.title)
        note.content = data.get("content", note.content)
        db.session.commit()
        return ok({
            "id": note.id,
            "worldnode_id": note.worldnode_id,
            "title": note.title,
            "content": note.content,
            "created_at": note.created_at.isoformat() if note.created_at else None,
            "updated_at": note.updated_at.isoformat() if note.updated_at else None
        })

    @app.delete("/api/world/<int:wid>/notes/<int:nid>")
    @token_auth_required
    def delete_worldnode_note(wid, nid):
        w = verify_world_ownership(wid, get_current_user().id)
        if not w: return not_found()
        note = WorldNodeNote.query.filter_by(id=nid, worldnode_id=wid).first()
        if not note: return not_found()
        db.session.delete(note)
        db.session.commit()
        return ok({"ok": True})

    # ---------- WorldNode Tasks ----------
    @app.get("/api/world/<int:wid>/tasks")
    @token_auth_required
    def list_worldnode_tasks(wid):
        w = verify_world_ownership(wid, get_current_user().id)
        if not w: return not_found()
        tasks = WorldNodeTask.query.filter_by(worldnode_id=wid).order_by(WorldNodeTask.created_at.asc()).all()
        return ok([{
            "id": t.id,
            "worldnode_id": t.worldnode_id,
            "title": t.title,
            "completed": t.completed,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "updated_at": t.updated_at.isoformat() if t.updated_at else None
        } for t in tasks])

    @app.post("/api/world/<int:wid>/tasks")
    @token_auth_required
    def create_worldnode_task(wid):
        w = verify_world_ownership(wid, get_current_user().id)
        if not w: return not_found()
        data = request.get_json() or {}
        title = data.get("title", "").strip()
        if not title:
            return bad_request("Title is required")
        task = WorldNodeTask(
            worldnode_id=wid,
            title=title,
            completed=False
        )
        db.session.add(task)
        db.session.commit()
        return ok({
            "id": task.id,
            "worldnode_id": task.worldnode_id,
            "title": task.title,
            "completed": task.completed,
            "created_at": task.created_at.isoformat() if task.created_at else None,
            "updated_at": task.updated_at.isoformat() if task.updated_at else None
        }, 201)

    @app.put("/api/world/<int:wid>/tasks/<int:tid>")
    @token_auth_required
    def update_worldnode_task(wid, tid):
        w = verify_world_ownership(wid, get_current_user().id)
        if not w: return not_found()
        task = WorldNodeTask.query.filter_by(id=tid, worldnode_id=wid).first()
        if not task: return not_found()
        data = request.get_json() or {}
        if "title" in data:
            task.title = data["title"]
        if "completed" in data:
            task.completed = data["completed"]
        db.session.commit()
        return ok({
            "id": task.id,
            "worldnode_id": task.worldnode_id,
            "title": task.title,
            "completed": task.completed,
            "created_at": task.created_at.isoformat() if task.created_at else None,
            "updated_at": task.updated_at.isoformat() if task.updated_at else None
        })

    @app.delete("/api/world/<int:wid>/tasks/<int:tid>")
    @token_auth_required
    def delete_worldnode_task(wid, tid):
        w = verify_world_ownership(wid, get_current_user().id)
        if not w: return not_found()
        task = WorldNodeTask.query.filter_by(id=tid, worldnode_id=wid).first()
        if not task: return not_found()
        db.session.delete(task)
        db.session.commit()
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

    @app.post("/api/projects/<int:pid>/export-pdf")
    @token_auth_required
    def export_project_pdf(pid):
        """Export project as PDF with ReportLab - matching BookExport.jsx formatting"""
        from reportlab.lib.pagesizes import landscape
        from reportlab.lib.styles import ParagraphStyle
        from reportlab.lib.units import mm
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
        from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
        from reportlab.pdfgen import canvas
        from io import BytesIO
        from flask import make_response
        from bs4 import BeautifulSoup

        p = verify_project_ownership(pid, get_current_user().id)
        if not p: return not_found()

        data = request.get_json() or {}
        html_content = data.get("html", "")

        if not html_content:
            return bad_request("HTML content is required")

        try:
            soup = BeautifulSoup(html_content, 'html.parser')

            # Extract title and chapters
            chapters = []
            chapter_sections = soup.find_all('section', class_='chapter-section')

            for section in chapter_sections:
                chapter_title_elem = section.find('h1', class_='chapter-title')
                chapter_title = chapter_title_elem.get_text().strip() if chapter_title_elem else ""

                paragraphs = []
                scene_break_next = False
                for p_tag in section.find_all('p'):
                    classes = p_tag.get('class', [])
                    if 'scene-sep' in classes:
                        scene_break_next = True
                        continue
                    text = p_tag.get_text().strip()
                    if not text:
                        continue
                    is_first = 'dropcap' in classes or scene_break_next
                    paragraphs.append({'text': text, 'first': is_first, 'scene_break': scene_break_next})
                    scene_break_next = False

                if chapter_title or paragraphs:
                    chapters.append({'title': chapter_title, 'paragraphs': paragraphs})

            # Page size: 152.4mm x 228.6mm (from BookExport.jsx)
            page_width = 152.4 * mm
            page_height = 228.6 * mm

            # Margins: @page{margin:20mm 18mm 24mm 18mm} = top, right, bottom, left
            margin_top = 20 * mm
            margin_right = 18 * mm
            margin_bottom = 24 * mm
            margin_left = 18 * mm

            # Custom canvas for page numbers
            class NumberedCanvas(canvas.Canvas):
                def __init__(self, *args, **kwargs):
                    canvas.Canvas.__init__(self, *args, **kwargs)
                    self._saved_page_states = []

                def showPage(self):
                    self._saved_page_states.append(dict(self.__dict__))
                    self._startPage()

                def save(self):
                    num_pages = len(self._saved_page_states)
                    for state in self._saved_page_states:
                        self.__dict__.update(state)
                        self.draw_page_number(num_pages)
                        canvas.Canvas.showPage(self)
                    canvas.Canvas.save(self)

                def draw_page_number(self, page_count):
                    page = self._pageNumber
                    # Skip page number on title page (page 1)
                    if page == 1:
                        return

                    self.saveState()
                    # @bottom-center{content: counter(page); font-size:10pt; color:#444}
                    self.setFont('Times-Roman', 10)
                    self.setFillColorRGB(0.267, 0.267, 0.267)  # #444
                    self.drawCentredString(page_width / 2, margin_bottom / 2, str(page))
                    self.restoreState()

            pdf_buffer = BytesIO()
            doc = SimpleDocTemplate(
                pdf_buffer,
                pagesize=(page_width, page_height),
                leftMargin=margin_left,
                rightMargin=margin_right,
                topMargin=margin_top,
                bottomMargin=margin_bottom
            )

            # Styles matching BookExport.jsx EXACTLY
            # Title: font-size:28pt
            title_style = ParagraphStyle(
                'Title',
                fontName='Times-Roman',  # Georgia fallback
                fontSize=28,
                leading=36,
                alignment=TA_CENTER,
                spaceAfter=3*mm
            )

            # Subtitle: font-size:12pt; color:#555
            subtitle_style = ParagraphStyle(
                'Subtitle',
                fontName='Times-Roman',
                fontSize=12,
                leading=16,
                alignment=TA_CENTER,
                textColor='#555555',
                spaceAfter=0
            )

            # Chapter: font-size:18pt; text-align:center; margin:0 0 10mm
            chapter_style = ParagraphStyle(
                'Chapter',
                fontName='Times-Bold',
                fontSize=18,
                leading=22,
                alignment=TA_CENTER,
                spaceAfter=10*mm,
                spaceBefore=0,
                keepWithNext=True
            )

            # Body: font-size:11pt; line-height:1.42; text-indent:1.2em; no space between paragraphs
            body_style = ParagraphStyle(
                'Body',
                fontName='Times-Roman',
                fontSize=11,
                leading=11 * 1.42,
                alignment=TA_JUSTIFY,
                firstLineIndent=1.2 * 11,  # 1.2em
                spaceAfter=0
            )

            # First paragraph after chapter: text-indent:0
            body_first_style = ParagraphStyle(
                'BodyFirst',
                parent=body_style,
                firstLineIndent=0
            )

            story = []

            # Title page: margin-top:35mm
            story.append(Spacer(1, 35*mm))
            story.append(Paragraph(p.title or "Untitled", title_style))
            story.append(Paragraph("Novel", subtitle_style))
            story.append(PageBreak())

            # Chapters
            for idx, chapter in enumerate(chapters):
                if idx > 0:
                    story.append(PageBreak())

                if chapter['title']:
                    story.append(Paragraph(chapter['title'], chapter_style))

                for p_idx, para in enumerate(chapter['paragraphs']):
                    if para.get('scene_break'):
                        story.append(Spacer(1, 11 * 1.42))
                    text = para['text'].replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    style = body_first_style if para['first'] else body_style
                    story.append(Paragraph(text, style))

            doc.build(story, canvasmaker=NumberedCanvas)
            pdf_buffer.seek(0)

            response = make_response(pdf_buffer.getvalue())
            response.headers['Content-Type'] = 'application/pdf'
            response.headers['Content-Disposition'] = f'attachment; filename="{p.title or "book"}.pdf"'
            return response

        except Exception as e:
            print(f"PDF generation error: {e}")
            import traceback
            traceback.print_exc()
            return bad_request(f"Error generating PDF: {str(e)}")

    # Optional: globaler Integrity-Handler
    @app.errorhandler(IntegrityError)
    def handle_integrity(e):
        db.session.rollback()
        return bad_request("Database integrity error.")

    # ---------- Schreibgeist (Claude AI) ----------
    @app.post("/api/projects/<int:pid>/schreibgeist")
    @token_auth_required
    def schreibgeist_chat(pid):
        p = verify_project_ownership(pid, get_current_user().id)
        if not p: return not_found()

        api_key = os.getenv("ANTHROPIC_API_KEY", "")
        if not api_key:
            return ok({"error": "api_key_missing"}, 503)

        data = request.get_json() or {}
        raw_messages = data.get("messages", [])
        if not raw_messages:
            return bad_request("no_messages")

        MODEL_MAP = {
            "haiku":  "claude-haiku-4-5-20251001",
            "sonnet": "claude-sonnet-4-6",
        }
        selected_model = MODEL_MAP.get(data.get("model", "sonnet"), "claude-sonnet-4-6")

        # Build base book context (always included)
        all_chapters = Chapter.query.filter_by(project_id=pid).order_by(Chapter.order_index.asc()).all()
        chapter_block = "\n".join(
            [f"- Kapitel {i+1}: {ch.title or '(ohne Titel)'}" for i, ch in enumerate(all_chapters)]
        ) or "Noch keine Kapitel angelegt."

        all_characters = Character.query.filter_by(project_id=pid).all()
        character_block = ", ".join([c.name for c in all_characters if c.name]) or "Noch keine Charaktere angelegt."

        user = get_current_user()
        base_system = f"""Du bist Schreibgeist, ein kreativer Schreibassistent für {user.name or 'den Autor'}.

Du arbeitest am Projekt: "{p.title}"

Buchstruktur:
{chapter_block}

Charaktere:
{character_block}

Deine Aufgabe: Beim kreativen Schreiben helfen – Ideen entwickeln, Feedback geben, Formulierungen vorschlagen.
Antworte auf Deutsch. Passe die Länge deiner Antwort der Aufgabe an: kurze Fragen knapp beantworten, vollständige Texte vollständig ausschreiben.
Wenn du Szenentext vorschlägst oder überarbeitest, umschließe den vollständigen Text mit <scene> und </scene>."""

        # Build entity context (multi-select characters + locations + current scene)
        entity_ctx    = data.get("entity_context", {})
        ec_char_ids   = set(entity_ctx.get("character_ids", []))
        ec_loc_ids    = set(entity_ctx.get("location_ids",  []))
        ec_scene_id   = entity_ctx.get("scene_id")
        context_parts = []

        # Current scene context
        if ec_scene_id:
            scene_row = db.session.execute(text("""
                SELECT s.title, s.content
                FROM scene s
                JOIN chapter c ON s.chapter_id = c.id
                WHERE s.id = :sid AND c.project_id = :pid
            """), {"sid": ec_scene_id, "pid": pid}).mappings().first()
            if scene_row:
                scene_block = f"## Aktuelle Szene: {scene_row['title'] or '(ohne Titel)'}"
                if scene_row["content"]:
                    scene_block += f"\n\n{scene_row['content']}"
                context_parts.append(scene_block)

        if ec_char_ids or ec_loc_ids:
            # Character profiles
            for char in [c for c in all_characters if c.id in ec_char_ids]:
                prof = _loads(char.profile_json or "{}")
                parts = [f"## Charakter: {char.name}"]
                if char.summary:
                    parts.append(char.summary)
                age = prof.get("basic", {}).get("age", "")
                if age:
                    parts.append(f"Alter: {age}")
                backstory = prof.get("relations", {}).get("family_background", "")
                if backstory:
                    parts.append(f"Hintergrund: {backstory[:400]}")
                context_parts.append("\n".join(parts))

            # Location descriptions
            if ec_loc_ids:
                for loc in WorldNode.query.filter(
                    WorldNode.id.in_(ec_loc_ids), WorldNode.project_id == pid
                ).all():
                    parts = [f"## Ort: {loc.title} ({loc.kind})"]
                    if loc.summary:
                        parts.append(loc.summary[:600])
                    context_parts.append("\n".join(parts))

            # Deduplicated union of tagged scenes
            all_project_scenes = db.session.execute(text("""
                SELECT s.id, s.title, s.content, s.context_manifest
                FROM scene s
                JOIN chapter c ON s.chapter_id = c.id
                WHERE c.project_id = :pid
            """), {"pid": pid}).mappings().all()

            seen_ids = set()
            tagged_scenes = []
            for sc in all_project_scenes:
                m = _loads(sc["context_manifest"] or "{}")
                if (ec_char_ids & set(m.get("character_ids", []))) or \
                   (ec_loc_ids  & set(m.get("location_ids",  []))):
                    if sc["id"] not in seen_ids:
                        seen_ids.add(sc["id"])
                        tagged_scenes.append(sc)

            if tagged_scenes:
                context_parts.append("### Verknüpfte Szenen:")
                for sc in tagged_scenes:
                    block = f"#### Szene: {sc['title'] or '(ohne Titel)'}"
                    if sc["content"]:
                        block += f"\n{sc['content']}"
                    context_parts.append(block)
            else:
                context_parts.append("(Keine Szenen mit den ausgewählten Elementen getaggt)")

        system_blocks = [{"type": "text", "text": base_system}]
        if context_parts:
            system_blocks.append({
                "type": "text",
                "text": "\n\n---\nAusgewählter Kontext:\n\n" + "\n\n".join(context_parts),
            })
        system_blocks[-1]["cache_control"] = {"type": "ephemeral"}

        # Convert messages: 'ai' → 'assistant', keep last 20
        claude_messages = []
        for m in raw_messages[-20:]:
            role = "assistant" if m.get("role") == "ai" else "user"
            content = str(m.get("content") or m.get("text") or "")
            if content:
                claude_messages.append({"role": role, "content": content})

        if not claude_messages:
            return bad_request("no_messages")

        try:
            import anthropic
            client = anthropic.Anthropic(api_key=api_key)
            response = client.messages.create(
                model=selected_model,
                max_tokens=4096,
                system=system_blocks,
                messages=claude_messages,
            )
            reply = response.content[0].text if response.content else ""
            usage = response.usage
            print(
                f"[Schreibgeist] model={selected_model} "
                f"in={usage.input_tokens} out={usage.output_tokens} "
                f"cache_write={getattr(usage, 'cache_creation_input_tokens', 0)} "
                f"cache_read={getattr(usage, 'cache_read_input_tokens', 0)}",
                flush=True
            )
            scene_match = re.search(r'<scene>(.*?)</scene>', reply, re.DOTALL)
            scene_content = scene_match.group(1).strip() if scene_match else None
            if scene_content is not None:
                display_reply = re.sub(r'<scene>.*?</scene>', scene_content, reply, flags=re.DOTALL)
            else:
                display_reply = reply
            return ok({"message": display_reply, "scene_content": scene_content})
        except Exception as e:
            error_str = str(e)
            return ok({"error": f"api_error: {error_str[:200]}"}, 503)

    # ---------- Charakter-Extraktion aus Text ----------
    @app.post("/api/projects/<int:pid>/characters/<int:cid>/extract-from-text")
    @token_auth_required
    def extract_character_from_text(pid, cid):
        user = get_current_user()
        p = verify_project_ownership(pid, user.id)
        if not p: return not_found()

        char = Character.query.filter_by(id=cid, project_id=pid).first()
        if not char: return not_found()

        api_key = os.getenv("ANTHROPIC_API_KEY", "")
        if not api_key:
            return ok({"error": "api_key_missing"}, 503)

        char_name = char.name or "Dieser Charakter"
        # Für die Szenen-Suche nur den Vornamen verwenden, da Charaktere im Text
        # meist nur beim Vornamen genannt werden, char.name aber "Vorname Nachname" sein kann
        profile_json = _loads(char.profile_json or "{}")
        search_name = (
            profile_json.get("basic", {}).get("first_name", "").strip()
            or char_name.split()[0]
        )

        LANG_MAP = {
            "de": "Deutsch", "en": "English", "fr": "Français",
            "es": "Español", "it": "Italiano", "pt": "Português",
        }
        book_language = LANG_MAP.get(p.language or "", "Deutsch")

        # Nur Szenen laden, in denen der Charaktername vorkommt (vollständiger Text)
        rows = db.session.execute(text("""
            SELECT s.title, s.content
            FROM scene s
            JOIN chapter c ON s.chapter_id = c.id
            WHERE c.project_id = :pid
              AND s.content IS NOT NULL AND s.content != ''
              AND s.content LIKE :name_pattern
        """), {"pid": pid, "name_pattern": f"%{search_name}%"}).mappings().all()

        if not rows:
            return ok({"extracted": {}})

        scenes_text = "\n\n".join(
            f"[Szene: {r['title'] or '(ohne Titel)'}]\n{(r['content'] or '')[:2000]}"
            for r in rows
        )

        schema = """{
  "basic": {"first_name": "", "last_name": "", "nickname": "", "gender": "", "age": "", "birth_date": "", "residence": "", "nationality": "", "religion": ""},
  "appearance": {"hair_color": "", "eye_color": "", "height": "", "weight": "", "build": "", "skin_color": "", "distinguishing_features": "", "clothing_style": "", "accessories": "", "body_language": "", "general_impression": ""},
  "personality": {"traits": "", "strengths": "", "weaknesses": "", "intelligence": "", "humor": "", "interests": "", "likes": "", "dislikes": "", "morals": "", "fears": "", "goals_motivation": "", "unresolved_problems": "", "inner_conflicts": "", "wishes_dreams": "", "patterns_in_situations": "", "traumas": "", "setbacks": "", "experiences": "", "view_on_life": "", "view_on_death": ""},
  "relations": {"family_background": "", "childhood": "", "education": "", "occupation": "", "social_status": ""},
  "skills": {"list": []}
}"""

        system_prompt = f"""Du bist ein Datenextraktor für Romancharaktere.
Analysiere den folgenden Romantext und extrahiere alle Informationen über den Charakter "{char_name}".
Antworte NUR mit einem validen JSON-Objekt. Kein Freitext, keine Erklärungen, kein Markdown.
Schreibe alle Feldwerte auf {book_language}.
Verwende diese Struktur (nur Felder einschließen, die du mit Sicherheit aus dem Text ableiten kannst):
{schema}
Leere oder unsichere Felder weglassen. Antworte ausschließlich mit dem JSON-Objekt."""

        try:
            import anthropic
            import json as json_lib
            client = anthropic.Anthropic(api_key=api_key)
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=2048,
                system=system_prompt,
                messages=[{"role": "user", "content": scenes_text}],
            )
            raw = response.content[0].text if response.content else "{}"
            # JSON aus Antwort extrahieren (tolerant gegenüber Markdown-Code-Blöcken)
            json_match = re.search(r'\{[\s\S]*\}', raw)
            if not json_match:
                return ok({"error": "parse_error"})
            extracted = json_lib.loads(json_match.group(0))
            return ok({"extracted": extracted})
        except (ValueError, KeyError):
            return ok({"error": "parse_error"})
        except Exception as e:
            return ok({"error": f"api_error: {str(e)[:200]}"}, 503)

    # ---------- Kapitelname-Vorschläge ----------
    @app.post("/api/chapters/<int:cid>/suggest-title")
    @token_auth_required
    def suggest_chapter_title(cid):
        user = get_current_user()
        chapter = Chapter.query.get(cid)
        if not chapter: return not_found()
        p = verify_project_ownership(chapter.project_id, user.id)
        if not p: return not_found()

        api_key = os.getenv("ANTHROPIC_API_KEY", "")
        if not api_key:
            return ok({"error": "api_key_missing"}, 503)

        scenes = Scene.query.filter_by(chapter_id=cid).order_by(Scene.order_index.asc()).all()
        non_empty = [s for s in scenes if s.content and s.content.strip()]
        if not non_empty:
            return ok({"suggestions": []})

        LANG_MAP = {
            "de": "Deutsch", "en": "English", "fr": "Français",
            "es": "Español", "it": "Italiano", "pt": "Português",
        }
        book_language = LANG_MAP.get(p.language or "", "Deutsch")

        scenes_text = "\n\n".join(
            f"[Szene: {s.title or '(ohne Titel)'}]\n{(s.content or '')[:500]}"
            for s in non_empty
        )

        system_prompt = f"""Du bist ein Titelgenerator für Romankapitel.
Analysiere die folgenden Szeneninhalte und schlage 3 bis 5 prägnante, atmosphärische Kapiteltitel vor.
Antworte NUR mit einem JSON-Array von Strings. Kein Freitext, kein Markdown, keine Nummerierung.
Beispiel: ["Titel 1", "Titel 2", "Titel 3"]
Schreibe die Titel auf {book_language}."""

        try:
            import anthropic
            import json as json_lib
            client = anthropic.Anthropic(api_key=api_key)
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=256,
                system=system_prompt,
                messages=[{"role": "user", "content": scenes_text}],
            )
            raw = response.content[0].text if response.content else "[]"
            arr_match = re.search(r'\[[\s\S]*\]', raw)
            if not arr_match:
                return ok({"error": "parse_error"})
            suggestions = json_lib.loads(arr_match.group(0))
            if not isinstance(suggestions, list):
                return ok({"error": "parse_error"})
            return ok({"suggestions": [str(s) for s in suggestions if s]})
        except (ValueError, KeyError):
            return ok({"error": "parse_error"})
        except Exception as e:
            return ok({"error": f"api_error: {str(e)[:200]}"}, 503)

    return app


if __name__ == "__main__":
    create_app().run(host="127.0.0.1", port=5000, debug=True)

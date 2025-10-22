# backend/security_config.py
"""Flask-Security-Too Configuration"""
import os
from datetime import timedelta


def get_security_config():
    """
    Flask-Security-Too Konfiguration für lokale & Cloud-Umgebungen
    """
    # Email-Modus: 'console' für lokale Entwicklung, 'smtp' für Production
    email_backend = os.getenv("EMAIL_BACKEND", "console")

    config = {
        # Security
        "SECRET_KEY": os.getenv("SECRET_KEY", "dev-secret-key-change-in-production"),
        "SECURITY_PASSWORD_SALT": os.getenv("SECURITY_PASSWORD_SALT", "dev-password-salt-change-in-production"),

        # Features
        "SECURITY_REGISTERABLE": True,  # Erlaubt Registrierung
        "SECURITY_RECOVERABLE": True,  # Passwort-Reset
        "SECURITY_CONFIRMABLE": False,  # Email-Bestätigung DEAKTIVIERT (vorerst)
        "SECURITY_CHANGEABLE": True,  # Passwort ändern
        "SECURITY_TRACKABLE": True,  # Login-Tracking

        # Token-basierte Auth
        "SECURITY_TOKEN_AUTHENTICATION_HEADER": "Authorization",
        "SECURITY_TOKEN_AUTHENTICATION_KEY": "Bearer",  # Prefix für Token
        "SECURITY_TOKEN_MAX_AGE": int(os.getenv("JWT_EXPIRATION_HOURS", "720")) * 3600,  # In Sekunden (30 Tage)

        # Email-Einstellungen
        "SECURITY_EMAIL_SENDER": os.getenv("SECURITY_EMAIL_SENDER", "noreply@writehaven.com"),
        "SECURITY_EMAIL_SUBJECT_REGISTER": "Welcome to WriteHaven - Please confirm your email",
        "SECURITY_EMAIL_SUBJECT_PASSWORD_RESET": "WriteHaven - Password Reset Instructions",
        "SECURITY_EMAIL_SUBJECT_PASSWORD_NOTICE": "WriteHaven - Your password has been changed",
        "SECURITY_EMAIL_SUBJECT_CONFIRM": "WriteHaven - Please confirm your email",

        # URLs - Flask-Security nutzt diese nicht für Email-Links
        # Wir brauchen sie nur für Redirects
        "SECURITY_POST_LOGIN_VIEW": "/app",
        "SECURITY_POST_LOGOUT_VIEW": "/",
        "SECURITY_POST_REGISTER_VIEW": "/app",

        # Frontend URL für Email-Links (wird in unseren Custom Endpoints genutzt)
        "FRONTEND_URL": os.getenv("FRONTEND_URL", "http://localhost:5173"),

        # CSRF für API-only Mode deaktivieren
        "SECURITY_CSRF_PROTECT_MECHANISMS": [],
        "SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS": True,
        "WTF_CSRF_ENABLED": False,

        # JSON Responses (für API)
        "SECURITY_RETURN_GENERIC_RESPONSES": False,  # Detaillierte Fehlermeldungen

        # Password Policy
        "SECURITY_PASSWORD_LENGTH_MIN": 6,
        "SECURITY_PASSWORD_COMPLEXITY_CHECKER": None,  # Optional: komplexere Passwort-Regeln

        # Freshness (für sensible Operationen)
        "SECURITY_FRESHNESS": timedelta(hours=1),
        "SECURITY_FRESHNESS_GRACE_PERIOD": timedelta(hours=1),
    }

    # Email Backend Configuration
    if email_backend == "console":
        # Lokale Entwicklung: Email in Console ausgeben
        config.update({
            "MAIL_BACKEND": "console",
            "MAIL_SUPPRESS_SEND": False,
        })
    else:
        # Production: SMTP
        config.update({
            "MAIL_BACKEND": "smtp",
            "MAIL_SERVER": os.getenv("MAIL_SERVER", "smtp.gmail.com"),
            "MAIL_PORT": int(os.getenv("MAIL_PORT", "587")),
            "MAIL_USE_TLS": os.getenv("MAIL_USE_TLS", "true").lower() == "true",
            "MAIL_USE_SSL": os.getenv("MAIL_USE_SSL", "false").lower() == "true",
            "MAIL_USERNAME": os.getenv("MAIL_USERNAME"),
            "MAIL_PASSWORD": os.getenv("MAIL_PASSWORD"),
            "MAIL_DEFAULT_SENDER": os.getenv("SECURITY_EMAIL_SENDER", "noreply@writehaven.com"),
        })

    return config

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Migrations-Script: Bestehende User zu Flask-Security-Too migrieren

Dieses Script:
1. Fügt die neuen Flask-Security-Too Felder hinzu (fs_uniquifier, active, confirmed_at)
2. Benennt password_hash zu password um
3. Behält bestehende Passwort-Hashes (kompatibel mit bcrypt)

WICHTIG: Backup der Datenbank erstellen bevor du dieses Script ausführst!
"""

import os
import sys
from datetime import datetime

# Windows Console UTF-8 Support
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Setup path für imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from backend.extensions import db
    from backend.app import create_app
except ImportError:
    from extensions import db
    from app import create_app


def migrate_users():
    """Migriere bestehende User zu Flask-Security-Too Schema"""

    app = create_app()

    with app.app_context():
        print("🔄 Starting user migration to Flask-Security-Too...")
        print("=" * 60)

        # 1. Prüfe ob alte Spalte password_hash existiert
        from sqlalchemy import inspect, text
        inspector = inspect(db.engine)
        columns = {col['name'] for col in inspector.get_columns('user')}

        has_password_hash = 'password_hash' in columns
        has_password = 'password' in columns
        has_fs_uniquifier = 'fs_uniquifier' in columns
        has_active = 'active' in columns
        has_confirmed_at = 'confirmed_at' in columns

        print(f"📊 Aktuelles Schema:")
        print(f"  - password_hash: {'✓' if has_password_hash else '✗'}")
        print(f"  - password: {'✓' if has_password else '✗'}")
        print(f"  - fs_uniquifier: {'✓' if has_fs_uniquifier else '✗'}")
        print(f"  - active: {'✓' if has_active else '✗'}")
        print(f"  - confirmed_at: {'✓' if has_confirmed_at else '✗'}")
        print()

        # 2. Füge fehlende Spalten hinzu
        # Alle Flask-Security-Too required/optional Felder
        required_columns = {
            'fs_uniquifier': "ALTER TABLE user ADD COLUMN fs_uniquifier VARCHAR(255)",
            'active': "ALTER TABLE user ADD COLUMN active BOOLEAN DEFAULT 1" if db.engine.url.drivername.startswith('sqlite') else "ALTER TABLE user ADD COLUMN active BOOLEAN DEFAULT true",
            'confirmed_at': "ALTER TABLE user ADD COLUMN confirmed_at TIMESTAMP",
            'last_login_at': "ALTER TABLE user ADD COLUMN last_login_at TIMESTAMP",
            'current_login_at': "ALTER TABLE user ADD COLUMN current_login_at TIMESTAMP",
            'last_login_ip': "ALTER TABLE user ADD COLUMN last_login_ip VARCHAR(100)",
            'current_login_ip': "ALTER TABLE user ADD COLUMN current_login_ip VARCHAR(100)",
            'login_count': "ALTER TABLE user ADD COLUMN login_count INTEGER DEFAULT 0",
        }

        for col_name, sql_statement in required_columns.items():
            if col_name not in columns:
                print(f"+ Fuege Spalte '{col_name}' hinzu...")
                try:
                    db.session.execute(text(sql_statement))
                    db.session.commit()
                except Exception as e:
                    print(f"  Warnung: {e}")
                    db.session.rollback()

        # 3. Rename password_hash zu password (wenn nötig)
        if has_password_hash and not has_password:
            print("🔄 Benenne 'password_hash' zu 'password' um...")

            if db.engine.url.drivername.startswith('sqlite'):
                # SQLite unterstützt kein ALTER COLUMN RENAME, wir müssen kopieren
                db.session.execute(text("ALTER TABLE user ADD COLUMN password VARCHAR(255)"))
                db.session.execute(text("UPDATE user SET password = password_hash"))
                # password_hash Spalte bleibt erstmal (wegen Kompatibilität)
                print("  ⚠️  SQLite: password_hash Spalte bleibt erhalten (bitte manuell später löschen)")
            else:
                # PostgreSQL
                db.session.execute(text("ALTER TABLE user RENAME COLUMN password_hash TO password"))

            db.session.commit()
            print("  ✓ password Spalte erstellt")

        # 4. Fülle fs_uniquifier für alle User
        from sqlalchemy import text as sqltext
        print("🔐 Generiere fs_uniquifier für bestehende User...")

        result = db.session.execute(text("SELECT id, email FROM user WHERE fs_uniquifier IS NULL OR fs_uniquifier = ''"))
        users_without_uniquifier = result.fetchall()

        if users_without_uniquifier:
            import uuid
            for user_id, email in users_without_uniquifier:
                uniquifier = uuid.uuid4().hex
                db.session.execute(
                    text("UPDATE user SET fs_uniquifier = :uniq WHERE id = :uid"),
                    {"uniq": uniquifier, "uid": user_id}
                )
                print(f"  ✓ User {email}: fs_uniquifier generiert")

            db.session.commit()
        else:
            print("  ℹ️  Alle User haben bereits einen fs_uniquifier")

        # 5. Setze active=True und confirmed_at für bestehende User
        print("✅ Aktiviere und bestätige bestehende User...")

        db.session.execute(text("UPDATE user SET active = 1 WHERE active IS NULL"))
        db.session.execute(text("UPDATE user SET active = true WHERE active IS NULL"))

        # Alle bestehenden User als bestätigt markieren (da wir vorher keine Email-Confirmation hatten)
        now = datetime.utcnow()
        db.session.execute(
            text("UPDATE user SET confirmed_at = :now WHERE confirmed_at IS NULL"),
            {"now": now}
        )
        db.session.commit()

        # 6. Statistik
        result = db.session.execute(text("SELECT COUNT(*) FROM user"))
        user_count = result.scalar()

        print()
        print("=" * 60)
        print(f"✅ Migration abgeschlossen!")
        print(f"📊 {user_count} User erfolgreich migriert")
        print()
        print("⚠️  WICHTIG:")
        print("  - Alle bestehenden User wurden als 'confirmed' markiert")
        print("  - Alle bestehenden User sind 'active'")
        print("  - Neue User benötigen ab jetzt Email-Bestätigung (wenn aktiviert)")
        print()


if __name__ == "__main__":
    print("🚀 WriteHaven User Migration zu Flask-Security-Too")
    print()

    response = input("⚠️  Hast du ein Backup deiner Datenbank erstellt? (ja/nein): ")
    if response.lower() not in ['ja', 'yes', 'y', 'j']:
        print("❌ Bitte erstelle zuerst ein Backup!")
        sys.exit(1)

    print()
    migrate_users()

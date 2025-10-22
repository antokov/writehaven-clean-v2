#!/usr/bin/env python3
"""
Automatic Database Migration
Runs automatically when the app starts to ensure the database schema is up-to-date.

This script is safe to run multiple times (idempotent).
"""

import os
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.exc import OperationalError, ProgrammingError


def get_database_uri():
    """Get database URI from environment"""
    uri = os.getenv("DATABASE_URL")
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql+psycopg://", 1)
    if not uri:
        # Fallback to SQLite for development
        path = os.getenv("SQLITE_PATH", "/tmp/app.db")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        uri = "sqlite:///" + path.replace("\\", "/")
    return uri


def auto_migrate():
    """Automatically migrate the database if needed"""
    try:
        db_uri = get_database_uri()
        engine = create_engine(db_uri)

        with engine.connect() as conn:
            inspector = inspect(engine)

            # Check if user table exists
            if 'user' not in inspector.get_table_names():
                print("Database schema created/verified successfully")
                return

            existing_columns = [col['name'] for col in inspector.get_columns('user')]

            # Check if migration is needed
            needs_migration = 'fs_uniquifier' not in existing_columns

            if needs_migration:
                print("🔄 Auto-migration: Updating user table schema...")

                # Add missing columns (safe with IF NOT EXISTS)
                migration_sqls = [
                    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS username VARCHAR(255);",
                    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS password VARCHAR(255);",
                    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;",
                    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS fs_uniquifier VARCHAR(255);",
                    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP;",
                    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;",
                    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS current_login_at TIMESTAMP;",
                    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(100);",
                    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS current_login_ip VARCHAR(100);",
                    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;",
                ]

                for sql in migration_sqls:
                    try:
                        conn.execute(text(sql))
                        conn.commit()
                    except ProgrammingError:
                        # Column might already exist
                        pass

                # Migrate data
                try:
                    # Copy password_hash to password
                    conn.execute(text("""
                        UPDATE "user"
                        SET password = password_hash
                        WHERE password IS NULL AND password_hash IS NOT NULL
                    """))
                    conn.commit()

                    # Set fs_uniquifier for existing users
                    conn.execute(text("""
                        UPDATE "user"
                        SET fs_uniquifier = 'user_' || id::text || '_' || CAST(EXTRACT(epoch FROM COALESCE(created_at, CURRENT_TIMESTAMP)) AS TEXT)
                        WHERE fs_uniquifier IS NULL
                    """))
                    conn.commit()

                    # Activate and confirm existing users
                    conn.execute(text("""
                        UPDATE "user"
                        SET active = TRUE, confirmed_at = COALESCE(created_at, CURRENT_TIMESTAMP)
                        WHERE active IS NULL
                    """))
                    conn.commit()

                    print("✅ Auto-migration completed successfully")
                except Exception as e:
                    print(f"⚠️  Auto-migration warning: {str(e)}")
                    # Continue anyway - app will work with nullable fields
            else:
                print("Database connected successfully: " + db_uri.split('@')[1] if '@' in db_uri else db_uri[:50] + "...")

    except Exception as e:
        print(f"⚠️  Database migration skipped: {str(e)}")
        # Don't fail app startup if migration fails


if __name__ == "__main__":
    auto_migrate()

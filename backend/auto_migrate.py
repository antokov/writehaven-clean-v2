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
    if uri:
        # Always use psycopg (v3) for PostgreSQL
        if uri.startswith("postgres://"):
            uri = uri.replace("postgres://", "postgresql+psycopg://", 1)
        elif uri.startswith("postgresql://"):
            uri = uri.replace("postgresql://", "postgresql+psycopg://", 1)
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

        # Create engine with proper configuration for both SQLite and PostgreSQL
        if 'postgresql' in db_uri:
            # Use psycopg (version 3) driver
            engine = create_engine(db_uri, pool_pre_ping=True)
        else:
            # SQLite
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

            # Check if worldnode table needs region_id column
            worldnode_needs_migration = False
            if 'worldnode' in inspector.get_table_names():
                worldnode_columns = [col['name'] for col in inspector.get_columns('worldnode')]
                worldnode_needs_migration = 'region_id' not in worldnode_columns

            # Check if scene table needs status column
            scene_needs_status = False
            if 'scene' in inspector.get_table_names():
                scene_columns = [col['name'] for col in inspector.get_columns('scene')]
                scene_needs_status = 'status' not in scene_columns

            if needs_migration:
                print("🔄 Auto-migration: Updating user table schema...")

                # Add missing columns - check each individually for compatibility
                columns_to_add = {
                    'username': 'VARCHAR(255)',
                    'password': 'VARCHAR(255)',
                    'active': 'BOOLEAN DEFAULT TRUE',
                    'fs_uniquifier': 'VARCHAR(255)',
                    'confirmed_at': 'TIMESTAMP',
                    'last_login_at': 'TIMESTAMP',
                    'current_login_at': 'TIMESTAMP',
                    'last_login_ip': 'VARCHAR(100)',
                    'current_login_ip': 'VARCHAR(100)',
                    'login_count': 'INTEGER DEFAULT 0',
                }

                for col_name, col_type in columns_to_add.items():
                    if col_name not in existing_columns:
                        try:
                            sql = f'ALTER TABLE "user" ADD COLUMN {col_name} {col_type};'
                            print(f"  Adding column: {col_name}")
                            conn.execute(text(sql))
                            conn.commit()
                        except (ProgrammingError, OperationalError) as e:
                            # Column might already exist or other DB error
                            print(f"  Warning: Could not add column {col_name}: {e}")
                            try:
                                conn.rollback()
                            except:
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

            # Migrate worldnode table if needed
            if worldnode_needs_migration:
                print("🔄 Auto-migration: Adding region_id to worldnode table...")
                try:
                    conn.execute(text('ALTER TABLE worldnode ADD COLUMN region_id INTEGER;'))
                    conn.commit()
                    print("✅ worldnode.region_id column added successfully")
                except (ProgrammingError, OperationalError) as e:
                    print(f"⚠️  Could not add region_id column: {e}")
                    try:
                        conn.rollback()
                    except:
                        pass

            # Migrate scene table - add status column if it doesn't exist
            # Use PostgreSQL-specific IF NOT EXISTS for safety
            print("🔄 Checking and adding status column to scene table...")
            try:
                if 'postgresql' in db_uri:
                    # PostgreSQL: Use DO block to check and add column if not exists
                    conn.execute(text("""
                        DO $$
                        BEGIN
                            IF NOT EXISTS (
                                SELECT 1 FROM information_schema.columns
                                WHERE table_name = 'scene' AND column_name = 'status'
                            ) THEN
                                ALTER TABLE scene ADD COLUMN status VARCHAR(50) DEFAULT 'Idea';
                                UPDATE scene SET status = 'Idea' WHERE status IS NULL;
                                RAISE NOTICE 'status column added successfully';
                            ELSE
                                RAISE NOTICE 'status column already exists';
                            END IF;
                        END $$;
                    """))
                    conn.commit()
                    print("✅ scene.status column migration completed")
                else:
                    # SQLite fallback
                    if scene_needs_status:
                        conn.execute(text("ALTER TABLE scene ADD COLUMN status VARCHAR(50) DEFAULT 'Idea';"))
                        conn.commit()
                        conn.execute(text("UPDATE scene SET status = 'Idea' WHERE status IS NULL;"))
                        conn.commit()
                        print("✅ scene.status column added successfully")
            except (ProgrammingError, OperationalError) as e:
                print(f"⚠️  Could not add status column: {e}")
                try:
                    conn.rollback()
                except:
                    pass

            if not needs_migration and not worldnode_needs_migration and not scene_needs_status:
                print("Database connected successfully: " + db_uri.split('@')[1] if '@' in db_uri else db_uri[:50] + "...")

    except Exception as e:
        import traceback
        print(f"⚠️  Database migration error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        # Don't fail app startup if migration fails


if __name__ == "__main__":
    auto_migrate()

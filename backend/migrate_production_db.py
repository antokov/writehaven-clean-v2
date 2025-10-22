#!/usr/bin/env python3
"""
Production Database Migration Script
Migrates the user table from the old schema to the new Flask-Security compatible schema.

Usage:
    python migrate_production_db.py

This script is safe to run multiple times (idempotent).
"""

import os
import sys
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.exc import OperationalError

def get_database_uri():
    """Get database URI from environment or use default"""
    uri = os.getenv("DATABASE_URL")
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql+psycopg://", 1)
    if not uri:
        print("ERROR: DATABASE_URL environment variable not set!")
        sys.exit(1)
    return uri


def check_column_exists(engine, table_name, column_name):
    """Check if a column exists in a table"""
    inspector = inspect(engine)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns


def migrate_user_table(engine):
    """Migrate the user table to the new schema"""

    print("=" * 80)
    print("PRODUCTION DATABASE MIGRATION")
    print("=" * 80)
    print()

    with engine.connect() as conn:
        # Check current schema
        print("📋 Checking current schema...")
        inspector = inspect(engine)
        existing_columns = [col['name'] for col in inspector.get_columns('user')]
        print(f"   Existing columns: {', '.join(existing_columns)}")
        print()

        # Define columns to add
        columns_to_add = {
            'username': "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS username VARCHAR(255);",
            'password': "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS password VARCHAR(255);",
            'active': "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;",
            'fs_uniquifier': "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS fs_uniquifier VARCHAR(255) UNIQUE;",
            'confirmed_at': "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP;",
            'last_login_at': "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;",
            'current_login_at': "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS current_login_at TIMESTAMP;",
            'last_login_ip': "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(100);",
            'current_login_ip': "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS current_login_ip VARCHAR(100);",
            'login_count': "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;",
        }

        # Add missing columns
        print("🔧 Adding missing columns...")
        for column_name, sql in columns_to_add.items():
            if column_name not in existing_columns:
                print(f"   Adding column: {column_name}")
                conn.execute(text(sql))
                conn.commit()
            else:
                print(f"   ✓ Column already exists: {column_name}")
        print()

        # Migrate data: Copy password_hash to password for existing users
        print("📦 Migrating existing user data...")
        result = conn.execute(text("""
            UPDATE "user"
            SET password = password_hash
            WHERE password IS NULL AND password_hash IS NOT NULL
        """))
        conn.commit()
        updated_count = result.rowcount
        print(f"   ✓ Migrated password_hash to password for {updated_count} users")
        print()

        # Set fs_uniquifier for users who don't have one
        print("🔑 Setting fs_uniquifier for existing users...")
        result = conn.execute(text("""
            UPDATE "user"
            SET fs_uniquifier = 'user_' || id::text || '_' || extract(epoch from created_at)::text
            WHERE fs_uniquifier IS NULL
        """))
        conn.commit()
        updated_count = result.rowcount
        print(f"   ✓ Set fs_uniquifier for {updated_count} users")
        print()

        # Set active=true for all existing users
        print("✅ Activating existing users...")
        result = conn.execute(text("""
            UPDATE "user"
            SET active = TRUE
            WHERE active IS NULL
        """))
        conn.commit()
        updated_count = result.rowcount
        print(f"   ✓ Activated {updated_count} users")
        print()

        # Set confirmed_at for existing users (they are already confirmed)
        print("📧 Marking existing users as confirmed...")
        result = conn.execute(text("""
            UPDATE "user"
            SET confirmed_at = created_at
            WHERE confirmed_at IS NULL AND created_at IS NOT NULL
        """))
        conn.commit()
        updated_count = result.rowcount
        print(f"   ✓ Confirmed {updated_count} users")
        print()

        # Verify migration
        print("🔍 Verifying migration...")
        result = conn.execute(text("""
            SELECT
                COUNT(*) as total_users,
                COUNT(password) as users_with_password,
                COUNT(fs_uniquifier) as users_with_uniquifier,
                COUNT(confirmed_at) as confirmed_users
            FROM "user"
        """))
        stats = result.fetchone()
        print(f"   Total users: {stats[0]}")
        print(f"   Users with password: {stats[1]}")
        print(f"   Users with fs_uniquifier: {stats[2]}")
        print(f"   Confirmed users: {stats[3]}")
        print()

        # Create Role table if it doesn't exist
        print("👥 Creating Role table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS role (
                id SERIAL PRIMARY KEY,
                name VARCHAR(80) UNIQUE NOT NULL,
                description VARCHAR(255)
            )
        """))
        conn.commit()
        print("   ✓ Role table ready")
        print()

        # Create roles_users junction table if it doesn't exist
        print("🔗 Creating roles_users junction table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS roles_users (
                user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
                role_id INTEGER REFERENCES role(id) ON DELETE CASCADE,
                PRIMARY KEY (user_id, role_id)
            )
        """))
        conn.commit()
        print("   ✓ roles_users table ready")
        print()

    print("=" * 80)
    print("✅ MIGRATION COMPLETED SUCCESSFULLY!")
    print("=" * 80)
    print()
    print("Next steps:")
    print("1. Verify the migration by checking your user table")
    print("2. Test login with existing users")
    print("3. The app should now work with Flask-Security features")
    print()


def main():
    """Main migration function"""
    try:
        # Get database URI
        db_uri = get_database_uri()
        print(f"Connecting to database...")
        print(f"Database: {db_uri.split('@')[1] if '@' in db_uri else 'hidden'}")
        print()

        # Create engine
        engine = create_engine(db_uri)

        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✓ Connected successfully!")
            print(f"  PostgreSQL version: {version.split(',')[0]}")
            print()

        # Run migration
        migrate_user_table(engine)

    except OperationalError as e:
        print(f"❌ ERROR: Could not connect to database!")
        print(f"   {str(e)}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ ERROR during migration: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

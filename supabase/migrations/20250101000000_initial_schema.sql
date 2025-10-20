-- WriteHaven Initial Schema Migration
-- This migration creates all tables needed for the WriteHaven application

-- =============================================================================
-- USER TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(200),
    language VARCHAR(10) DEFAULT 'de',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);

COMMENT ON TABLE "user" IS 'Users of the WriteHaven application';
COMMENT ON COLUMN "user".language IS 'Preferred UI language (de, en, es, fr, it, pt)';

-- =============================================================================
-- PROJECT TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS project (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL DEFAULT 'Neues Projekt',
    description TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Project Settings
    author VARCHAR(200) DEFAULT '',
    genre VARCHAR(100) DEFAULT '',
    language VARCHAR(10) DEFAULT 'de',
    target_audience VARCHAR(100) DEFAULT '',
    estimated_word_count INTEGER DEFAULT 0,
    cover_image_url VARCHAR(500) DEFAULT '',
    share_with_community BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_project_user_id ON project(user_id);
CREATE INDEX IF NOT EXISTS idx_project_updated_at ON project(updated_at DESC);

COMMENT ON TABLE project IS 'Writing projects (books, novels, etc.)';
COMMENT ON COLUMN project.share_with_community IS 'Whether this project is shared publicly in the community';

-- =============================================================================
-- CHAPTER TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS chapter (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL DEFAULT 'Neues Kapitel',
    order_index INTEGER NOT NULL DEFAULT 0,
    content TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chapter_project_id ON chapter(project_id);
CREATE INDEX IF NOT EXISTS idx_chapter_order ON chapter(project_id, order_index);

COMMENT ON TABLE chapter IS 'Chapters within a project';
COMMENT ON COLUMN chapter.order_index IS 'Display order of chapters';

-- =============================================================================
-- SCENE TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS scene (
    id SERIAL PRIMARY KEY,
    chapter_id INTEGER NOT NULL REFERENCES chapter(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL DEFAULT 'Neue Szene',
    content TEXT DEFAULT '',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scene_chapter_id ON scene(chapter_id);
CREATE INDEX IF NOT EXISTS idx_scene_order ON scene(chapter_id, order_index);

COMMENT ON TABLE scene IS 'Scenes within a chapter';
COMMENT ON COLUMN scene.content IS 'Main writing content of the scene';

-- =============================================================================
-- CHARACTER TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS character (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    summary TEXT DEFAULT '',
    avatar_url VARCHAR(500) DEFAULT '',
    profile_json TEXT DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_character_project_id ON character(project_id);
CREATE INDEX IF NOT EXISTS idx_character_name ON character(project_id, name);

COMMENT ON TABLE character IS 'Characters in a writing project';
COMMENT ON COLUMN character.profile_json IS 'Extended character profile data (JSON format)';

-- =============================================================================
-- WORLDNODE TABLE (World Building Elements)
-- =============================================================================
CREATE TABLE IF NOT EXISTS worldnode (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    kind VARCHAR(100) NOT NULL DEFAULT 'Ort',
    summary TEXT DEFAULT '',
    icon VARCHAR(50) DEFAULT '🏰',
    relations_json TEXT DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_worldnode_project_id ON worldnode(project_id);
CREATE INDEX IF NOT EXISTS idx_worldnode_kind ON worldnode(project_id, kind);

COMMENT ON TABLE worldnode IS 'World building elements (locations, items, concepts, etc.)';
COMMENT ON COLUMN worldnode.kind IS 'Type of world element (Ort, Gegenstand, Konzept, etc.)';
COMMENT ON COLUMN worldnode.relations_json IS 'Relationships to other world nodes (JSON format)';

-- =============================================================================
-- TRIGGER: Update updated_at on UPDATE
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_project_updated_at BEFORE UPDATE ON project
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapter_updated_at BEFORE UPDATE ON chapter
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scene_updated_at BEFORE UPDATE ON scene
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

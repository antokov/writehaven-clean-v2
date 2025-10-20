-- WriteHaven Row Level Security (RLS) Policies
-- This migration enables RLS and creates policies to secure data access

-- =============================================================================
-- ENABLE RLS ON ALL TABLES
-- =============================================================================
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE project ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene ENABLE ROW LEVEL SECURITY;
ALTER TABLE character ENABLE ROW LEVEL SECURITY;
ALTER TABLE worldnode ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- USER TABLE POLICIES
-- =============================================================================
-- Users can read their own data
CREATE POLICY "Users can view own profile"
    ON "user"
    FOR SELECT
    USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
    ON "user"
    FOR UPDATE
    USING (auth.uid()::text = id::text);

-- =============================================================================
-- PROJECT TABLE POLICIES
-- =============================================================================
-- Users can view their own projects
CREATE POLICY "Users can view own projects"
    ON project
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

-- Users can view community-shared projects
CREATE POLICY "Users can view shared projects"
    ON project
    FOR SELECT
    USING (share_with_community = true);

-- Users can insert their own projects
CREATE POLICY "Users can create own projects"
    ON project
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
    ON project
    FOR UPDATE
    USING (auth.uid()::text = user_id::text);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
    ON project
    FOR DELETE
    USING (auth.uid()::text = user_id::text);

-- =============================================================================
-- CHAPTER TABLE POLICIES
-- =============================================================================
-- Users can view chapters of their own projects
CREATE POLICY "Users can view own chapters"
    ON chapter
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = chapter.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can view chapters of shared projects
CREATE POLICY "Users can view chapters of shared projects"
    ON chapter
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = chapter.project_id
            AND project.share_with_community = true
        )
    );

-- Users can insert chapters in their own projects
CREATE POLICY "Users can create own chapters"
    ON chapter
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = chapter.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can update chapters in their own projects
CREATE POLICY "Users can update own chapters"
    ON chapter
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = chapter.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can delete chapters in their own projects
CREATE POLICY "Users can delete own chapters"
    ON chapter
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = chapter.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- =============================================================================
-- SCENE TABLE POLICIES
-- =============================================================================
-- Users can view scenes of their own projects
CREATE POLICY "Users can view own scenes"
    ON scene
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM chapter
            JOIN project ON project.id = chapter.project_id
            WHERE chapter.id = scene.chapter_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can view scenes of shared projects
CREATE POLICY "Users can view scenes of shared projects"
    ON scene
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM chapter
            JOIN project ON project.id = chapter.project_id
            WHERE chapter.id = scene.chapter_id
            AND project.share_with_community = true
        )
    );

-- Users can insert scenes in their own projects
CREATE POLICY "Users can create own scenes"
    ON scene
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM chapter
            JOIN project ON project.id = chapter.project_id
            WHERE chapter.id = scene.chapter_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can update scenes in their own projects
CREATE POLICY "Users can update own scenes"
    ON scene
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM chapter
            JOIN project ON project.id = chapter.project_id
            WHERE chapter.id = scene.chapter_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can delete scenes in their own projects
CREATE POLICY "Users can delete own scenes"
    ON scene
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM chapter
            JOIN project ON project.id = chapter.project_id
            WHERE chapter.id = scene.chapter_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- =============================================================================
-- CHARACTER TABLE POLICIES
-- =============================================================================
-- Users can view characters of their own projects
CREATE POLICY "Users can view own characters"
    ON character
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = character.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can view characters of shared projects
CREATE POLICY "Users can view characters of shared projects"
    ON character
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = character.project_id
            AND project.share_with_community = true
        )
    );

-- Users can insert characters in their own projects
CREATE POLICY "Users can create own characters"
    ON character
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = character.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can update characters in their own projects
CREATE POLICY "Users can update own characters"
    ON character
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = character.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can delete characters in their own projects
CREATE POLICY "Users can delete own characters"
    ON character
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = character.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- =============================================================================
-- WORLDNODE TABLE POLICIES
-- =============================================================================
-- Users can view worldnodes of their own projects
CREATE POLICY "Users can view own worldnodes"
    ON worldnode
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = worldnode.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can view worldnodes of shared projects
CREATE POLICY "Users can view worldnodes of shared projects"
    ON worldnode
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = worldnode.project_id
            AND project.share_with_community = true
        )
    );

-- Users can insert worldnodes in their own projects
CREATE POLICY "Users can create own worldnodes"
    ON worldnode
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = worldnode.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can update worldnodes in their own projects
CREATE POLICY "Users can update own worldnodes"
    ON worldnode
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = worldnode.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- Users can delete worldnodes in their own projects
CREATE POLICY "Users can delete own worldnodes"
    ON worldnode
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM project
            WHERE project.id = worldnode.project_id
            AND auth.uid()::text = project.user_id::text
        )
    );

-- =============================================================================
-- NOTE: These RLS policies assume you're using Supabase Auth
-- If using custom JWT auth, you'll need to adjust auth.uid() references
-- to match your JWT claims structure
-- =============================================================================

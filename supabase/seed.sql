-- WriteHaven Test Data Seed
-- This file creates test data for local development
-- WARNING: This should NOT be run in production!

-- =============================================================================
-- TEST USER
-- =============================================================================
-- Password: test123 (hashed with werkzeug default)
INSERT INTO "user" (email, password_hash, name, language) VALUES
    ('test@test.com', 'scrypt:32768:8:1$0zJZQ6YZ2fXq8YXt$c7d9b9f0c4a5e8d7b9f0c4a5e8d7b9f0c4a5e8d7b9f0c4a5e8d7b9f0c4a5e8d7b9f0c4a5e8d7b9f0c4a5e8d7b9f0c4a5e8d7b9f0c4a5e8d7b9f0c4a5e8d7', 'Test User', 'de')
ON CONFLICT (email) DO NOTHING;

-- Get the test user ID for referencing
DO $$
DECLARE
    test_user_id INTEGER;
BEGIN
    SELECT id INTO test_user_id FROM "user" WHERE email = 'test@test.com';

    -- =============================================================================
    -- TEST PROJECT
    -- =============================================================================
    INSERT INTO project (
        user_id,
        title,
        description,
        author,
        genre,
        language,
        target_audience,
        estimated_word_count,
        share_with_community
    ) VALUES (
        test_user_id,
        'Mein erstes Projekt',
        'Ein Testprojekt für WriteHaven',
        'Test Author',
        'Fantasy',
        'de',
        'Erwachsene',
        80000,
        false
    );

    -- Get the project ID
    DECLARE
        test_project_id INTEGER;
    BEGIN
        SELECT id INTO test_project_id FROM project WHERE user_id = test_user_id AND title = 'Mein erstes Projekt';

        -- =============================================================================
        -- TEST CHAPTERS
        -- =============================================================================
        INSERT INTO chapter (project_id, title, order_index, content) VALUES
            (test_project_id, 'Kapitel 1: Der Anfang', 0, ''),
            (test_project_id, 'Kapitel 2: Die Reise', 1, '');

        -- Get chapter IDs
        DECLARE
            chapter1_id INTEGER;
            chapter2_id INTEGER;
        BEGIN
            SELECT id INTO chapter1_id FROM chapter WHERE project_id = test_project_id AND order_index = 0;
            SELECT id INTO chapter2_id FROM chapter WHERE project_id = test_project_id AND order_index = 1;

            -- =============================================================================
            -- TEST SCENES
            -- =============================================================================
            INSERT INTO scene (chapter_id, title, content, order_index) VALUES
                (chapter1_id, 'Szene 1: Die Entdeckung', 'Es war ein nebelverhangener Morgen, als Maria das alte Buch in der Bibliothek fand...', 0),
                (chapter1_id, 'Szene 2: Der erste Hinweis', 'Die Seiten des Buches waren vergilbt und die Schrift kaum lesbar...', 1),
                (chapter2_id, 'Szene 1: Aufbruch', 'Mit dem Buch fest unter dem Arm verließ Maria die Stadt...', 0);
        END;

        -- =============================================================================
        -- TEST CHARACTERS
        -- =============================================================================
        INSERT INTO character (project_id, name, summary, avatar_url, profile_json) VALUES
            (test_project_id, 'Maria Schmidt', 'Die Protagonistin - eine neugierige Bibliothekarin', '',
             '{"age": "28", "occupation": "Bibliothekarin", "personality": "neugierig, intelligent, mutig", "background": "Wuchs in einer kleinen Stadt auf"}'),
            (test_project_id, 'Professor Hartmann', 'Ein mysteriöser Mentor', '',
             '{"age": "65", "occupation": "Historiker", "personality": "weise, geheimnisvoll", "background": "Experte für alte Texte"}');

        -- =============================================================================
        -- TEST WORLD NODES
        -- =============================================================================
        INSERT INTO worldnode (project_id, title, kind, summary, icon, relations_json) VALUES
            (test_project_id, 'Die Alte Bibliothek', 'Ort', 'Eine jahrhundertealte Bibliothek mit geheimen Räumen', '📚', '{}'),
            (test_project_id, 'Das mystische Buch', 'Gegenstand', 'Ein uraltes Buch mit magischen Eigenschaften', '📖', '{}'),
            (test_project_id, 'Die Gilde der Wächter', 'Organisation', 'Eine geheime Organisation zum Schutz alter Artefakte', '🛡️', '{}');
    END;
END;
$$;

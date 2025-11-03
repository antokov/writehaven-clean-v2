-- Migration: Add region_id column to worldnode table
-- Date: 2025-11-03
-- Description: Allows linking world places to map regions

-- Add region_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'worldnode'
        AND column_name = 'region_id'
    ) THEN
        ALTER TABLE worldnode ADD COLUMN region_id INTEGER;
        RAISE NOTICE 'Column region_id added to worldnode table';
    ELSE
        RAISE NOTICE 'Column region_id already exists in worldnode table';
    END IF;
END $$;

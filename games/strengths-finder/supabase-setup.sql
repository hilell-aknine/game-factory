-- ═══════════════════════════════════════════════════
-- Strengths Finder Game - Supabase Table Setup
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════

-- 1. Create the players table
CREATE TABLE IF NOT EXISTS strengths_finder_players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

    -- Game progress
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    hearts INTEGER DEFAULT 5,
    max_hearts INTEGER DEFAULT 5,
    streak INTEGER DEFAULT 0,

    -- Dates
    last_play_date TEXT,
    last_heart_lost TEXT,
    daily_challenge_completed TEXT,
    last_review_date TEXT,

    -- Progress data (JSON)
    completed_lessons JSONB DEFAULT '{}'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    review_queue JSONB DEFAULT '[]'::jsonb,

    -- Stats
    total_correct INTEGER DEFAULT 0,
    total_wrong INTEGER DEFAULT 0,
    stories_created INTEGER DEFAULT 0,
    perfect_lessons INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE strengths_finder_players ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies - users can only access their own data
CREATE POLICY "Users can read own data"
    ON strengths_finder_players
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
    ON strengths_finder_players
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
    ON strengths_finder_players
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_strengths_finder_user_id
    ON strengths_finder_players(user_id);

-- 5. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_strengths_finder_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_strengths_finder_updated_at
    BEFORE UPDATE ON strengths_finder_players
    FOR EACH ROW
    EXECUTE FUNCTION update_strengths_finder_updated_at();

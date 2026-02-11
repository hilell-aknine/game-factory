-- =============================================
-- Social Story Players Table
-- Run this in Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS social_story_players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    hearts INTEGER DEFAULT 5,
    max_hearts INTEGER DEFAULT 5,
    streak INTEGER DEFAULT 0,
    last_play_date TEXT,
    last_heart_lost TIMESTAMPTZ,
    completed_lessons JSONB DEFAULT '{}'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    total_correct INTEGER DEFAULT 0,
    total_wrong INTEGER DEFAULT 0,
    stories_created INTEGER DEFAULT 0,
    perfect_lessons INTEGER DEFAULT 0,
    daily_challenge_completed TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE social_story_players ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own social_story data"
    ON social_story_players FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert own social_story data"
    ON social_story_players FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update own social_story data"
    ON social_story_players FOR UPDATE
    USING (auth.uid() = user_id);

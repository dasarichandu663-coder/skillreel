-- ====================================================================
-- SKILLREEL PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Tagline: Scroll. Learn. Grow.
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- for embedding-based recommendation & search

-- 2. USERS & PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    username VARCHAR(60) UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    is_creator BOOLEAN DEFAULT false,
    creator_title VARCHAR(120),
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    last_active_date DATE DEFAULT CURRENT_DATE,
    learning_goal TEXT,
    career_goal VARCHAR(120),
    daily_goal_minutes INTEGER DEFAULT 15,
    current_skill_level VARCHAR(30) DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER INTERESTS
CREATE TABLE public.user_interests (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    interest VARCHAR(60) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, interest)
);

-- 4. SKILLS & CURRICULUM
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(60) NOT NULL,
    description TEXT,
    icon VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_skills (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    xp_earned INTEGER DEFAULT 0,
    level VARCHAR(30) DEFAULT 'Beginner',
    progress_percentage INTEGER DEFAULT 0,
    completed_lessons INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, skill_id)
);

-- 5. REELS & EDUCATIONAL VIDEOS
CREATE TABLE public.reels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    skill_category VARCHAR(60) NOT NULL,
    difficulty VARCHAR(30) DEFAULT 'Beginner',
    duration_seconds INTEGER DEFAULT 30,
    views_count BIGINT DEFAULT 0,
    likes_count BIGINT DEFAULT 0,
    comments_count BIGINT DEFAULT 0,
    saves_count BIGINT DEFAULT 0,
    shares_count BIGINT DEFAULT 0,
    embedding VECTOR(1536), -- Vector embeddings for semantic search & recommendations
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REEL HASHTAGS
CREATE TABLE public.reel_hashtags (
    reel_id UUID REFERENCES public.reels(id) ON DELETE CASCADE,
    tag VARCHAR(60) NOT NULL,
    PRIMARY KEY (reel_id, tag)
);

-- 7. REEL MICRO-CHALLENGES (QUIZZES)
CREATE TABLE public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reel_id UUID REFERENCES public.reels(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of 4 string options
    correct_option_index SMALLINT NOT NULL,
    explanation TEXT,
    xp_reward INTEGER DEFAULT 10,
    skill_tag VARCHAR(60),
    difficulty VARCHAR(30) DEFAULT 'Beginner',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.challenge_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    selected_option_index SMALLINT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SOCIAL INTERACTIONS (LIKES, SAVES, COMMENTS, FOLLOWS)
CREATE TABLE public.reel_likes (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reel_id UUID REFERENCES public.reels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, reel_id)
);

CREATE TABLE public.reel_saves (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reel_id UUID REFERENCES public.reels(id) ON DELETE CASCADE,
    collection_name VARCHAR(60) DEFAULT 'Favorites',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, reel_id)
);

CREATE TABLE public.follows (
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reel_id UUID REFERENCES public.reels(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. LEARNING PATHS & CURRICULUM
CREATE TABLE public.learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(180) NOT NULL,
    description TEXT,
    category VARCHAR(60) NOT NULL,
    target_role VARCHAR(100),
    difficulty VARCHAR(30) DEFAULT 'Intermediate',
    estimated_hours INTEGER DEFAULT 20,
    banner_url TEXT,
    icon VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.learning_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    lesson_order INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 20,
    xp_reward INTEGER DEFAULT 25,
    lesson_type VARCHAR(30) DEFAULT 'reel',
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_lesson_completions (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.learning_lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, lesson_id)
);

-- 10. REAL-TIME MESSAGING & STUDY GROUPS
CREATE TABLE public.chat_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_group BOOLEAN DEFAULT false,
    group_name VARCHAR(120),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chat_members (
    thread_id UUID REFERENCES public.chat_threads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES public.chat_threads(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    text_content TEXT,
    media_url TEXT,
    message_type VARCHAR(30) DEFAULT 'text', -- text, reel, image, challenge, voice
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. WATCH HISTORY & RECOMMENDATION SIGNALS
CREATE TABLE public.watch_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reel_id UUID REFERENCES public.reels(id) ON DELETE CASCADE,
    watch_seconds INTEGER NOT NULL,
    completed BOOLEAN DEFAULT false,
    watched_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST FEED QUERIES
CREATE INDEX idx_reels_skill ON public.reels(skill_category);
CREATE INDEX idx_reels_created ON public.reels(created_at DESC);
CREATE INDEX idx_reels_likes ON public.reels(likes_count DESC);
CREATE INDEX idx_watch_user ON public.watch_history(user_id);
CREATE INDEX idx_challenge_attempts_user ON public.challenge_attempts(user_id);

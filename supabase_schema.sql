-- جداول قاعدة بيانات منصة كورة غول (Kora Goal)
-- ============================================

-- 1. جدول المباريات
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    home_team TEXT NOT NULL,
    home_logo TEXT,
    away_team TEXT NOT NULL,
    away_logo TEXT,
    match_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'upcoming', -- live, upcoming, finished
    score TEXT DEFAULT '0 - 0',
    tournament TEXT,
    channel TEXT,
    commentator TEXT,
    servers JSONB DEFAULT '[]', -- [{url: "...", label: "Server 1"}]
    external_id TEXT UNIQUE, -- ID من football-data.org لمنع التكرار
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول الأخبار
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'general', -- football, transfers, analysis
    is_ai_generated BOOLEAN DEFAULT TRUE,
    source_url TEXT,
    source_name TEXT DEFAULT 'Sport360',
    slug TEXT UNIQUE, -- لصفحة الخبر الفردي
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول الترتيب
CREATE TABLE IF NOT EXISTS standings (
    id SERIAL PRIMARY KEY,
    league_code TEXT NOT NULL, -- PL, PD, BL1, SA
    league_name TEXT NOT NULL,
    team TEXT NOT NULL,
    team_logo TEXT,
    position INT NOT NULL,
    mp INT DEFAULT 0,  -- matches played
    w INT DEFAULT 0,   -- wins
    d INT DEFAULT 0,   -- draws
    l INT DEFAULT 0,   -- losses
    gf INT DEFAULT 0,  -- goals for
    ga INT DEFAULT 0,  -- goals against
    gd INT DEFAULT 0,  -- goal difference
    pts INT DEFAULT 0, -- points
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(league_code, team)
);

-- 4. جدول البلاغات والصحة
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id),
    server_index INTEGER,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. جدول إحصائيات الزيارات
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    page_path TEXT UNIQUE,
    visitor_count INTEGER DEFAULT 1,
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. جدول رسائل الاتصال
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_time ON matches(match_time);
CREATE INDEX IF NOT EXISTS idx_news_created ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_standings_league ON standings(league_code);

-- جدول الهدافين
CREATE TABLE IF NOT EXISTS scorers (
    id SERIAL PRIMARY KEY,
    league_code TEXT NOT NULL,
    league_name TEXT NOT NULL,
    player_name TEXT NOT NULL,
    team_name TEXT,
    team_logo TEXT,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    played_matches INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(league_code, player_name)
);

-- تعطيل الحماية لسهولة المزامنة حالياً
ALTER TABLE scorers DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE scorers TO anon, authenticated, service_role;

CREATE INDEX IF NOT EXISTS idx_scorers_league ON scorers(league_code);

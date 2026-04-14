export interface MatchServer {
  url: string;
  label: string;
}

export interface MatchData {
  id: number;
  home_team: string;
  home_logo: string | null;
  away_team: string;
  away_logo: string | null;
  match_time: string;
  status: 'live' | 'upcoming' | 'finished';
  score: string;
  tournament: string | null;
  league_logo: string | null;
  league_code: string | null;
  channel: string | null;
  commentator: string | null;
  servers: MatchServer[];
  external_id: string | null;
  created_at?: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string | null;
  content: string | null;
  image_url: string | null;
  category: string;
  is_ai_generated: boolean;
  source_url: string | null;
  source_name: string | null;
  slug: string | null;
  created_at: string;
}

export interface StandingRow {
  id: number;
  league_code: string;
  league_name: string;
  team: string;
  team_logo: string | null;
  position: number;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface HealthReport {
  id: number;
  match_id: number;
  server_index: number;
  status: 'pending' | 'resolved';
  created_at: string;
}

export interface AnalyticsRecord {
  id: number;
  page_path: string;
  visitor_count: number;
  last_visit: string;
}

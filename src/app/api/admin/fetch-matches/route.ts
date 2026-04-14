import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const API_BASE = 'https://api.football-data.org/v4';
const API_KEY = (process.env.FOOTBALL_API_KEY || '').trim();

const LEAGUES = ['PL', 'PD', 'BL1', 'SA', 'FL1', 'CL', 'DED', 'PPL', 'BSA', 'ELC', 'EC', 'CLI'];
const LEAGUE_NAMES: Record<string, string> = {
  PL: 'الدوري الإنجليزي',
  PD: 'الدوري الإسباني',
  BL1: 'الدوري الألماني',
  SA: 'الدوري الإيطالي',
  FL1: 'الدوري الفرنسي',
  CL: 'دوري أبطال أوروبا',
  DED: 'الدوري الهولندي',
  PPL: 'الدوري البرتغالي',
  BSA: 'الدوري البرازيلي',
  ELC: 'دوري الدرجة الأولى الإنجليزي',
  EC: 'بطولة أمم أوروبا',
  CLI: 'كوبا ليبرتادوريس',
};

function mapStatus(apiStatus: string): 'live' | 'upcoming' | 'finished' {
  switch (apiStatus) {
    case 'IN_PLAY':
    case 'PAUSED':
    case 'HALFTIME':
      return 'live';
    case 'FINISHED':
      return 'finished';
    default:
      return 'upcoming';
  }
}

function generateDefaultServers(homeTeam: string, awayTeam: string) {
  return [
    { url: `https://embedme.top/embed/football/1`, label: 'سيرفر 1 (HD)' },
    { url: `https://embedme.top/embed/football/2`, label: 'سيرفر 2 (SD)' },
    { url: `https://embedme.top/embed/football/3`, label: 'سيرفر 3 (بديل)' },
  ];
}

export async function GET() {
  console.log('--- STARTING MANUAL MATCH SYNC ---');
  try {
    console.log('Step 1: Checking API Keys...');
    if (!API_KEY) {
      console.error('ERROR: FOOTBALL_API_KEY is missing');
      return NextResponse.json({ error: 'FOOTBALL_API_KEY not configured' }, { status: 500 });
    }

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const competitionsParam = LEAGUES.join(',');

    console.log(`Step 2: Fetching from API (${competitionsParam}) for dates ${today} to ${tomorrow}`);
    const response = await fetch(
      `${API_BASE}/matches?dateFrom=${today}&dateTo=${tomorrow}&competitions=${competitionsParam}`,
      { headers: { 'X-Auth-Token': API_KEY } }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`Step 2 FAILED: API Status ${response.status}`, text);
      return NextResponse.json({ error: `API Error: ${text}` }, { status: response.status });
    }

    const data = await response.json();
    const matches = data.matches || [];
    console.log(`Step 3: Found ${matches.length} matches to process`);
    
    let processed = 0;

    for (const match of matches) {
      const externalId = String(match.id);
      const homeTeam = match.homeTeam?.shortName || match.homeTeam?.name || 'فريق';
      const awayTeam = match.awayTeam?.shortName || match.awayTeam?.name || 'فريق';
      const status = mapStatus(match.status);
      const homeScore = match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? 0;
      const awayScore = match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? 0;
      const score = status === 'upcoming' ? '0 - 0' : `${homeScore} - ${awayScore}`;

      try {
        const { data: existing } = await supabase
          .from('matches')
          .select('id')
          .eq('external_id', externalId)
          .single();

        if (existing) {
          await supabase.from('matches').update({
            status,
            score,
            match_time: match.utcDate,
          }).eq('external_id', externalId);
        } else {
          await supabase.from('matches').insert({
            home_team: homeTeam,
            home_logo: match.homeTeam?.crest || null,
            away_team: awayTeam,
            away_logo: match.awayTeam?.crest || null,
            match_time: match.utcDate,
            status,
            score,
            tournament: LEAGUE_NAMES[match.competition?.code || ''] || match.competition?.name || '',
            servers: generateDefaultServers(homeTeam, awayTeam),
            external_id: externalId,
          });
        }
        processed++;
      } catch (dbError: any) {
        console.error(`DB Error for match ${externalId}:`, dbError.message);
      }
    }

    console.log(`--- FINISHED MANUAL MATCH SYNC: Processed ${processed} items ---`);
    return NextResponse.json({ success: true, processedCount: processed });
  } catch (error: any) {
    console.error('CRITICAL ERROR in Manual Match Sync:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

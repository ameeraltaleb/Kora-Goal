import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const API_BASE = 'https://api.football-data.org/v4';
const API_KEY = (process.env.FOOTBALL_API_KEY || '').trim();

const LEAGUES = [
  { code: 'PL', name: 'الدوري الإنجليزي' },
  { code: 'PD', name: 'الدوري الإسباني' },
  { code: 'BL1', name: 'الدوري الألماني' },
  { code: 'SA', name: 'الدوري الإيطالي' },
  { code: 'FL1', name: 'الدوري الفرنسي' },
  { code: 'CL', name: 'دوري أبطال أوروبا' },
];

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'FOOTBALL_API_KEY not configured' }, { status: 500 });
    }

    let totalProcessed = 0;

    // First, clear existing scorers to keep it fresh (optional, or just upsert)
    // await supabase.from('scorers').delete().neq('id', 0);

    for (const league of LEAGUES) {
      console.log(`Fetching scorers for ${league.name}...`);
      const response = await fetch(
        `${API_BASE}/competitions/${league.code}/scorers`,
        { headers: { 'X-Auth-Token': API_KEY } }
      );

      if (!response.ok) continue;

      const data = await response.json();
      const scorers = data.scorers || [];

      for (const item of scorers) {
        await supabase.from('scorers').upsert({
          league_code: league.code,
          league_name: league.name,
          player_name: item.player?.name || 'لاعب',
          team_name: item.team?.shortName || item.team?.name || '',
          team_logo: item.team?.crest || null,
          goals: item.goals || 0,
          assists: item.assists || 0,
          played_matches: item.playedMatches || 0,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'league_code,player_name' });
        totalProcessed++;
      }
      
      // Rate limiting: 10 requests per minute
      await new Promise(resolve => setTimeout(resolve, 6000)); 
    }

    return NextResponse.json({ success: true, processedCount: totalProcessed });
  } catch (error: any) {
    console.error('Fetch Scorers Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

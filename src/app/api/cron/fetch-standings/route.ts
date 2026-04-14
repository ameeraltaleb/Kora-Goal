import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const API_BASE = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_API_KEY || '';

const LEAGUES = [
  { code: 'PL', name: 'الدوري الإنجليزي' },
  { code: 'PD', name: 'الدوري الإسباني' },
  { code: 'BL1', name: 'الدوري الألماني' },
  { code: 'SA', name: 'الدوري الإيطالي' },
];

export async function GET(request: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ 
        error: 'FOOTBALL_API_KEY is not configured' 
      }, { status: 500 });
    }

    let totalProcessed = 0;

    for (const league of LEAGUES) {
      const response = await fetch(
        `${API_BASE}/competitions/${league.code}/standings`,
        {
          headers: { 'X-Auth-Token': API_KEY },
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch standings for ${league.code}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const table = data.standings?.[0]?.table || [];

      for (const row of table) {
        const teamName = row.team?.shortName || row.team?.name || '';
        const teamLogo = row.team?.crest || null;

        await supabase
          .from('standings')
          .upsert(
            {
              league_code: league.code,
              league_name: league.name,
              team: teamName,
              team_logo: teamLogo,
              position: row.position,
              mp: row.playedGames || 0,
              w: row.won || 0,
              d: row.draw || 0,
              l: row.lost || 0,
              gf: row.goalsFor || 0,
              ga: row.goalsAgainst || 0,
              gd: row.goalDifference || 0,
              pts: row.points || 0,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'league_code,team',
            }
          );

        totalProcessed++;
      }

      // تأخير بسيط بين الدوريات لتجنب حد الـ Rate Limit
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    return NextResponse.json({
      success: true,
      message: `Updated standings for ${LEAGUES.length} leagues`,
      totalRows: totalProcessed,
    });

  } catch (error: any) {
    console.error('Fetch Standings Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

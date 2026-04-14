import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const API_BASE = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_API_KEY || '';

// الدوريات المدعومة (مجاناً من football-data.org)
const LEAGUES = ['PL', 'PD', 'BL1', 'SA', 'CL'];
const LEAGUE_NAMES: Record<string, string> = {
  PL: 'الدوري الإنجليزي',
  PD: 'الدوري الإسباني',
  BL1: 'الدوري الألماني',
  SA: 'الدوري الإيطالي',
  CL: 'دوري أبطال أوروبا',
};

// تحويل حالة المباراة من الـ API إلى نظامنا
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

// توليد روابط بث تلقائية (placeholder يمكن تعديلها من لوحة التحكم)
function generateDefaultServers(homeTeam: string, awayTeam: string) {
  return [
    { url: `https://embedme.top/embed/football/1`, label: 'سيرفر 1 (HD)' },
    { url: `https://embedme.top/embed/football/2`, label: 'سيرفر 2 (SD)' },
    { url: `https://embedme.top/embed/football/3`, label: 'سيرفر 3 (بديل)' },
  ];
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (process.env.NODE_ENV === 'production') {
      if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (!API_KEY) {
      return NextResponse.json({ 
        error: 'FOOTBALL_API_KEY is not configured. Get a free key at football-data.org' 
      }, { status: 500 });
    }

    // جلب مباريات اليوم من football-data.org (محددة بالدوريات المجانية لتجنب 403)
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // تحويل مصفوفة الدوريات إلى نص مفصولة بفاصلة للرابط
    const competitionsParam = LEAGUES.join(',');

    const response = await fetch(
      `${API_BASE}/matches?dateFrom=${today}&dateTo=${tomorrow}&competitions=${competitionsParam}`,
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Football API Error (${response.status}):`, errorText);
      throw new Error(`Football API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const matches = data.matches || [];

    let upsertedCount = 0;

    for (const match of matches) {
      const externalId = String(match.id);
      const homeTeam = match.homeTeam?.shortName || match.homeTeam?.name || 'فريق';
      const awayTeam = match.awayTeam?.shortName || match.awayTeam?.name || 'فريق';
      const homeLogo = match.homeTeam?.crest || null;
      const awayLogo = match.awayTeam?.crest || null;
      const leagueCode = match.competition?.code || '';
      const tournament = LEAGUE_NAMES[leagueCode] || match.competition?.name || '';
      const status = mapStatus(match.status);
      const homeScore = match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? 0;
      const awayScore = match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? 0;
      const score = status === 'upcoming' ? '0 - 0' : `${homeScore} - ${awayScore}`;

      // تحقق إذا المباراة موجودة مسبقاً
      const { data: existing } = await supabase
        .from('matches')
        .select('id, servers')
        .eq('external_id', externalId)
        .single();

      if (existing) {
        // تحديث المباراة (الحالة والنتيجة فقط — لا نلمس الـ servers اللي عدلها المدير)
        await supabase
          .from('matches')
          .update({
            status,
            score,
            match_time: match.utcDate,
          })
          .eq('external_id', externalId);
      } else {
        // إدخال مباراة جديدة مع سيرفرات افتراضية
        await supabase
          .from('matches')
          .insert({
            home_team: homeTeam,
            home_logo: homeLogo,
            away_team: awayTeam,
            away_logo: awayLogo,
            match_time: match.utcDate,
            status,
            score,
            tournament,
            servers: generateDefaultServers(homeTeam, awayTeam),
            external_id: externalId,
          });
      }
      upsertedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${upsertedCount} matches`,
      totalFromAPI: matches.length,
    });

  } catch (error: any) {
    console.error('Fetch Matches Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

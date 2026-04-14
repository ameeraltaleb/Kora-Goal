import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const API_BASE = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY || '';

// معرفات الدوريات العربية والآسيوية الهامة في API-Sports
const ARABIC_LEAGUES = [
  307, // Saudi Pro League الدوري السعودي
  233, // Egypt Premier League الدوري المصري
  17,  // AFC Champions League دوري أبطال آسيا
  200, // Botola Pro الدوري المغربي
  277, // UAE Pro League الدوري الإماراتي
  286, // Stars League الدوري القطري
];

// تحويل حالة المباراة من API-Football إلى نظامنا
function mapApiSportsStatus(apiStatus: string): 'live' | 'upcoming' | 'finished' {
  const liveStatuses = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'];
  const finishedStatuses = ['FT', 'AET', 'PEN'];
  
  if (liveStatuses.includes(apiStatus)) return 'live';
  if (finishedStatuses.includes(apiStatus)) return 'finished';
  return 'upcoming';
}

function generateDefaultServers(homeTeam: string, awayTeam: string) {
  return [
    { url: `https://embedme.top/embed/football/1`, label: 'سيرفر 1 (HD)' },
    { url: `https://embedme.top/embed/football/2`, label: 'سيرفر 2 (SD)' },
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
        error: 'API_FOOTBALL_KEY is not configured in environment variables.' 
      }, { status: 500 });
    }

    const todayDate = new Date();
    // الحصول على تاريخ اليوم وتاريخ الغد
    const today = todayDate.toISOString().split('T')[0];
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    // لجلب المباريات نقوم بجلب مباريات اليوم والغد
    // للأسف API-Sports لا يدعم dateTo/dateFrom بسهولة بدون اشتراك غالي أو دمج، 
    // لذا سنجلب مباريات اليوم والغد بشكل منفصل ثم ندمجهم.
    
    const fetchFixturesByDate = async (dateStr: string) => {
      const response = await fetch(
        `${API_BASE}/fixtures?date=${dateStr}&timezone=Asia/Riyadh`,
        {
          headers: {
            'x-apisports-key': API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const json = await response.json();
      return json.response || [];
    };

    const [todayMatches, tomorrowMatches] = await Promise.all([
      fetchFixturesByDate(today),
      fetchFixturesByDate(tomorrow)
    ]);

    const allMatches = [...todayMatches, ...tomorrowMatches];
    
    // فلترة الدوريات التي نريدها فقط
    const filteredMatches = allMatches.filter((m: any) => 
      ARABIC_LEAGUES.includes(m.league.id)
    );

    let upsertedCount = 0;

    for (const match of filteredMatches) {
      // نضع بادئة as_ لضمان عدم حدوث تصادم مع API القديم
      const externalId = `as_${match.fixture.id}`;
      const homeTeam = match.teams.home.name;
      const awayTeam = match.teams.away.name;
      const homeLogo = match.teams.home.logo;
      const awayLogo = match.teams.away.logo;
      const tournament = match.league.name;
      
      const status = mapApiSportsStatus(match.fixture.status.short);
      
      const homeGoals = match.goals.home !== null ? match.goals.home : 0;
      const awayGoals = match.goals.away !== null ? match.goals.away : 0;
      const score = status === 'upcoming' ? '0 - 0' : `${homeGoals} - ${awayGoals}`;

      const { data: existing } = await supabase
        .from('matches')
        .select('id')
        .eq('external_id', externalId)
        .single();

      if (existing) {
        await supabase
          .from('matches')
          .update({
            status,
            score,
            match_time: match.fixture.date,
          })
          .eq('external_id', externalId);
      } else {
        await supabase
          .from('matches')
          .insert({
            home_team: homeTeam,
            home_logo: homeLogo,
            away_team: awayTeam,
            away_logo: awayLogo,
            match_time: match.fixture.date,
            status,
            score,
            tournament: tournament,
            servers: generateDefaultServers(homeTeam, awayTeam),
            external_id: externalId,
          });
      }
      upsertedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${upsertedCount} Arabic matches`,
      totalFound: filteredMatches.length,
    });

  } catch (error: any) {
    console.error('Fetch Arabic Matches Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

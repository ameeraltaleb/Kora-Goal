import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get counts from different tables
    const [
      { count: matchesCount },
      { count: newsCount },
      { count: standingsCount },
      { data: recentMatches },
      { data: recentNews },
      { data: recentMessages },
    ] = await Promise.all([
      supabase.from('matches').select('*', { count: 'exact', head: true }),
      supabase.from('news').select('*', { count: 'exact', head: true }),
      supabase.from('standings').select('*', { count: 'exact', head: true }),
      supabase.from('matches').select('id, home_team, away_team, status, score, match_time').order('match_time', { ascending: false }).limit(5),
      supabase.from('news').select('id, title, category, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('contact_messages').select('id, name, email, message, is_read, created_at').order('created_at', { ascending: false }).limit(10),
    ]);

    // Get matches by status
    const { data: liveMatches } = await supabase
      .from('matches')
      .select('id, home_team, away_team, status, score, tournament')
      .eq('status', 'live')
      .order('match_time', { ascending: true });

    const { data: upcomingMatches } = await supabase
      .from('matches')
      .select('id, home_team, away_team, status, match_time')
      .eq('status', 'upcoming')
      .order('match_time', { ascending: true })
      .limit(5);

    const { data: reports } = await supabase
      .from('reports')
      .select('id, match_id, server_index, status, created_at, matches!inner(home_team, away_team)')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      stats: {
        totalMatches: matchesCount || 0,
        totalNews: newsCount || 0,
        totalStandings: standingsCount || 0,
        liveMatches: liveMatches?.length || 0,
        upcomingMatches: upcomingMatches?.length || 0,
        unreadMessages: recentMessages?.filter(m => !m.is_read).length || 0,
      },
      recent: {
        matches: recentMatches || [],
        news: recentNews || [],
        messages: recentMessages || [],
        reports: reports || [],
        upcoming: upcomingMatches || [],
        live: liveMatches || [],
      },
    });
  } catch (error: any) {
    console.error('Admin Dashboard API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stats: {
        totalMatches: 0,
        totalNews: 0,
        totalStandings: 0,
        liveMatches: 0,
        upcomingMatches: 0,
        unreadMessages: 0,
      },
      recent: {
        matches: [],
        news: [],
        messages: [],
        reports: [],
        upcoming: [],
        live: [],
      },
    }, { status: 500 });
  }
}

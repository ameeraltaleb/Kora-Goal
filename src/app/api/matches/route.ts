import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'today';

    const now = new Date();
    let dateFrom: string;
    let dateTo: string;

    if (tab === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      dateFrom = yesterday.toISOString().split('T')[0] + 'T00:00:00Z';
      dateTo = yesterday.toISOString().split('T')[0] + 'T23:59:59Z';
    } else if (tab === 'tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateFrom = tomorrow.toISOString().split('T')[0] + 'T00:00:00Z';
      dateTo = tomorrow.toISOString().split('T')[0] + 'T23:59:59Z';
    } else {
      dateFrom = now.toISOString().split('T')[0] + 'T00:00:00Z';
      dateTo = now.toISOString().split('T')[0] + 'T23:59:59Z';
    }

    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .gte('match_time', dateFrom)
      .lte('match_time', dateTo)
      .order('match_time', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ matches: matches || [] });

  } catch (error: any) {
    console.error('Matches API Error:', error);
    return NextResponse.json({ matches: [], error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // SECURITY: Optional: Add Authorization header check here to ensure only Vercel can trigger it.
    // e.g., if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) ...

    const now = new Date();
    
    // 1. Mark 'upcoming' as 'live' if match_time <= now
    const { error: liveError } = await supabase
      .from('matches')
      .update({ status: 'live' })
      .eq('status', 'upcoming')
      .lte('match_time', now.toISOString());
      
    if (liveError) throw liveError;

    // 2. Mark 'live' as 'finished' if match_time <= (now - 2 hours)
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const { error: finishError } = await supabase
      .from('matches')
      .update({ status: 'finished' })
      .eq('status', 'live')
      .lte('match_time', twoHoursAgo.toISOString());
      
    if (finishError) throw finishError;

    return NextResponse.json({ success: true, message: "Match statuses updated successfully" });
  } catch (error: any) {
    console.error("Cron Update Status Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

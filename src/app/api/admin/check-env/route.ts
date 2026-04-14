import { NextResponse } from 'next/server';

export async function GET() {
  const envStatus = {
    SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    FOOTBALL_API: !!process.env.FOOTBALL_API_KEY,
    GEMINI_API: !!process.env.GEMINI_API_KEY,
    CRON_SECRET: !!process.env.CRON_SECRET,
    ADMIN_USER: !!process.env.ADMIN_USER,
    ADMIN_PWD: !!process.env.ADMIN_PASSWORD,
    NODE_ENV: process.env.NODE_ENV,
    
    // Partial preview for debugging (Security: only show first 4 chars)
    previews: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 15) + '...',
      footballKey: process.env.FOOTBALL_API_KEY ? process.env.FOOTBALL_API_KEY.substring(0, 4) + '...' : 'MISSING',
    }
  };

  return NextResponse.json({
    success: true,
    message: "Environment Health Check",
    status: envStatus
  });
}

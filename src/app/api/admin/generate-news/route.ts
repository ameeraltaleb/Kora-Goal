import { NextResponse } from 'next/server';
import { summarizeNews } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { rawText, category } = await request.json();

    if (!rawText) {
      return NextResponse.json({ error: 'Raw text is required' }, { status: 400 });
    }

    // Call Gemini to summarize
    const aiData = await summarizeNews(rawText);

    // Save to Supabase
    const { data, error } = await supabase
      .from('news')
      .insert([
        { 
          title: aiData.title,
          summary: aiData.content,
          category: category || 'general',
          is_ai_generated: true
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { summarizeNews } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { rawText, category } = await request.json();

    if (!rawText) {
      return NextResponse.json({ error: 'Raw text is required' }, { status: 400 });
    }

    // Call Gemini to summarize
    const aiData = await summarizeNews(rawText);

    // Generate slug
    let slug = slugify(aiData.title);
    const { data: slugCheck } = await supabase.from('news').select('id').eq('slug', slug).single();
    if (slugCheck) {
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('news')
      .insert([
        {
          title: aiData.title,
          summary: aiData.content,
          category: category || 'general',
          is_ai_generated: true,
          slug
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { summarizeNews } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8'
  }
});

export async function GET() {
  try {
    // Using Sport360 as the most stable Arabic sports RSS source
    const feed = await parser.parseURL('https://arabic.sport360.com/feed');
    console.log(`Fetched ${feed.items.length} news items from Goal.com`);

    let processedItems = [];
    const itemsToProcess = feed.items.slice(0, 3); // Process top 3 for speed

    for (const item of itemsToProcess) {
      // Check if title or content already exists to avoid duplicates
      const { data: existing } = await supabase
        .from('news')
        .select('id')
        .eq('title', item.title?.substring(0, 100))
        .single();

      if (!existing) {
      // Generate AI Summary
      const rawText = `${item.title}\n\n${item.contentSnippet || item.content || ''}`;
      const summary = await summarizeNews(rawText);

      processedItems.push({
        originalTitle: item.title,
        aiSummary: summary
      });

      // Save to DB (Optional: only if supabase is configured)
      try {
        await supabase
          .from('news')
          .insert([
            {
              title: item.title?.substring(0, 100),
              summary: summary,
              category: 'football',
              is_ai_generated: true,
              created_at: new Date().toISOString()
            }
          ]);
      } catch (dbError) {
        console.warn("Could not save to Supabase, but AI summary is generated:", dbError);
      }
    }
  }

    return NextResponse.json({ 
      success: true, 
      totalFound: feed.items.length,
      processedCount: processedItems.length,
      latestNews: processedItems
    });
  } catch (error: any) {
    console.error("News Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
